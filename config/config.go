package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	PORT        string
	DB_URL      string
	JWT_SECRET  string
	REDIS_URL   string
	CORS_ORIGINS string
	GIN_MODE    string
}

// AppConfig is the global config singleton, loaded once at startup
var AppConfig *Config

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables or defaults")
	}

	config := &Config{
		PORT:        getEnv("PORT", "8080"),
		DB_URL:      getEnv("DATABASE_URL", ""),
		JWT_SECRET:  getEnv("JWT_SECRET", ""),
		REDIS_URL:   getEnv("REDIS_URL", "redis://localhost:6379"),
		CORS_ORIGINS: getEnv("CORS_ORIGINS", "http://localhost:3000"),
		GIN_MODE:    getEnv("GIN_MODE", "debug"),
	}

	AppConfig = config
	return config
}

// GetConfig returns the cached global config (never reloads from disk)
func GetConfig() *Config {
	if AppConfig == nil {
		log.Fatal("Config not initialized. Call LoadConfig() first.")
	}
	return AppConfig
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
