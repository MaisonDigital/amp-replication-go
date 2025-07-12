package main

import (
	"context"
	"listings-service/internal/config"
	"listings-service/internal/services"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/robfig/cron/v3"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	orchestrator := services.NewOrchestrator(cfg)

	runOnce := os.Getenv("RUN_ONCE")
	if runOnce == "true" {
		log.Println("Running sync once...")
		if err := runSync(orchestrator); err != nil {
			log.Fatal("Sync failed:", err)
		}
		log.Println("Single sync complete")
		return
	}

	log.Println("Starting scheduled sync service (every hour at 5 minutes past)")

	c := cron.New(cron.WithSeconds())

	_, err = c.AddFunc("0 5 * * * *", func() {
		log.Println("Starting scheduled sync...")
		if err := runSync(orchestrator); err != nil {
			log.Printf("Scheduled sync failed: %v", err)
		} else {
			log.Println("Scheduled sync complete")
		}
	})

	if err != nil {
		log.Fatal("Failed to schedule sync:", err)
	}

	c.Start()
	defer c.Stop()

	log.Println("Sync service started. Press Ctrl+C to stop.")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down sync service...")
}

func runSync(orchestrator *services.Orchestrator) error {
	ctx := context.Background()
	if err := orchestrator.PullFeeds(ctx); err != nil {
		return err
	}
	return nil
}
