package database

import (
	"fmt"
	"listings-service/internal/config"
	"listings-service/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresDB(cfg config.DatabaseConfig, databaseName string) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, databaseName, cfg.Port, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database %s: %w", databaseName, err)
	}

	err = db.AutoMigrate(
		&models.ResidentialProperty{},
		&models.CommercialProperty{},
		&models.ResidentialMedia{},
		&models.CommercialMedia{},
		&models.ReplicationLog{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database %s: %w", databaseName, err)
	}

	return db, nil
}

func CreateDatabaseIfNotExists(cfg config.DatabaseConfig, databaseName string) error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%d sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.Port, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to postgres: %w", err)
	}

	result := db.Exec(fmt.Sprintf("CREATE DATABASE %s", databaseName))
	if result.Error != nil {
		// Database might already exist, which is fine
	}

	return nil
}
