package services

import (
	"context"
	"listings-service/internal/models"
	"log"

	"gorm.io/gorm"
)

type CleanupService struct {
	db *gorm.DB
}

func NewCleanupService(db *gorm.DB) *CleanupService {
	return &CleanupService{db: db}
}

func (s *CleanupService) RemoveInactiveListings(ctx context.Context, ddfService *DDFService, propertyType string) error {
	var allListings []models.Property
	var err error

	switch propertyType {
	case "residential":
		err = s.db.Model(&models.ResidentialProperty{}).Find(&allListings).Error
	case "commercial":
		err = s.db.Model(&models.CommercialProperty{}).Find(&allListings).Error
	}

	if err != nil {
		return err
	}

	if len(allListings) == 0 {
		return nil
	}

	log.Printf("Checking %d %s listings for removal", len(allListings), propertyType)

	validListings, err := ddfService.FilterExistingListings(ctx, allListings)
	if err != nil {
		return err
	}

	validKeys := make(map[string]bool)
	for _, listing := range validListings {
		validKeys[listing.ListingKey] = true
	}

	var keysToRemove []string
	for _, listing := range allListings {
		if !validKeys[listing.ListingKey] {
			keysToRemove = append(keysToRemove, listing.ListingKey)
		}
	}

	if len(keysToRemove) == 0 {
		log.Printf("No inactive %s listings to remove", propertyType)
		return nil
	}

	log.Printf("Removing %d inactive %s listings", len(keysToRemove), propertyType)

	return s.db.Transaction(func(tx *gorm.DB) error {
		switch propertyType {
		case "residential":
			if err := tx.Where("resource_record_key IN ?", keysToRemove).Delete(&models.ResidentialMedia{}).Error; err != nil {
				return err
			}
			if err := tx.Where("listing_key IN ?", keysToRemove).Delete(&models.ResidentialProperty{}).Error; err != nil {
				return err
			}
		case "commercial":
			if err := tx.Where("resource_record_key IN ?", keysToRemove).Delete(&models.CommercialMedia{}).Error; err != nil {
				return err
			}
			if err := tx.Where("listing_key IN ?", keysToRemove).Delete(&models.CommercialProperty{}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
