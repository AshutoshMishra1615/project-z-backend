package routes

import (
	"project-z-backend/controllers"
	"project-z-backend/middleware"

	"github.com/gin-gonic/gin"
)

func setupUserRoutes(api *gin.RouterGroup) {
	// Public auth routes
	api.POST("/user/register", controllers.Register)
	api.POST("/user/login", controllers.Login)

	// Authenticated user routes
	userAuth := api.Group("/user")
	userAuth.Use(middleware.AuthMiddleware())
	{
		userAuth.GET("/me", controllers.Me)
		userAuth.GET("/stats", controllers.GetUserStats)
		userAuth.GET("/submissions", controllers.GetUserSubmissions)
	}
}
