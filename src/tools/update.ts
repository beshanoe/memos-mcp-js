import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { MemoResult, RelationType } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

const relationSchema = z.object({
  related_memo_uid: z.string().describe("UID of the related memo"),
  type: z.enum(["REFERENCE", "COMMENT", "TYPE_UNSPECIFIED"]).describe("Relation type: REFERENCE or COMMENT"),
});

export const updateSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
  content: z.string().optional().describe("New memo content. Add tags as hashtags at the end (e.g., #work #todo)"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE"),
  pinned: z.boolean().optional().describe("Whether to pin the memo"),
  relations: z.array(relationSchema).optional().describe("Relations to other memos. This replaces ALL existing relations."),
};

export type UpdateArgs = {
  memo_uid: string;
  content?: string;
  visibility?: string;
  pinned?: boolean;
  relations?: Array<{
    related_memo_uid: string;
    type: "REFERENCE" | "COMMENT" | "TYPE_UNSPECIFIED";
  }>;
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
