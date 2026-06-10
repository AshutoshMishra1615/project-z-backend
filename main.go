package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"project-z-backend/cache"
	"project-z-backend/config"
	"project-z-backend/database"
	"project-z-backend/database/migrations"
	"project-z-backend/services"

	"project-z-backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load config once at startup
	cfg := config.LoadConfig()

	// Set Gin mode
	gin.SetMode(cfg.GIN_MODE)

	// Initialize database
	database.InitDB(cfg.DB_URL)
	defer database.DB.Close()

	// Initialize Redis
	cache.InitRedis(cfg.REDIS_URL)
	defer cache.RedisClient.Close()

	// Run migrations
	migrations.SetupMigration()

	// Seed data (idempotent — skips if data exists)
	database.SeedData()

	// Initialize submission engine
	services.InitSubmissionEngine()

	// Setup router
	router := gin.Default()
	routes.SetupAPIRoutes(router)

	// Create HTTP server for graceful shutdown
	srv := &http.Server{
		Addr:    ":" + cfg.PORT,
		Handler: router,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Server is running on port %s", cfg.PORT)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited cleanly")
}
