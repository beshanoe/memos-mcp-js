import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { MemoResult, RelationType } from "../types/index.js";

const relationSchema = z.object({
  related_memo_uid: z.string().describe("UID of the related memo"),
  type: z.enum(["REFERENCE", "COMMENT", "TYPE_UNSPECIFIED"]).describe("Relation type: REFERENCE or COMMENT"),
});

export const createSchema = {
  content: z.string().describe("Memo content in Markdown. Add tags as hashtags at the end (e.g., #work #todo)"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE (default PRIVATE)"),
  pinned: z.boolean().optional().describe("Whether to pin the memo"),
  relations: z.array(relationSchema).optional().describe("Optional relations to other memos"),
};

export type CreateArgs = {
  content: string;
  visibility?: string;
  pinned?: boolean;
  relations?: Array<{
    related_memo_uid: string;
    type: "REFERENCE" | "COMMENT" | "TYPE_UNSPECIFIED";
  }>;
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
    relations: args.relations?.map((r) => ({
      relatedMemo: r.related_memo_uid,
      type: r.type as RelationType,
    })),
  });

  return {
    success: true,
    memo,
  };
}
