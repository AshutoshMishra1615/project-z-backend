package routes

import (
	"project-z-backend/config"
	"project-z-backend/controllers"
	"project-z-backend/handlers"
	"project-z-backend/middleware"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupAPIRoutes(router *gin.Engine) {
	cfg := config.GetConfig()

	// CORS middleware
	origins := strings.Split(cfg.CORS_ORIGINS, ",")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/", handlers.WelcomeHandler)

	api := router.Group("/api")
	api.GET("/health", handlers.HealthHandler)

	setupUserRoutes(api)
	setupProblemRoutes(api)
	setupSubmissionRoutes(api)
}

func setupSubmissionRoutes(router *gin.RouterGroup) {
	submissions := router.Group("/submissions")
	submissions.Use(middleware.AuthMiddleware())
	{
		submissions.POST("/", controllers.SubmitCode)
		submissions.GET("/:ticket", controllers.GetSubmissionStatus)
		submissions.GET("/:ticket/stream", controllers.GetSubmissionSSE)
		submissions.GET("/id/:submission_id", controllers.GetSubmissionByID)
	}
}
