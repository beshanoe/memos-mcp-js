import { z } from "zod";
import type { MemosClient } from "../client/memos-client.js";
import type { SearchResult, SearchRequest } from "../types/index.js";

export const searchSchema = {
  query: z.string().optional().describe("Text to search for in memo content"),
  creator_id: z.number().optional().describe("Filter by creator user ID"),
  tag: z.string().optional().describe("Filter by tag name"),
  visibility: z.string().optional().describe("Visibility: PUBLIC, PROTECTED, PRIVATE"),
  pinned: z.boolean().optional().describe("Filter by pinned status"),
  limit: z.number().optional().describe("Maximum results to return (default 10)"),
  offset: z.number().optional().describe("Results offset (default 0)"),
  page_token: z.string().optional().describe("Page token from a previous response"),
  order_by: z.string().optional().describe("Order by fields, e.g. pinned desc, display_time desc"),
  show_deleted: z.boolean().optional().describe("Include deleted memos"),
};

export type SearchArgs = {
  query?: string;
  creator_id?: number;
  tag?: string;
  visibility?: string;
  pinned?: boolean;
  limit?: number;
  offset?: number;
  page_token?: string;
  order_by?: string;
  show_deleted?: boolean;
};

export async function handleSearch(
  client: MemosClient,
  args: SearchArgs
): Promise<SearchResult> {
  const req: SearchRequest = {
    query: args.query,
    creatorId: args.creator_id,
    tag: args.tag,
    visibility: args.visibility,
    pinned: args.pinned,
    limit: args.limit,
    offset: args.offset,
    pageToken: args.page_token,
    orderBy: args.order_by,
    showDeleted: args.show_deleted,
  };

  const response = await client.searchMemos(req);

  return {
    count: response.memos.length,
    memos: response.memos,
    nextPageToken: response.nextPageToken,
  };
}
