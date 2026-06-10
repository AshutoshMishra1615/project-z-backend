package engine

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"project-z-backend/cache"
	"project-z-backend/models"
	"time"
)

const (
	submissionKeyPrefix = "submission:"
	submissionTTL       = 1 * time.Hour
)

type SubmissionEngine struct {
	Queue          *Queue
	SandboxPool    chan Sandbox
	GetTestCases   func(problemID int64) ([]models.TestCase, error)
	UpdateCallback func(submission *models.Submission)
}

var Engine *SubmissionEngine

func InitEngine(queueSize int, workerCount int, getTestCases func(int64) ([]models.TestCase, error), updateCallback func(*models.Submission)) {
	Engine = &SubmissionEngine{
		Queue:          NewQueue(queueSize),
		SandboxPool:    make(chan Sandbox, workerCount),
		GetTestCases:   getTestCases,
		UpdateCallback: updateCallback,
	}

	// Pre-warm sandboxes
	for i := 0; i < workerCount; i++ {
		Engine.SandboxPool <- NewDockerSandbox()
	}

	// Start workers
	for i := 0; i < workerCount; i++ {
		go Engine.startWorker(i)
	}

	log.Printf("Submission Engine initialized with %d workers", workerCount)
}

func (e *SubmissionEngine) Submit(submission *models.Submission) {
	e.storeSubmission(submission)
	e.Queue.Enqueue(Job{Submission: submission})
}

func (e *SubmissionEngine) GetSubmission(ticket string) *models.Submission {
	ctx := context.Background()
	key := fmt.Sprintf("%s%s", submissionKeyPrefix, ticket)

	data, err := cache.RedisClient.Get(ctx, key).Result()
	if err != nil {
		return nil
	}

	var sub models.Submission
	if err := json.Unmarshal([]byte(data), &sub); err != nil {
		log.Printf("Error unmarshalling submission %s: %v", ticket, err)
		return nil
	}
	return &sub
}

func (e *SubmissionEngine) UpdateSubmission(sub *models.Submission) {
	e.storeSubmission(sub)
}

func (e *SubmissionEngine) storeSubmission(sub *models.Submission) {
	ctx := context.Background()
	key := fmt.Sprintf("%s%s", submissionKeyPrefix, sub.Ticket)

	data, err := json.Marshal(sub)
	if err != nil {
		log.Printf("Error marshalling submission %s: %v", sub.Ticket, err)
		return
	}

	if err := cache.RedisClient.Set(ctx, key, data, submissionTTL).Err(); err != nil {
		log.Printf("Error storing submission %s in Redis: %v", sub.Ticket, err)
	}
}
