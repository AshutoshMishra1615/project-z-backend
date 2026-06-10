package controllers

import (
	"fmt"
	"io"
	"net/http"
	"project-z-backend/handlers"
	"project-z-backend/models"
	"project-z-backend/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func SubmitCode(c *gin.Context) {
	var req models.SubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		handlers.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Get user ID from JWT context (no more hardcoded ID)
	userID := c.GetInt64("user_id")
	if userID == 0 {
		handlers.HandleError(c, http.StatusUnauthorized, "Authentication required")
		return
	}

	resp, err := services.SubmitCode(req, userID)
	if err != nil {
		handlers.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	handlers.HandleSuccess(c, http.StatusOK, resp)
}

func GetSubmissionStatus(c *gin.Context) {
	ticket := c.Param("ticket")
	resp := services.GetSubmissionStatus(ticket)
	if resp == nil {
		handlers.HandleError(c, http.StatusNotFound, "Submission not found")
		return
	}
	handlers.HandleSuccess(c, http.StatusOK, resp)
}

// GetSubmissionSSE streams submission status updates via Server-Sent Events.
// The client connects once, and the server pushes status updates until
// the submission reaches a terminal state (COMPLETED or FAILED).
//
// Usage: GET /api/submissions/:ticket/stream
// Response: text/event-stream
func GetSubmissionSSE(c *gin.Context) {
	ticket := c.Param("ticket")

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Access-Control-Allow-Origin", "*")

	// Stream updates until terminal state or client disconnects
	c.Stream(func(w io.Writer) bool {
		resp := services.GetSubmissionStatus(ticket)
		if resp == nil {
			fmt.Fprintf(w, "event: error\ndata: {\"error\": \"Submission not found\"}\n\n")
			return false
		}

		data := fmt.Sprintf(`{"ticket":"%s","state":"%s","stage":"%s","verdict":"%s","logs":"%s"}`,
			resp.Ticket, resp.State, resp.Stage, resp.Verdict, resp.Logs)

		fmt.Fprintf(w, "event: status\ndata: %s\n\n", data)
		c.Writer.Flush()

		// Terminal states — close the stream
		if resp.State == models.StateCompleted || resp.State == models.StateFailed {
			fmt.Fprintf(w, "event: done\ndata: {\"final\": true}\n\n")
			c.Writer.Flush()
			return false
		}

		time.Sleep(500 * time.Millisecond)
		return true
	})
}

func GetSubmissionByID(c *gin.Context) {
	submissionIDStr := c.Param("submission_id")
	submissionID, err := strconv.ParseInt(submissionIDStr, 10, 64)
	if err != nil {
		handlers.HandleError(c, http.StatusBadRequest, "Invalid submission ID")
		return
	}

	submission, err := services.GetSubmissionByID(submissionID)
	if err != nil {
		handlers.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	if submission == nil {
		handlers.HandleError(c, http.StatusNotFound, "Submission not found")
		return
	}

	handlers.HandleSuccess(c, http.StatusOK, submission)
}
