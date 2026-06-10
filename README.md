# Project Z — Online Judge

<div align="center">

**A self-hosted competitive programming platform built with Go and Next.js.**

Submit solutions in 5 languages, watch real-time grading via Server-Sent Events, and track your progress — all backed by a Redis-powered async execution engine.

![Go](https://img.shields.io/badge/Go-1.25-00ADD8?style=flat&logo=go)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis)

</div>

---

## Features

- **5 Language Support** — C++, Python, Java, Go, JavaScript
- **Async Execution Engine** — Submissions are queued and processed by goroutine workers
- **Real-time Updates** — Server-Sent Events (SSE) stream verdict progress live
- **Redis-Backed State** — Submission state stored in Redis with TTL; no memory leaks
- **JWT Authentication** — Secure login/register with role-based access (user / admin)
- **Auto Migrations** — Schema is created automatically on first run
- **Seed Data** — 8 pre-loaded problems across Easy / Medium / Hard difficulties
- **Modern Frontend** — Dark-theme Next.js 16 + TypeScript + Tailwind CSS v4

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Go 1.25, Gin, `lib/pq`, `go-redis/v9`  |
| Auth      | JWT (`golang-jwt/jwt`)                  |
| Database  | PostgreSQL 16                           |
| Cache     | Redis 7                                 |
| Frontend  | Next.js 16, React 19, TypeScript 5      |
| Styling   | Tailwind CSS v4                         |
| Dev Infra | Docker (Postgres + Redis only)          |

---

## Project Structure

```
project-z-backend/
├── main.go                   # Entrypoint — wires everything together
├── config/                   # Env var loading
├── database/
│   ├── database.go           # DB connection pool
│   ├── migrations/           # Auto schema migrations
│   ├── seed.go               # Seed 8 problems + admin user
│   └── *.sql                 # Reference SQL schemas
├── cache/                    # Redis client init
├── models/                   # DB model structs
├── services/                 # Submission engine (async worker pool)
├── controllers/              # HTTP handler logic
├── handlers/                 # Health/welcome handlers
├── middleware/               # JWT auth middleware
├── routes/                   # Gin router setup + CORS
├── engine/                   # Code execution sandbox
├── docker-compose.yml        # Postgres + Redis containers
├── .sample.env               # Template for environment variables
└── frontend/                 # Next.js app (TSX + Tailwind CSS v4)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx          # Landing page
    │   ├── auth/page.tsx     # Login / Register
    │   ├── dashboard/page.tsx
    │   ├── problems/
    │   │   ├── page.tsx      # Problem list
    │   │   └── [id]/page.tsx # Problem detail + code editor
    │   ├── components/
    │   │   └── Navbar.tsx
    │   └── context/
    │       └── AuthContext.tsx
    └── ...
```

---

## API Reference

All routes are prefixed with `/api`.

### Auth & Users
| Method | Endpoint           | Auth | Description             |
|--------|--------------------|------|-------------------------|
| POST   | `/api/user/register` | —    | Register a new account  |
| POST   | `/api/user/login`    | —    | Login, returns JWT      |
| GET    | `/api/user/me`       | ✅   | Get current user info   |
| GET    | `/api/user/stats`    | ✅   | Submission stats        |

### Problems
| Method | Endpoint              | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| GET    | `/api/problems`       | —    | List all problems     |
| GET    | `/api/problems/:id`   | —    | Get problem by ID     |

### Submissions
| Method | Endpoint                          | Auth | Description                      |
|--------|-----------------------------------|------|----------------------------------|
| POST   | `/api/submissions/`               | ✅   | Submit code, returns a ticket ID |
| GET    | `/api/submissions/:ticket`        | ✅   | Poll submission status           |
| GET    | `/api/submissions/:ticket/stream` | ✅   | SSE stream of status updates     |
| GET    | `/api/submissions/id/:id`         | ✅   | Get submission by DB ID          |

---

## Running the Project

### Prerequisites

| Tool       | Minimum Version | Install                                             |
|------------|-----------------|-----------------------------------------------------|
| Go         | 1.21+           | [go.dev/dl](https://go.dev/dl)                      |
| Node.js    | 18+             | [nodejs.org](https://nodejs.org)                    |
| Docker     | Any recent      | [docs.docker.com](https://docs.docker.com/get-docker/) |
| Docker Compose | v2 (plugin) | Included with Docker Desktop; see note below       |

> **Docker Compose note:** The modern way is `docker compose` (a Docker CLI plugin), not the legacy `docker-compose` binary. If you only have the legacy binary, install Docker Engine from the official docs which includes Compose v2 as a plugin.

---

### Step 1 — Clone & configure

```bash
git clone https://github.com/AshutoshMishra1615/project-z-backend.git
cd project-z-backend

# Copy env template and fill in your values
cp .sample.env .env
```

Edit `.env`:

```env
PORT="8080"
DATABASE_URL="postgres://postgres:pyro@localhost:5432/project_z?sslmode=disable"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change_me_to_a_strong_secret"
CORS_ORIGINS="http://localhost:3000"
GIN_MODE="debug"
```

---

### Step 2 — Start Postgres & Redis

```bash
# Docker Compose v2 (modern, recommended)
docker compose up -d

# OR legacy binary
docker-compose up -d
```

This starts:
- **PostgreSQL 16** on `localhost:5432`
- **Redis 7** on `localhost:6379`

Data is persisted in named Docker volumes (`pgdata`, `redisdata`).

---

### Step 3 — Run the backend

```bash
go run main.go
```

On first run it will:
1. Connect to Postgres and Redis
2. Auto-run schema migrations (create tables)
3. Seed 8 problems + an admin user (`admin` / `admin123`)
4. Start the API server on `:8080`

You should see:
```
Server is running on port 8080
```

---

### Step 4 — Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**.

---

### Step 5 — Verify

```bash
# Health check
curl http://localhost:8080/api/health

# List problems (no auth needed)
curl http://localhost:8080/api/problems
```

---

## Environment Variables

| Variable       | Description                                         | Default                     |
|----------------|-----------------------------------------------------|-----------------------------|
| `PORT`         | Backend server port                                 | `8080`                      |
| `DATABASE_URL` | PostgreSQL connection string                         | —                           |
| `REDIS_URL`    | Redis connection string                              | `redis://localhost:6379`    |
| `JWT_SECRET`   | Secret key for signing JWT tokens                   | —                           |
| `CORS_ORIGINS` | Comma-separated allowed origins for CORS            | `http://localhost:3000`     |
| `GIN_MODE`     | Gin mode (`debug` / `release`)                      | `debug`                     |

Frontend environment (in `frontend/.env.local`):

| Variable              | Description          | Default                  |
|-----------------------|----------------------|--------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080`  |

---

## Default Credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |

> **Change the admin password** in `database/seed.go` before deploying to production.

---

## Stopping the Project

```bash
# Stop the backend: Ctrl+C in the terminal running go run main.go

# Stop the frontend: Ctrl+C in the terminal running npm run dev

# Stop and remove Docker containers (data is preserved in volumes)
docker compose down

# Stop AND remove all data (full reset)
docker compose down -v
```

---

## License

MIT
