import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { MemoResult } from "../types/index.js";

export const createSchema = {
  content: z.string().describe("Memo content in Markdown. Add tags as hashtags at the end (e.g., #work #todo)"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE (default PRIVATE)"),
  pinned: z.boolean().optional().describe("Whether to pin the memo"),
};

export type CreateArgs = {
  content: string;
  visibility?: string;
  pinned?: boolean;
};

export async function handleCreate(
  client: MemosClient,
  args: CreateArgs
): Promise<MemoResult> {
  if (!args.content) {
    throw new Error("content is required");
  }

  const memo = await client.createMemo({
    content: args.content,
    visibility: args.visibility,
    pinned: args.pinned,
  });

  return {
    success: true,
    memo,
  };
}
