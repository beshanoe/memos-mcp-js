import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { Memo } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

export const getSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
};

export type GetArgs = {
  memo_uid: string;
};

export async function handleGet(
  client: MemosClient,
  args: GetArgs
): Promise<Memo> {
  if (!args.memo_uid) {
    throw new Error("memo_uid is required");
  }

  const uid = extractUid(args.memo_uid);
  return client.getMemo(uid);
}
