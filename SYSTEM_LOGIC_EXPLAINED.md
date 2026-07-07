# Project Z (Zucchini) System Implementation Logic & Architecture Walkthrough

This document provides a comprehensive explanation of how the Project Z (Zucchini) platform works under the hood. Project Z is a competitive programming platform with a Next.js frontend and a highly concurrent Go backend, designed to handle code submissions, compile them in a sandboxed environment, run tests, and maintain user statistics.

## System Architecture

The application is split into two main parts:
1. **Frontend (Next.js)**: Handles user interaction, code editing, and viewing stats.
2. **Backend (Go + Gin)**: Exposes a REST API, manages the database, and most importantly, runs the asynchronous code execution engine.

### Tech Stack
- **Backend Language**: Go
- **Web Framework**: Gin
- **Database**: PostgreSQL (for persistent data like Users, Problems, Submissions, TestCases)
- **Caching & Queueing**: Redis
- **Frontend**: Next.js 15 (App Router), Tailwind CSS (with Stitch Design System)

---

## 1. Database & Data Models

The core entities of the system are tracked in PostgreSQL:

*   **Users**: Stores user credentials and tracks overall statistics (`TotalSubmissions`, `SolvedProblems`, `FailedProblems`).
*   **Problems**: Defines a competitive programming challenge. It contains a description, difficulty, example inputs/outputs, and tracks problem-specific statistics (e.g., `SuccessRate`).
*   **Test Cases**: Associated with a Problem. These contain the raw input to feed into the user's code and the expected output to verify correctness. Some test cases are visible to the user as "samples", others are hidden.
*   **Submissions**: Links a User, a Problem, and the User's Code. It tracks the execution state (`Queued`, `Running`, `Completed`), the final verdict (`Accepted`, `Wrong Answer`, `Time Limit Exceeded`), and performance metrics (`ExecutionTime`, `MemoryUsed`).

---

## 2. The Code Submission Pipeline Flow (The Engine)

The most complex part of the system is the **Submission Engine**. To handle thousands of users submitting code simultaneously without crashing the server, the backend relies on an asynchronous, worker-pool architecture.

Here is the exact lifecycle of a code submission:

### Step A: The API Request
1. A user writes code in the frontend code editor and clicks "Submit".
2. The frontend sends a `POST /api/problems/submit` request containing the `problem_id`, `language`, and `source_code`.
3. The API Handler (`controllers/problem.go`) validates the request, creates a new `Submission` record in the database with the status **Queued**, and generates a unique **Ticket ID**.
4. The API *immediately* returns the Ticket ID to the frontend. The frontend will now start polling `GET /api/submissions/:ticket` to update the user interface in real-time.

### Step B: Enqueueing the Job
1. The `Service` layer pushes the submission into the Engine's **Queue** (a blocking channel) and stores the initial state in **Redis** with a 1-hour Time-to-Live (TTL).
2. Redis is used here because it allows extremely fast reads for the frontend while the status updates rapidly.

### Step C: Worker Pool Execution (`engine/worker.go`)
The Engine runs a predefined number of **Goroutines** (Workers) that constantly listen to the Queue. When a job is picked up:

1. **Acquire Sandbox**: The worker pulls a pre-warmed `Sandbox` (a simulated or actual Docker container) from the `SandboxPool`.
2. **Compile Stage**: 
    - The code is compiled inside the isolated sandbox.
    - If compilation fails, the submission is immediately marked with a **Compilation Error** verdict, logs are saved, and the process stops.
3. **Run Stage (Evaluating Test Cases)**:
    - The worker queries the database for all `TestCases` related to the `ProblemID`.
    - It iterates through each test case, injecting the `Input` into the sandbox and executing the compiled code with Time limits (e.g., 1000ms) and Memory limits (e.g., 256MB).
    - If the code crashes or exceeds limits, the verdict is marked as **Runtime Error** or **Time Limit Exceeded**.
    - If the code runs successfully, the actual output is compared exactly against the `ExpectedOutput`.
4. **Judge Stage**:
    - If *any* test case output mismatches the expected output, the loop halts, and the verdict becomes **Wrong Answer** (indicating which test case failed).
    - If all test cases pass, the final verdict becomes **Accepted**.
5. **Finalize**: The sandbox is cleaned up and returned to the pool for the next job.

### Step D: State Sync & Database Callback
Throughout Step C, the Engine constantly calls `updateState()`. This updates the cached state in Redis (so the polling frontend gets live updates like "Compiling..." -> "Running test cases..." -> "Accepted"). 

Once the job is finalized, an `UpdateCallback` fires. This callback writes the final verdict, execution time, and memory usage permanently into the PostgreSQL database.

---

## 3. Real-Time Statistics & Tracking

When a submission finishes, the system updates global statistics.

*   **User Profile Updates**: If the submission is `Accepted`, the system increments the user's `SolvedProblems` count (if it's their first time solving it).
*   **Problem Updates**: The system recalculates the `SuccessRate` and `FailureRate` of the problem based on the new total submissions vs successful submissions.
*   **Frontend Display**: The user can navigate to their Profile or the Leaderboard to see their updated stats, recent submissions, and success percentages.

---

## 4. Frontend Architecture (Next.js)

The frontend is built for performance and a premium look:
*   **Routing**: Uses the Next.js `app/` router. Core views include `/problems` (the main problem set), `/contests`, `/leaderboard`, and `/dashboard`.
*   **Layouts**: The UI relies on `Sidebar.tsx` to provide consistent navigation across pages, tracking the user's active route and authentication state.
*   **State Management**: React Context (`AuthContext`) tracks the currently logged-in user.
*   **Styling**: Powered by TailwindCSS, strictly following the customized "Stitch" design system tokens (e.g., `bg-surface-container-low`, typography like `font-terminal-sm`) to enforce a consistent, competitive-programming aesthetic.

## Summary

Project Zucchini separates concerns cleanly: the web layer is lightweight and responsive, simply enqueueing tasks and reading states. The heavy lifting is done asynchronously by the Go Engine workers using isolated sandboxes, ensuring the platform remains stable and responsive even when hundreds of users submit infinite loops or memory-heavy programs.
