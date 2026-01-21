import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { DeleteResult } from "../types/index.js";
import { extractUid } from "../utils/uid.js";

export const deleteSchema = {
  memo_uid: z.string().describe("Memo UID or name (e.g., 'abc123' or 'memos/abc123')"),
  force: z.boolean().optional().describe("Force delete even if memo has associated data"),
};

export type DeleteArgs = {
  memo_uid: string;
  force?: boolean;
};

export async function handleDelete(
  client: MemosClient,
  args: DeleteArgs
): Promise<DeleteResult> {
  if (!args.memo_uid) {
    throw new Error("memo_uid is required");
  }

  const uid = extractUid(args.memo_uid);
  const force = args.force ?? false;
  await client.deleteMemo(uid, force);

  return {
    success: true,
    uid,
    force,
  };
}
