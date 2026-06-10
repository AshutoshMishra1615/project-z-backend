package routes

import (
	"project-z-backend/controllers"
	"project-z-backend/middleware"

	"github.com/gin-gonic/gin"
)

func setupProblemRoutes(api *gin.RouterGroup) {
	// Public: anyone can browse problems
	api.GET("/problems", controllers.GetProblems)
	api.GET("/problems/:problem_id", controllers.GetProblemByID)

	// Admin only: create problems
	problemsAdmin := api.Group("/problems")
	problemsAdmin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		problemsAdmin.POST("/", controllers.CreateProblem)
	}
}
