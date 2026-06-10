package services

import (
	"crypto/rand"
	"fmt"
	"project-z-backend/engine"
	"project-z-backend/models"
	"time"
)

func InitSubmissionEngine() {
	// Initialize engine with callbacks
	engine.InitEngine(100, 5, GetTestCasesForEngine, UpdateSubmissionCallback)
}

func GetTestCasesForEngine(problemID int64) ([]models.TestCase, error) {
	return GetTestCasesByProblemID(problemID)
}

func UpdateSubmissionCallback(sub *models.Submission) {
	// Map fields back to DB columns
	// For backward compatibility, if the submission is completed, we store the verdict in the status column
	dbStatus := sub.State
	if sub.State == models.StateCompleted {
		dbStatus = sub.Verdict
	} else if sub.State == models.StateFailed {
		dbStatus = sub.Verdict
	}

	UpdateSubmissionStatus(sub.ID, dbStatus, sub.Logs, sub.ExecutionTime, sub.MemoryUsage)
}

func SubmitCode(req models.SubmissionRequest, userID int64) (*models.SubmissionResponse, error) {
	ticket := generateTicket()

	sub := models.Submission{
		Ticket:    ticket,
		UserID:    userID,
		ProblemID: req.ProblemID,
		Language:  req.Language,
		Code:      req.Code,
		State:     models.StateQueued,
		Stage:     models.StageCompiling, // Initial stage
		CreatedAt: time.Now(),
	}

	// Save to DB first to get ID
	savedSub, err := CreateSubmission(sub)
	if err != nil {
		return nil, err
	}
	sub.ID = savedSub.ID

	// Submit to engine
	engine.Engine.Submit(&sub)

	return &models.SubmissionResponse{
		Ticket: ticket,
		State:  sub.State,
		Stage:  sub.Stage,
	}, nil
}

func GetSubmissionStatus(ticket string) *models.SubmissionResponse {
	sub := engine.Engine.GetSubmission(ticket)
	if sub == nil {
		return nil
	}
	return &models.SubmissionResponse{
		Ticket:  sub.Ticket,
		State:   sub.State,
		Stage:   sub.Stage,
		Logs:    sub.Logs,
		Verdict: sub.Verdict,
	}
}

func generateTicket() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return fmt.Sprintf("%x", b)
}
