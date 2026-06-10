package migrations

import (
	"log"
	"os"
	"project-z-backend/database"
)

func ProblemsMigration() {
	if database.DB == nil {
		log.Fatal("Database not initialized")
	}

	bytefile, err := os.ReadFile("database/problems.sql")
	if err != nil {
		log.Fatal("Failed to read problems.sql file:", err)
	}

	_, execErr := database.DB.Exec(string(bytefile))
	if execErr != nil {
		log.Fatal("Failed to create problems/test_cases/submissions tables:", execErr)
	}

	log.Println("Problems migration ran successfully")
}
