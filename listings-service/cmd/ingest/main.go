package main

import (
	"context"
	"listings-service/internal/config"
	"listings-service/internal/services"
	"log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	orchestrator := services.NewOrchestrator(cfg)

	ctx := context.Background()
	if err := orchestrator.PullFeeds(ctx); err != nil {
		log.Fatal("Feed ingestion failed:", err)
	}

	log.Println("🎉 All MLS feed sync complete!")
}
