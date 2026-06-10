package handlers

import (
	"github.com/gin-gonic/gin"
)

func HandleError(c *gin.Context, statusCode int, errorMsg string) {
	msg := errorMsg
	if msg == "" {
		msg = "Internal Server Error"
	}
	c.JSON(statusCode, gin.H{"error": msg})
}

func HandleSuccess(c *gin.Context, statusCode int, responseData interface{}) {
	c.JSON(statusCode, gin.H{
		"data":    responseData,
		"message": "success",
	})
}

// HealthHandler returns a simple health status
func HealthHandler(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}

// WelcomeHandler returns a welcome message
func WelcomeHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Welcome to Project Z API!"})
}
