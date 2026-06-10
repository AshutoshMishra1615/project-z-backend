package engine

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type ExecutionResult struct {
	Output      string
	Error       string
	ExitCode    int
	TimeUsage   int64 // milliseconds
	MemoryUsage int64 // bytes
}

type Sandbox interface {
	Prepare() error
	Compile(code string, language string, problemID int64) (string, error)
	Run(input string, timeLimit int64, memoryLimit int64) (ExecutionResult, error)
	Cleanup()
}

// DockerSandbox implements the Sandbox interface using Docker containers
type DockerSandbox struct {
	SessionID string
	WorkDir   string
	Language  string
}

func NewDockerSandbox() *DockerSandbox {
	return &DockerSandbox{
		SessionID: fmt.Sprintf("%d", time.Now().UnixNano()),
	}
}

func (s *DockerSandbox) Prepare() error {
	s.WorkDir = filepath.Join(os.TempDir(), "project-z", s.SessionID)
	return os.MkdirAll(s.WorkDir, 0777)
}

func (s *DockerSandbox) getLangConfig(language string) (image, ext, compileCmd, runCmd string) {
	switch language {
	case "cpp":
		return "gcc:latest", "main.cpp", "g++ -O2 main.cpp -o main", "./main"
	case "python":
		return "python:3.10-alpine", "main.py", "", "python main.py"
	case "java":
		return "eclipse-temurin:17-alpine", "Solution.java", "javac Solution.java", "java Solution"
	case "go":
		return "golang:1.20-alpine", "main.go", "go build -o main main.go", "./main"
	case "javascript":
		return "node:18-alpine", "main.js", "", "node main.js"
	default:
		return "alpine:latest", "main.txt", "", "cat main.txt"
	}
}

func (s *DockerSandbox) Compile(code string, language string, problemID int64) (string, error) {
	s.Language = language
	image, ext, compileCmd, _ := s.getLangConfig(language)

	// Wrap code with LeetCode style driver
	wrappedCode := WrapWithDriver(code, language, problemID)

	// Write source file
	sourcePath := filepath.Join(s.WorkDir, ext)
	if err := os.WriteFile(sourcePath, []byte(wrappedCode), 0666); err != nil {
		return "", fmt.Errorf("failed to write source file: %v", err)
	}

	// Make source directory accessible to docker container
	os.Chmod(s.WorkDir, 0777)

	if compileCmd == "" {
		return "No compilation required", nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Second)
	defer cancel()

	cmdParts := strings.Split(compileCmd, " ")
	dockerArgs := []string{
		"run", "--rm",
		"-v", fmt.Sprintf("%s:/app", s.WorkDir),
		"-w", "/app",
		image,
	}
	dockerArgs = append(dockerArgs, cmdParts...)

	// Prefix with sudo just in case, but rely on docker group if possible
	cmd := exec.CommandContext(ctx, "sudo", append([]string{"docker"}, dockerArgs...)...)
	
	// If sudo fails, fallback to normal docker
	if err := exec.Command("sudo", "-n", "true").Run(); err != nil {
		cmd = exec.CommandContext(ctx, "docker", dockerArgs...)
	}

	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err := cmd.Run()
	if err != nil {
		return errBuf.String() + "\n" + outBuf.String(), fmt.Errorf("compilation failed: %v", err)
	}

	return outBuf.String() + errBuf.String(), nil
}

func (s *DockerSandbox) Run(input string, timeLimit int64, memoryLimit int64) (ExecutionResult, error) {
	image, _, _, runCmd := s.getLangConfig(s.Language)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeLimit+300000)*time.Millisecond)
	defer cancel()

	cmdParts := strings.Split(runCmd, " ")
	dockerArgs := []string{
		"run", "--rm", "-i",
		"--network", "none", // Disable networking for security
		"--memory", fmt.Sprintf("%dm", memoryLimit/(1024*1024)),
		"-v", fmt.Sprintf("%s:/app", s.WorkDir),
		"-w", "/app",
		image,
	}
	dockerArgs = append(dockerArgs, cmdParts...)

	cmd := exec.CommandContext(ctx, "sudo", append([]string{"docker"}, dockerArgs...)...)
	if err := exec.Command("sudo", "-n", "true").Run(); err != nil {
		cmd = exec.CommandContext(ctx, "docker", dockerArgs...)
	}

	cmd.Stdin = strings.NewReader(input)
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	start := time.Now()
	err := cmd.Run()
	duration := time.Since(start).Milliseconds()

	result := ExecutionResult{
		Output:      strings.TrimSpace(outBuf.String()),
		Error:       strings.TrimSpace(errBuf.String()),
		ExitCode:    0,
		TimeUsage:   duration,
		MemoryUsage: 0, // Mocked for now, harder to get via docker run directly
	}

	if err != nil {
		result.ExitCode = -1
		if exitError, ok := err.(*exec.ExitError); ok {
			result.ExitCode = exitError.ExitCode()
		}
		if ctx.Err() == context.DeadlineExceeded {
			return result, fmt.Errorf("Time Limit Exceeded")
		}
		return result, fmt.Errorf("Runtime Error: %s", result.Error)
	}

	return result, nil
}

func (s *DockerSandbox) Cleanup() {
	if s.WorkDir != "" {
		os.RemoveAll(s.WorkDir)
	}
}
