package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/mark3labs/mcp-go/server"

	"github.com/jtsang4/memos-mcp/internal/mcpserver"
	"github.com/jtsang4/memos-mcp/internal/memos"
	"github.com/jtsang4/memos-mcp/pkg/version"
)

func main() {
	log.SetOutput(os.Stderr)
	log.SetFlags(0)

	defaultBaseURL := getEnv("MEMOS_BASE_URL", "http://localhost:5230")
	envToken := firstNonEmpty(os.Getenv("MEMOS_ACCESS_TOKEN"), os.Getenv("MEMOS_API_TOKEN"))

	var baseURL string
	var accessToken string
	var apiToken string
	var timeoutSec int
	var showVersion bool

	flag.StringVar(&baseURL, "base-url", defaultBaseURL, "Memos base URL (env MEMOS_BASE_URL)")
	flag.StringVar(&accessToken, "access-token", envToken, "Memos access token (env MEMOS_ACCESS_TOKEN or MEMOS_API_TOKEN)")
	flag.StringVar(&apiToken, "api-token", "", "Alias for --access-token")
	flag.IntVar(&timeoutSec, "timeout", 30, "HTTP timeout in seconds")
	flag.BoolVar(&showVersion, "version", false, "Print version and exit")
	flag.Parse()

	if showVersion {
		fmt.Fprintln(os.Stdout, version.GetInfo().String())
		return
	}

	if apiToken != "" {
		accessToken = apiToken
	}

	client, err := memos.NewClient(baseURL, accessToken, time.Duration(timeoutSec)*time.Second)
	if err != nil {
		log.Fatalf("init memos client: %v", err)
	}

	mcpSrv := server.NewMCPServer(
		"memos-mcp",
		version.Version,
		server.WithToolCapabilities(false),
		server.WithRecovery(),
	)

	mcpserver.NewServer(client).Register(mcpSrv)

	if err := server.ServeStdio(mcpSrv); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
