package controllers

import (
	"log"
	"net/http"
	"project-z-backend/handlers"
	"project-z-backend/models"
	"project-z-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetProblems(c *gin.Context) {
	log.Println("GetProblems controller called")

	problems, err := services.GetProblems()
	if err != nil {
		handlers.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	handlers.HandleSuccess(c, http.StatusOK, problems)
}

func CreateProblem(c *gin.Context) {
	log.Println("CreateProblem controller called")

	var p models.Problem
	if err := c.ShouldBindJSON(&p); err != nil {
		handlers.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	problem, err := services.CreateProblem(p)
	if err != nil {
		handlers.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	handlers.HandleSuccess(c, http.StatusCreated, problem)
}

func GetProblemByID(c *gin.Context) {
	log.Println("GetProblemByID controller called")

	problemIDStr := c.Param("problem_id")
	problemID, err := strconv.ParseInt(problemIDStr, 10, 64)
	if err != nil {
		handlers.HandleError(c, http.StatusBadRequest, "Invalid problem ID")
		return
	}

	problem, err := services.GetProblemByID(problemID)
	if err != nil {
		handlers.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	if problem == nil {
		handlers.HandleError(c, http.StatusNotFound, "Problem not found")
		return
	}

	handlers.HandleSuccess(c, http.StatusOK, problem)
}
