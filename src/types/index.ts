export type Visibility = "PUBLIC" | "PROTECTED" | "PRIVATE" | "VISIBILITY_UNSPECIFIED";

export interface Memo {
  name: string;
  uid: string;
  creator: string;
  content: string;
  visibility: Visibility;
  pinned: boolean;
  tags: string[];
  createTime: string;
  updateTime: string;
  displayTime: string;
  snippet: string;
}

export interface SearchRequest {
  query?: string;
  creatorId?: number;
  tag?: string;
  visibility?: string;
  pinned?: boolean;
  limit?: number;
  offset?: number;
  pageToken?: string;
  orderBy?: string;
  showDeleted?: boolean;
}

export interface SearchResponse {
  memos: Memo[];
  nextPageToken?: string;
}

export interface CreateMemoRequest {
  content: string;
  visibility?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface UpdateMemoRequest {
  content?: string;
  visibility?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface SearchResult {
  count: number;
  memos: Memo[];
  nextPageToken?: string;
}

export interface MemoResult {
  success: boolean;
  memo: Memo;
}

export interface DeleteResult {
  success: boolean;
  uid: string;
  force: boolean;
}

export class MemosApiError extends Error {
  constructor(
    public statusCode: number,
    public body: string
  ) {
    super(body || `Memos API error: ${statusCode}`);
    this.name = "MemosApiError";
  }
}
