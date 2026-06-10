package database

import (
	"database/sql"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func SeedData() {
	log.Println("Running seed data...")

	seedAdminUser()
	seedProblems()

	log.Println("Seed data completed")
}

func seedAdminUser() {
	// Check if admin already exists
	var count int
	err := DB.QueryRow(`SELECT COUNT(*) FROM users WHERE username = 'admin'`).Scan(&count)
	if err != nil {
		log.Printf("Error checking admin user: %v\n", err)
		return
	}
	if count > 0 {
		log.Println("Admin user already exists, skipping...")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing admin password: %v\n", err)
		return
	}

	_, err = DB.Exec(
		`INSERT INTO users (username, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5)`,
		"admin", "admin@projectz.dev", string(hashedPassword), "admin", time.Now(),
	)
	if err != nil {
		log.Printf("Error creating admin user: %v\n", err)
		return
	}
	log.Println("Created admin user (admin / admin123)")
}

func seedProblems() {
	// Check if problems already exist
	var count int
	err := DB.QueryRow(`SELECT COUNT(*) FROM problems`).Scan(&count)
	if err != nil {
		log.Printf("Error checking problems: %v\n", err)
		return
	}
	if count > 0 {
		log.Println("Problems already exist, skipping seed...")
		return
	}

	type seedProblem struct {
		title         string
		description   string
		difficulty    string
		exampleInput  string
		exampleOutput string
		testCases     []struct {
			input    string
			expected string
			isSample bool
		}
	}

	problems := []seedProblem{
		{
			title: "Two Sum",
			description: `Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- Only one valid answer exists.`,
			difficulty:    "Easy",
			exampleInput:  "[2,7,11,15]\n9",
			exampleOutput: "[0,1]",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"[2,7,11,15]\n9", "[0,1]", true},
				{"[3,2,4]\n6", "[1,2]", true},
				{"[3,3]\n6", "[0,1]", false},
				{"[1,5,3,7]\n8", "[1,2]", false},
			},
		},
		{
			title: "FizzBuzz",
			description: `Given an integer n, return a string array answer (1-indexed) where:

- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.

**Example 1:**
Input: n = 3
Output: ["1","2","Fizz"]

**Example 2:**
Input: n = 5
Output: ["1","2","Fizz","4","Buzz"]

**Example 3:**
Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

**Constraints:**
- 1 <= n <= 10^4`,
			difficulty:    "Easy",
			exampleInput:  "3",
			exampleOutput: "1\n2\nFizz",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"3", "1\n2\nFizz", true},
				{"5", "1\n2\nFizz\n4\nBuzz", true},
				{"15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", false},
			},
		},
		{
			title: "Palindrome Number",
			description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same forward and backward.

**Example 1:**
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

**Example 2:**
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left it becomes 121-. Therefore it is not a palindrome.

**Example 3:**
Input: x = 10
Output: false

**Constraints:**
- -2^31 <= x <= 2^31 - 1`,
			difficulty:    "Easy",
			exampleInput:  "121",
			exampleOutput: "true",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"121", "true", true},
				{"-121", "false", true},
				{"10", "false", false},
				{"0", "true", false},
				{"12321", "true", false},
			},
		},
		{
			title: "Reverse Linked List",
			description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example 1:**
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

**Example 2:**
Input: head = [1,2]
Output: [2,1]

**Example 3:**
Input: head = []
Output: []

**Constraints:**
- The number of nodes in the list is the range [0, 5000].
- -5000 <= Node.val <= 5000`,
			difficulty:    "Easy",
			exampleInput:  "[1,2,3,4,5]",
			exampleOutput: "[5,4,3,2,1]",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"[1,2,3,4,5]", "[5,4,3,2,1]", true},
				{"[1,2]", "[2,1]", true},
				{"[]", "[]", false},
			},
		},
		{
			title: "Valid Parentheses",
			description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
Input: s = "()"
Output: true

**Example 2:**
Input: s = "()[]{}"
Output: true

**Example 3:**
Input: s = "(]"
Output: false

**Constraints:**
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
			difficulty:    "Easy",
			exampleInput:  "()",
			exampleOutput: "true",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"()", "true", true},
				{"()[]{}", "true", true},
				{"(]", "false", true},
				{"([)]", "false", false},
				{"{[]}", "true", false},
			},
		},
		{
			title: "Maximum Subarray",
			description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

**Example 1:**
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

**Example 2:**
Input: nums = [1]
Output: 1

**Example 3:**
Input: nums = [5,4,-1,7,8]
Output: 23

**Constraints:**
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
			difficulty:    "Medium",
			exampleInput:  "[-2,1,-3,4,-1,2,1,-5,4]",
			exampleOutput: "6",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"[-2,1,-3,4,-1,2,1,-5,4]", "6", true},
				{"[1]", "1", true},
				{"[5,4,-1,7,8]", "23", false},
				{"[-1]", "-1", false},
			},
		},
		{
			title: "Longest Common Subsequence",
			description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

A common subsequence of two strings is a subsequence that is common to both strings.

**Example 1:**
Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

**Example 2:**
Input: text1 = "abc", text2 = "abc"
Output: 3

**Example 3:**
Input: text1 = "abc", text2 = "def"
Output: 0

**Constraints:**
- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English characters.`,
			difficulty:    "Medium",
			exampleInput:  "abcde\nace",
			exampleOutput: "3",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"abcde\nace", "3", true},
				{"abc\nabc", "3", true},
				{"abc\ndef", "0", false},
			},
		},
		{
			title: "Merge K Sorted Lists",
			description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

**Example 1:**
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

**Example 2:**
Input: lists = []
Output: []

**Example 3:**
Input: lists = [[]]
Output: []

**Constraints:**
- k == lists.length
- 0 <= k <= 10^4
- 0 <= lists[i].length <= 500
- -10^4 <= lists[i][j] <= 10^4`,
			difficulty:    "Hard",
			exampleInput:  "[[1,4,5],[1,3,4],[2,6]]",
			exampleOutput: "[1,1,2,3,4,4,5,6]",
			testCases: []struct {
				input    string
				expected string
				isSample bool
			}{
				{"[[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", true},
				{"[]", "[]", true},
				{"[[]]", "[]", false},
			},
		},
	}

	for _, p := range problems {
		var problemID int64
		err := DB.QueryRow(
			`INSERT INTO problems (title, description, difficulty, example_input, example_output, created_at)
			 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
			p.title, p.description, p.difficulty, p.exampleInput, p.exampleOutput, time.Now(),
		).Scan(&problemID)

		if err != nil {
			log.Printf("Error seeding problem '%s': %v\n", p.title, err)
			continue
		}

		for _, tc := range p.testCases {
			_, err := DB.Exec(
				`INSERT INTO test_cases (problem_id, input, expected_output, is_sample, created_at)
				 VALUES ($1, $2, $3, $4, $5)`,
				problemID, tc.input, tc.expected, tc.isSample, time.Now(),
			)
			if err != nil {
				log.Printf("Error seeding test case for '%s': %v\n", p.title, err)
			}
		}

		log.Printf("Seeded problem: %s (%s) with %d test cases", p.title, p.difficulty, len(p.testCases))
	}
}

// hasSeedData checks if seed data already exists
func hasSeedData() bool {
	var count int
	err := DB.QueryRow(`SELECT COUNT(*) FROM problems`).Scan(&count)
	if err != nil {
		// Table might not exist yet, which is fine
		return false
	}
	return count > 0
}

// getSeedProblemCount is used for health check
func GetSeedProblemCount() (int, error) {
	var count int
	err := DB.QueryRow(`SELECT COUNT(*) FROM problems`).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return count, nil
}
