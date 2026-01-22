import type { MemosClient } from "../client/memos-client.js";
import type { User } from "../types/index.js";

export const currentUserSchema = {};

export type CurrentUserArgs = Record<string, never>;

export async function handleCurrentUser(
  client: MemosClient,
  _args: CurrentUserArgs
): Promise<User> {
  return client.getCurrentUser();
}
