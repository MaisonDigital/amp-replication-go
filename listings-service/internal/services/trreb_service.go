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
	"sync"
	"time"

	"gorm.io/gorm"
)

type TRREBService struct {
	config     config.MLSConfig
	httpClient *http.Client
	db         *gorm.DB
}

func NewTRREBService(cfg config.MLSConfig, db *gorm.DB) *TRREBService {
	return &TRREBService{
		config: cfg,
		httpClient: &http.Client{
			Timeout: 120 * time.Second,
		},
		db: db,
	}
}

type TRREBResponse struct {
	ODataCount *int              `json:"@odata.count,omitempty"`
	Value      []models.Property `json:"value"`
}

type MediaResponse struct {
	Value []models.Media `json:"value"`
}

func (s *TRREBService) GetResidentialListings(ctx context.Context) ([]models.Property, error) {
	lastRun, err := s.getLastReplicationTime("TRREB_RESIDENTIAL")
	if err != nil {
		return nil, fmt.Errorf("failed to get last replication time: %w", err)
	}

	filter := s.buildResidentialFilter(lastRun)
	return s.getListingsByFilter(ctx, filter, "residential")
}

func (s *TRREBService) GetCommercialListings(ctx context.Context) ([]models.Property, error) {
	lastRun, err := s.getLastReplicationTime("TRREB_COMMERCIAL")
	if err != nil {
		return nil, fmt.Errorf("failed to get last replication time: %w", err)
	}

	filter := s.buildCommercialFilter(lastRun)
	return s.getListingsByFilter(ctx, filter, "commercial")
}

func (s *TRREBService) buildResidentialFilter(lastRun *time.Time) string {
	filter := "contains(PropertyType, 'Residential') and StandardStatus eq 'Active' and CountyOrParish eq 'Ottawa'"

	if lastRun != nil {
		filter += fmt.Sprintf(" and ModificationTimestamp gt %s", lastRun.Format(time.RFC3339Nano))
	}

	return filter
}

func (s *TRREBService) buildCommercialFilter(lastRun *time.Time) string {
	filter := "PropertyType eq 'Commercial' and StandardStatus eq 'Active' and CountyOrParish eq 'Ottawa'"

	if lastRun != nil {
		filter += fmt.Sprintf(" and ModificationTimestamp gt %s", lastRun.Format(time.RFC3339Nano))
	}

	return filter
}

func (s *TRREBService) getListingsByFilter(ctx context.Context, filter, propertyType string) ([]models.Property, error) {
	var allListings []models.Property

	totalCount, err := s.getTotalCount(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get total count: %w", err)
	}

	log.Printf("Total %s listings to fetch: %d", propertyType, totalCount)

	const pageSize = 5000
	skip := 0

	for skip < totalCount && skip < 100000 {
		log.Printf("Fetching %s batch: skip=%d, remaining=%d", propertyType, skip, totalCount-skip)

		batch, err := s.fetchBatch(ctx, filter, skip, pageSize)
		if err != nil {
			log.Printf("Failed to fetch %s batch at skip=%d: %v", propertyType, skip, err)
			break
		}

		if len(batch) == 0 {
			log.Printf("TRREB API returned empty array at skip=%d", skip)
			break
		}

		log.Printf("Fetched %d %s listings (total so far: %d)", len(batch), propertyType, len(allListings)+len(batch))
		allListings = append(allListings, batch...)
		skip += len(batch)

		if skip < totalCount && skip < 100000 {
			time.Sleep(1 * time.Second)
		}
	}

	log.Printf("Returning %d %s listings from TRREB (expected: %d)", len(allListings), propertyType, totalCount)
	return allListings, nil
}

func (s *TRREBService) getTotalCount(ctx context.Context, filter string) (int, error) {
	countURL := fmt.Sprintf("%sProperty?$top=0&$count=true&$filter=%s",
		s.config.BaseURL, filter)

	log.Printf("TRREB COUNT URL: %s", countURL)

	req, err := http.NewRequestWithContext(ctx, "GET", countURL, nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("Authorization", "Bearer "+s.config.Token)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return 0, fmt.Errorf("HTTP %d: %s", resp.StatusCode, string(body))
	}

	var countResponse TRREBResponse
	if err := json.NewDecoder(resp.Body).Decode(&countResponse); err != nil {
		return 0, err
	}

	if countResponse.ODataCount == nil {
		return 0, fmt.Errorf("count not returned in response")
	}

	totalCount := *countResponse.ODataCount
	log.Printf("📊 TRREB API reports %d total listings", totalCount)

	return totalCount, nil
}

func (s *TRREBService) fetchBatch(ctx context.Context, filter string, skip, top int) ([]models.Property, error) {
	requestURL := fmt.Sprintf("%sProperty?$top=%d&$skip=%d&$orderby=ModificationTimestamp desc&$filter=%s",
		s.config.BaseURL, top, skip, filter)

	req, err := http.NewRequestWithContext(ctx, "GET", requestURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+s.config.Token)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, string(body))
	}

	var response TRREBResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	if len(response.Value) > 0 {
		log.Printf("✅ First listing key: %s", response.Value[0].ListingKey)
	}

	return response.Value, nil
}

func (s *TRREBService) EnrichListingsWithMedia(ctx context.Context, listings []models.Property, propertyType string) error {
	const batchSize = 100
	const maxParallel = 3

	log.Printf("Starting media enrichment for %d %s listings", len(listings), propertyType)

	listingMap := make(map[string]*models.Property)
	var listingKeys []string

	for i := range listings {
		listingMap[listings[i].ListingKey] = &listings[i]
		listingKeys = append(listingKeys, listings[i].ListingKey)
	}

	var batches [][]string
	for i := 0; i < len(listingKeys); i += batchSize {
		end := min(i+batchSize, len(listingKeys))
		batches = append(batches, listingKeys[i:end])
	}

	log.Printf("Enriching %s listings with media in %d batches of %d...", propertyType, len(batches), batchSize)

	sem := make(chan struct{}, maxParallel)
	var wg sync.WaitGroup
	var mutex sync.Mutex
	totalAssigned := 0

	for batchIndex, batch := range batches {
		wg.Add(1)
		go func(batchKeys []string, index int) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			assigned, err := s.fetchMediaForBatch(ctx, batchKeys, listingMap)
			if err != nil {
				log.Printf("Media batch %d failed: %v", index+1, err)
			} else {
				mutex.Lock()
				totalAssigned += assigned
				mutex.Unlock()
				if index%50 == 0 {
					log.Printf("Media batch %d/%d complete - %d assigned so far", index+1, len(batches), totalAssigned)
				}
			}

			time.Sleep(100 * time.Millisecond)
		}(batch, batchIndex)
	}

	wg.Wait()
	log.Printf("All %s media enrichment complete - %d total listings got media", propertyType, totalAssigned)
	return nil
}

func (s *TRREBService) fetchMediaForBatch(ctx context.Context, listingKeys []string, listingMap map[string]*models.Property) (int, error) {
	assignedCount := 0

	for _, listingKey := range listingKeys {
		filter := fmt.Sprintf("ResourceRecordKey eq '%s' and MediaStatus ne 'Deleted' and (ImageSizeDescription eq 'Thumbnail' or ImageSizeDescription eq 'Medium')", listingKey)
		requestURL := fmt.Sprintf("%sMedia?$filter=%s", s.config.BaseURL, filter)

		req, err := http.NewRequestWithContext(ctx, "GET", requestURL, nil)
		if err != nil {
			continue
		}
		req.Header.Set("Authorization", "Bearer "+s.config.Token)

		resp, err := s.httpClient.Do(req)
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			continue
		}

		var mediaResponse MediaResponse
		if err := json.NewDecoder(resp.Body).Decode(&mediaResponse); err != nil {
			continue
		}

		if len(mediaResponse.Value) > 0 {
			if property, exists := listingMap[listingKey]; exists {
				property.Media = mediaResponse.Value
				assignedCount++
				log.Printf("Assigned %d media items to %s", len(mediaResponse.Value), listingKey)
			}
		}

		time.Sleep(50 * time.Millisecond)
	}

	return assignedCount, nil
}

func (s *TRREBService) getLastReplicationTime(source string) (*time.Time, error) {
	var log models.ReplicationLog
	err := s.db.Where("source = ?", source).First(&log).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &log.LastReplicatedAt, nil
}

func (s *TRREBService) UpdateReplicationTimestamp(source string) error {
	var log models.ReplicationLog
	err := s.db.Where("source = ?", source).First(&log).Error

	if err == gorm.ErrRecordNotFound {
		log = models.ReplicationLog{
			Source:           source,
			LastReplicatedAt: time.Now().UTC(),
		}
		return s.db.Create(&log).Error
	} else if err != nil {
		return err
	}

	log.LastReplicatedAt = time.Now().UTC()
	return s.db.Save(&log).Error
}
