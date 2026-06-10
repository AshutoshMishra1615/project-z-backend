package engine

import (
	"fmt"
	"log"
	"project-z-backend/models"
	"time"
)

func (e *SubmissionEngine) startWorker(id int) {
	log.Printf("Worker %d started", id)
	for job := range e.Queue.Jobs() {
		e.processJob(id, job)
	}
}

func (e *SubmissionEngine) processJob(workerID int, job Job) {
	sub := job.Submission
	log.Printf("Worker %d processing ticket %s", workerID, sub.Ticket)

	// 1. Acquire Sandbox
	sandbox := <-e.SandboxPool
	defer func() {
		sandbox.Cleanup()
		e.SandboxPool <- sandbox // Return to pool
	}()

	// 2. Prepare Sandbox
	if err := sandbox.Prepare(); err != nil {
		e.failSubmission(sub, "Sandbox Error", err.Error())
		return
	}

	// 3. Compile Stage
	e.updateState(sub, models.StateRunning, models.StageCompiling, "Compiling...")
	compileLogs, err := sandbox.Compile(sub.Code, sub.Language, sub.ProblemID)
	if err != nil {
		sub.Logs = compileLogs
		e.failSubmission(sub, models.VerdictCompilationError, err.Error())
		return
	}
	sub.Logs = compileLogs

	// 4. Fetch Test Cases
	testCases, err := e.GetTestCases(sub.ProblemID)
	if err != nil {
		e.failSubmission(sub, "System Error", "Failed to fetch test cases")
		return
	}

	// 5. Run Stage
	e.updateState(sub, models.StateRunning, models.StageRunning, "Running test cases...")

	passed := 0
	total := len(testCases)

	for _, tc := range testCases {
		result, err := sandbox.Run(tc.Input, 1000, 256*1024*1024) // Default limits
		if err != nil {
			e.failSubmission(sub, models.VerdictRuntimeError, err.Error())
			return
		}

		// Simple string comparison for judging
		if result.Output != tc.ExpectedOutput {
			e.failSubmission(sub, models.VerdictWrongAnswer, fmt.Sprintf("Failed on test case %d", tc.ID))
			return
		}
		passed++

		// Update metrics (taking max or avg, here just last for simplicity)
		sub.ExecutionTime = float64(result.TimeUsage)
		sub.MemoryUsage = float64(result.MemoryUsage)
	}

	// 6. Judge Stage (Finalize)
	e.updateState(sub, models.StateCompleted, models.StageGrading, "Grading...")

	sub.Verdict = models.VerdictAccepted
	sub.Logs += fmt.Sprintf("\nAll %d test cases passed.", total)
	e.updateState(sub, models.StateCompleted, models.StageGrading, sub.Logs)
}

func (e *SubmissionEngine) updateState(sub *models.Submission, state, stage, logs string) {
	sub.State = state
	sub.Stage = stage
	if logs != "" {
		sub.Logs = logs
	}
	sub.UpdatedAt = time.Now()
	e.UpdateSubmission(sub)
	if e.UpdateCallback != nil {
		e.UpdateCallback(sub)
	}
}

func (e *SubmissionEngine) failSubmission(sub *models.Submission, verdict, logs string) {
	sub.State = models.StateFailed
	sub.Verdict = verdict
	sub.Logs += "\n" + logs
	sub.UpdatedAt = time.Now()
	e.UpdateSubmission(sub)
	if e.UpdateCallback != nil {
		e.UpdateCallback(sub)
	}
}
