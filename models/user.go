package models

type User struct {
	ID                 int64        `json:"id"`
	Name               string       `json:"name"`
	Email              string       `json:"email"`
	Password           string       `json:"password,omitempty"`
	Role               string       `json:"role"`
	CreatedAt          string       `json:"created_at"`
	TotalSubmissions   int64        `json:"total_submissions"`
	SolvedProblems     int64        `json:"solved_problems"`
	FailedProblems     int64        `json:"failed_problems"`
	Submissions        []Submission `json:"submissions,omitempty"`
	SolvedProblemsList []Problem    `json:"solved_problems_list,omitempty"`
}
