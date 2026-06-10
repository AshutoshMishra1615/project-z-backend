package models

import "time"

// Submission States
const (
	StateQueued    = "QUEUED"
	StateRunning   = "RUNNING"
	StateCompleted = "COMPLETED"
	StateFailed    = "FAILED"
)

// Pipeline Stages
const (
	StageCompiling = "COMPILING"
	StageRunning   = "RUNNING"
	StageGrading   = "GRADING"
)

// Verdicts
const (
	VerdictAccepted            = "Accepted"
	VerdictWrongAnswer         = "Wrong Answer"
	VerdictRuntimeError        = "Runtime Error"
	VerdictTimeLimitExceeded   = "Time Limit Exceeded"
	VerdictCompilationError    = "Compilation Error"
	VerdictMemoryLimitExceeded = "Memory Limit Exceeded"
)

type Submission struct {
	ID            int64     `json:"id"`
	Ticket        string    `json:"ticket"`
	UserID        int64     `json:"user_id"`
	ProblemID     int64     `json:"problem_id"`
	Language      string    `json:"language"`
	Code          string    `json:"code"`
	State         string    `json:"state"`
	Stage         string    `json:"stage"`
	Verdict       string    `json:"verdict,omitempty"`
	Logs          string    `json:"logs,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	ExecutionTime float64   `json:"execution_time,omitempty"` // in milliseconds
	MemoryUsage   float64   `json:"memory_usage,omitempty"`   // in bytes
}

type SubmissionRequest struct {
	ProblemID int64  `json:"problem_id" binding:"required"`
	Language  string `json:"language" binding:"required"`
	Code      string `json:"code" binding:"required"`
}

type SubmissionResponse struct {
	Ticket  string `json:"ticket"`
	State   string `json:"state"`
	Stage   string `json:"stage"`
	Logs    string `json:"logs,omitempty"`
	Verdict string `json:"verdict,omitempty"`
}
