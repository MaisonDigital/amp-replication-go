package services

import (
	"context"
	"fmt"
	"listings-service/internal/config"
	"listings-service/internal/database"
	"listings-service/internal/models"
	"log"
	"strings"

	"gorm.io/gorm"
)

type Orchestrator struct {
	config *config.Config
}

func NewOrchestrator(cfg *config.Config) *Orchestrator {
	return &Orchestrator{
		config: cfg,
	}
}

func (o *Orchestrator) PullFeeds(ctx context.Context) error {
	for mlsName, mlsConfig := range o.config.MLSSystems {
		if !mlsConfig.Active {
			continue
		}

		if err := database.CreateDatabaseIfNotExists(o.config.Database, mlsConfig.DatabaseName); err != nil {
			log.Printf("Could not create database %s: %v (may already exist)", mlsConfig.DatabaseName, err)
		}

		db, err := database.NewPostgresDB(o.config.Database, mlsConfig.DatabaseName)
		if err != nil {
			return fmt.Errorf("failed to connect to %s database: %w", mlsName, err)
		}

		switch mlsName {
		case "trreb":
			if err := o.processTRREB(ctx, mlsConfig, db); err != nil {
				return fmt.Errorf("failed to process TRREB: %w", err)
			}
		default:
			log.Printf("Unknown MLS type: %s", mlsName)
		}
	}

	return nil
}

func (o *Orchestrator) processTRREB(ctx context.Context, mlsConfig config.MLSConfig, db *gorm.DB) error {
	trrebService := NewTRREBService(mlsConfig, db)
	persistenceService := NewPersistenceService(db)
	ddfService := NewDDFService(o.config.DDF)

	log.Println("Processing residential listings...")
	if err := o.processPropertyType(ctx, trrebService, persistenceService, ddfService, "residential"); err != nil {
		return fmt.Errorf("failed to process residential listings: %w", err)
	}

	log.Println("Processing commercial listings...")
	if err := o.processPropertyType(ctx, trrebService, persistenceService, ddfService, "commercial"); err != nil {
		return fmt.Errorf("failed to process commercial listings: %w", err)
	}

	log.Println("TRREB sync complete for all property types")
	return nil
}

func (o *Orchestrator) processPropertyType(ctx context.Context, trrebService *TRREBService, persistenceService *PersistenceService, ddfService *DDFService, propertyType string) error {
	var listings []models.Property
	var err error

	switch propertyType {
	case "residential":
		listings, err = trrebService.GetResidentialListings(ctx)
	case "commercial":
		listings, err = trrebService.GetCommercialListings(ctx)
	default:
		return fmt.Errorf("unknown property type: %s", propertyType)
	}

	if err != nil {
		return err
	}

	if len(listings) == 0 {
		log.Printf("No updated %s listings found", propertyType)
		return nil
	}

	// Enrich with media
	log.Printf("Enriching %s listings with media...", propertyType)
	if err := trrebService.EnrichListingsWithMedia(ctx, listings, propertyType); err != nil {
		return err
	}

	// log.Printf("Skipping media enrichment for %s listings (for speed)...", propertyType)

	// Enrich with coordinates from DDF
	log.Printf("Enriching %d %s listings with geo coordinates...", len(listings), propertyType)
	if err := ddfService.EnrichListingsWithCoordinates(ctx, listings); err != nil {
		log.Printf("Warning: DDF enrichment failed: %v", err)
		// Continue without coordinates rather than failing completely
	}

	log.Printf("Saving %s listings to database...", propertyType)
	switch propertyType {
	case "residential":
		if err := persistenceService.SaveResidentialListings(listings); err != nil {
			return err
		}
	case "commercial":
		if err := persistenceService.SaveCommercialListings(listings); err != nil {
			return err
		}
	}

	source := fmt.Sprintf("TRREB_%s", strings.ToUpper(propertyType))
	log.Printf("%s listings saved. Updating replication timestamp...", propertyType)
	if err := trrebService.UpdateReplicationTimestamp(source); err != nil {
		return err
	}

	log.Printf("%s sync complete - %d listings processed", propertyType, len(listings))
	return nil
}
