package services

import (
	"listings-service/internal/models"
	"log"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PersistenceService struct {
	db *gorm.DB
}

func NewPersistenceService(db *gorm.DB) *PersistenceService {
	return &PersistenceService{db: db}
}

func (s *PersistenceService) SaveResidentialListings(listings []models.Property) error {
	const batchSize = 500

	log.Printf("Saving %d residential listings", len(listings))

	for i := 0; i < len(listings); i += batchSize {
		end := min(i+batchSize, len(listings))
		batch := listings[i:end]

		if err := s.saveResidentialBatch(batch); err != nil {
			return err
		}
	}

	log.Println("Residential listings saved to database")
	return nil
}

func (s *PersistenceService) SaveCommercialListings(listings []models.Property) error {
	const batchSize = 500

	log.Printf("Saving %d commercial listings", len(listings))

	for i := 0; i < len(listings); i += batchSize {
		end := min(i+batchSize, len(listings))
		batch := listings[i:end]

		if err := s.saveCommercialBatch(batch); err != nil {
			return err
		}
	}

	log.Println("Commercial listings saved to database")
	return nil
}

func (s *PersistenceService) saveResidentialBatch(batch []models.Property) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var listingKeys []string
		for _, property := range batch {
			listingKeys = append(listingKeys, property.ListingKey)
		}

		if err := tx.Where("resource_record_key IN ?", listingKeys).Delete(&models.ResidentialMedia{}).Error; err != nil {
			return err
		}

		for _, property := range batch {
			resProperty := models.ResidentialProperty{Property: property}
			media := property.Media
			resProperty.Media = nil

			if err := tx.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "listing_key"}},
				UpdateAll: true,
			}).Create(&resProperty).Error; err != nil {
				return err
			}

			for _, mediaItem := range media {
				resMedia := models.ResidentialMedia{Media: mediaItem}
				if err := tx.Clauses(clause.OnConflict{
					Columns:   []clause.Column{{Name: "media_key"}},
					UpdateAll: true,
				}).Create(&resMedia).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func (s *PersistenceService) saveCommercialBatch(batch []models.Property) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var listingKeys []string
		for _, property := range batch {
			listingKeys = append(listingKeys, property.ListingKey)
		}

		if err := tx.Where("resource_record_key IN ?", listingKeys).Delete(&models.CommercialMedia{}).Error; err != nil {
			return err
		}

		for _, property := range batch {
			comProperty := models.CommercialProperty{Property: property}
			media := property.Media
			comProperty.Media = nil

			if err := tx.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "listing_key"}},
				UpdateAll: true,
			}).Create(&comProperty).Error; err != nil {
				return err
			}

			for _, mediaItem := range media {
				comMedia := models.CommercialMedia{Media: mediaItem}
				if err := tx.Clauses(clause.OnConflict{
					Columns:   []clause.Column{{Name: "media_key"}},
					UpdateAll: true,
				}).Create(&comMedia).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}
