import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { ListRelationsResult } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

export const listRelationsSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
};

export type ListRelationsArgs = {
  memo_uid: string;
};

export async function handleListRelations(
  client: MemosClient,
  args: ListRelationsArgs
): Promise<ListRelationsResult> {
  if (!args.memo_uid) {
    throw new Error("memo_uid is required");
  }

  const uid = extractUid(args.memo_uid);
  const result = await client.listMemoRelations(uid);

  return {
    relations: result.relations || [],
  };
}
