#!/usr/bin/env node

import { program } from "commander";
import { main } from "./index.js";

const VERSION = "0.2.0";

function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

program
  .name("memos-mcp")
  .description("MCP server for Memos - a self-hosted notes application")
  .version(VERSION)
  .option(
    "--base-url <url>",
    "Memos base URL",
    getEnv("MEMOS_BASE_URL", "http://localhost:5230")
  )
  .option(
    "--access-token <token>",
    "Memos access token",
    getEnv("MEMOS_ACCESS_TOKEN", "") || getEnv("MEMOS_API_TOKEN", "")
  )
  .option("--api-token <token>", "Alias for --access-token")
  .option("--timeout <seconds>", "HTTP timeout in seconds", "30")
  .action(async (options) => {
    const accessToken = options.apiToken || options.accessToken;
    const timeout = parseInt(options.timeout, 10) * 1000;

    try {
      await main({
        baseUrl: options.baseUrl,
        accessToken,
        timeout,
      });
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
