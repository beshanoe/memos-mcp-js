import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { MemoResult } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

export const updateSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
  content: z.string().optional().describe("New memo content"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE"),
  pinned: z.boolean().optional().describe("Whether to pin the memo"),
  tags: z.array(z.string()).optional().describe("Tags for the memo (replaces existing tags)"),
};

export type UpdateArgs = {
  memo_uid: string;
  content?: string;
  visibility?: string;
  pinned?: boolean;
  tags?: string[];
};

export async function handleUpdate(
  client: MemosClient,
  args: UpdateArgs
): Promise<MemoResult> {
  if (!args.memo_uid) {
    throw new Error("memo_uid is required");
  }

  const uid = extractUid(args.memo_uid);
  const memo = await client.updateMemo(uid, {
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
