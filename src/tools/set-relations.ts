import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { SetRelationsResult, RelationType } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

const relationSchema = z.object({
  related_memo_uid: z.string().describe("UID of the related memo"),
  type: z.enum(["REFERENCE", "COMMENT", "TYPE_UNSPECIFIED"]).describe("Relation type: REFERENCE (linking memos) or COMMENT (memo as comment on another)"),
});

export const setRelationsSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
  relations: z.array(relationSchema).describe("Array of relations to set. This replaces ALL existing relations. To add/remove relations, first list them, modify the array, then set."),
};

export type SetRelationsArgs = {
  memo_uid: string;
  relations: Array<{
    related_memo_uid: string;
    type: "REFERENCE" | "COMMENT" | "TYPE_UNSPECIFIED";
  }>;
};

export async function handleSetRelations(
  client: MemosClient,
  args: SetRelationsArgs
): Promise<SetRelationsResult> {
  if (!args.memo_uid) {
    throw new Error("memo_uid is required");
  }

  if (!args.relations) {
    throw new Error("relations is required");
  }

  const uid = extractUid(args.memo_uid);

  await client.setMemoRelations(
    uid,
    args.relations.map((r) => ({
      relatedMemo: r.related_memo_uid,
      type: r.type as RelationType,
    }))
  );

  return {
    success: true,
    uid,
  };
}
