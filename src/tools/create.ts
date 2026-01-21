import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { MemoResult } from "../types/index.js";

export const createSchema = {
  content: z.string().describe("Memo content in Markdown"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE (default PRIVATE)"),
  pinned: z.boolean().optional().describe("Whether to pin the memo"),
  tags: z.array(z.string()).optional().describe("Tags for the memo"),
};

export type CreateArgs = {
  content: string;
  visibility?: string;
  pinned?: boolean;
  tags?: string[];
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
    tags: args.tags,
  });

  return {
    success: true,
    memo,
  };
}
