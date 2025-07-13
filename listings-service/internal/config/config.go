package config

import (
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
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
