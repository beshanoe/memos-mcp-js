import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { UserStats } from "../types/index.js";

export const userStatsSchema = {
  user: z.string().describe("User ID or name (e.g., '1' or 'users/1')"),
};

export type UserStatsArgs = {
  user: string;
};

function extractUserId(user: string): string {
  const trimmed = user.trim();
  if (trimmed.startsWith("users/")) {
    return trimmed.slice("users/".length);
  }
  return trimmed;
}

export async function handleUserStats(
  client: MemosClient,
  args: UserStatsArgs
): Promise<UserStats> {
  if (!args.user) {
    throw new Error("user is required");
  }

  const userId = extractUserId(args.user);
  return client.getUserStats(userId);
}
