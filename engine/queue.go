package engine

import "project-z-backend/models"

type Job struct {
	Submission *models.Submission
}

// Queue is a channel-based in-process job queue.
// For single-node deployments, this is simple and efficient.
//
// For multi-node / distributed deployments, this can be replaced with:
//   - Redis Streams (XADD/XREADGROUP)
//   - A library like github.com/hibiken/asynq (Redis-backed task queue)
//
// The engine.Submit() method is the integration point — swap the queue
// implementation there without changing the worker logic.
type Queue struct {
	jobs chan Job
}

func NewQueue(size int) *Queue {
	return &Queue{
		jobs: make(chan Job, size),
	}
}

func (q *Queue) Enqueue(job Job) {
	q.jobs <- job
}

func (q *Queue) Dequeue() Job {
	return <-q.jobs
}

func (q *Queue) Jobs() <-chan Job {
	return q.jobs
}
