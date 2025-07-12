package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"listings-service/internal/config"
	"listings-service/internal/models"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type DDFService struct {
	config     config.DDFConfig
	httpClient *http.Client
	token      string
	tokenExp   time.Time
}

func NewDDFService(cfg config.DDFConfig) *DDFService {
	transport := &http.Transport{
		ForceAttemptHTTP2: false,
	}

	return &DDFService{
		config: cfg,
		httpClient: &http.Client{
			Timeout:   60 * time.Second,
			Transport: transport,
		},
	}
}

type DDFTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
}

type DDFBatchResponse struct {
	Value []DDFProperty `json:"value"`
}

type DDFProperty struct {
	ListingID string   `json:"ListingId"`
	Latitude  *float64 `json:"Latitude"`
	Longitude *float64 `json:"Longitude"`
}

func (s *DDFService) getAccessToken(ctx context.Context) (string, error) {
	if s.token != "" && time.Now().Before(s.tokenExp) {
		return s.token, nil
	}

	log.Printf("Requesting new DDF token")

	data := map[string]string{
		"client_id":     s.config.ClientID,
		"client_secret": s.config.ClientSecret,
		"grant_type":    "client_credentials",
		"scope":         "DDFApi_Read",
	}

	formData := ""
	for key, value := range data {
		if formData != "" {
			formData += "&"
		}
		formData += fmt.Sprintf("%s=%s", key, value)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", s.config.TokenURL,
		strings.NewReader(formData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Token request failed: HTTP %d: %s", resp.StatusCode, string(body))
		return "", fmt.Errorf("token request failed: HTTP %d: %s", resp.StatusCode, string(body))
	}

	var tokenResp DDFTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	s.token = tokenResp.AccessToken
	s.tokenExp = time.Now().Add(55 * time.Minute)

	log.Printf("Acquired DDF token")

	return s.token, nil
}

func (s *DDFService) EnrichListingsWithCoordinates(ctx context.Context, listings []models.Property) error {
	const batchSize = 25
	const maxParallel = 3

	token, err := s.getAccessToken(ctx)
	if err != nil {
		return fmt.Errorf("failed to get DDF token: %w", err)
	}

	var batches [][]models.Property
	for i := 0; i < len(listings); i += batchSize {
		end := min(i+batchSize, len(listings))
		batches = append(batches, listings[i:end])
	}

	log.Printf("Processing %d batches with %d parallel workers", len(batches), maxParallel)

	sem := make(chan struct{}, maxParallel)
	var wg sync.WaitGroup
	successfulBatches := 0
	totalMatches := 0
	var mu sync.Mutex

	for batchIndex, batch := range batches {
		wg.Add(1)
		go func(batchListings []models.Property, index int) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			matches, err := s.fetchCoordinatesForBatch(ctx, token, batchListings)

			mu.Lock()
			if err != nil {
				log.Printf("Batch %d failed: %v", index+1, err)
			} else {
				successfulBatches++
				totalMatches += matches
			}
			mu.Unlock()

			time.Sleep(100 * time.Millisecond)
		}(batch, batchIndex)
	}

	wg.Wait()
	log.Printf("DDF enrichment complete: %d/%d batches successful, %d coordinates matched", successfulBatches, len(batches), totalMatches)
	return nil
}

func (s *DDFService) fetchCoordinatesForBatch(ctx context.Context, token string, listings []models.Property) (int, error) {
	var listingKeys []string
	for _, listing := range listings {
		listingKeys = append(listingKeys, fmt.Sprintf("'%s'", listing.ListingKey))
	}

	filter := fmt.Sprintf("ListingId in (%s)", strings.Join(listingKeys, ","))
	encodedFilter := url.QueryEscape(filter)

	requestURL := fmt.Sprintf("%s/Property?$select=ListingId,Latitude,Longitude&$filter=%s",
		s.config.APIURL, encodedFilter)

	req, err := http.NewRequestWithContext(ctx, "GET", requestURL, nil)
	if err != nil {
		return 0, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "listings-service/1.0")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return 0, fmt.Errorf("DDF request failed: HTTP %d: %s", resp.StatusCode, string(body))
	}

	var ddfResult DDFBatchResponse
	if err := json.NewDecoder(resp.Body).Decode(&ddfResult); err != nil {
		return 0, err
	}

	matchCount := 0
	for _, ddfProperty := range ddfResult.Value {
		for i := range listings {
			if listings[i].ListingKey == ddfProperty.ListingID {
				listings[i].Latitude = ddfProperty.Latitude
				listings[i].Longitude = ddfProperty.Longitude
				matchCount++
				break
			}
		}
	}

	return matchCount, nil
}
