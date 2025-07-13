package config

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Database   DatabaseConfig       `mapstructure:"database"`
	MLSSystems map[string]MLSConfig `mapstructure:"mls_systems"`
	DDF        DDFConfig            `mapstructure:"ddf"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	SSLMode  string `mapstructure:"sslmode"`
}

type MLSConfig struct {
	BaseURL           string `mapstructure:"base_url"`
	Token             string `mapstructure:"token"`
	DatabaseName      string `mapstructure:"database_name"`
	IncludeCommercial bool   `mapstructure:"include_commercial"`
	Active            bool   `mapstructure:"active"`
}

type DDFConfig struct {
	TokenURL     string `mapstructure:"token_url"`
	ClientID     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	APIURL       string `mapstructure:"api_url"`
}

func Load() (*Config, error) {
	// Configure Viper for environment variables
	viper.AutomaticEnv()
	viper.SetEnvPrefix("LISTINGS")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Try to read config file but don't fail if it doesn't exist
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	// Read config file if it exists, but continue if it doesn't
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			// Config file was found but another error was produced
			return nil, err
		}
		// Config file not found; use environment variables only
	}

	// Set defaults
	setDefaults()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	log.Printf("Config loaded - Host: %s, User: %s, Password: [%d chars]",
		config.Database.Host,
		config.Database.User,
		len(config.Database.Password))

	return &config, nil
}

func setDefaults() {
	// Database defaults
	viper.SetDefault("database.host", "postgres")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.user", "postgres")
	viper.SetDefault("database.password", "")
	viper.SetDefault("database.name", "trreb_listings")
	viper.SetDefault("database.sslmode", "disable")

	// MLS Systems defaults (these will be overridden by environment variables)
	viper.SetDefault("mls_systems.trreb.include_commercial", false)
	viper.SetDefault("mls_systems.trreb.active", true)
}
