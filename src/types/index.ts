export type Visibility = "PUBLIC" | "PROTECTED" | "PRIVATE" | "VISIBILITY_UNSPECIFIED";

export type RelationType = "TYPE_UNSPECIFIED" | "REFERENCE" | "COMMENT";

export interface MemoRelation {
  memo: { name: string; snippet?: string };
  relatedMemo: { name: string; snippet?: string };
  type: RelationType;
}

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
  relations?: MemoRelation[];
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

export interface CreateMemoRelation {
  relatedMemo: string;
  type: RelationType;
}

export interface CreateMemoRequest {
  content: string;
  visibility?: string;
  pinned?: boolean;
  relations?: CreateMemoRelation[];
}

export interface UpdateMemoRequest {
  content?: string;
  visibility?: string;
  pinned?: boolean;
  relations?: CreateMemoRelation[];
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

export interface ListRelationsResult {
  relations: MemoRelation[];
}

export interface SetRelationsResult {
  success: boolean;
  uid: string;
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

export type UserRole = "ROLE_UNSPECIFIED" | "HOST" | "ADMIN" | "USER";
export type UserState = "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";

export interface User {
  name: string;
  username: string;
  role: UserRole;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  description?: string;
  state: UserState;
  createTime: string;
  updateTime: string;
}

export interface MemoTypeStats {
  linkCount: number;
  codeCount: number;
  todoCount: number;
  undoCount: number;
}

export interface UserStats {
  name: string;
  memoDisplayTimestamps: string[];
  memoTypeStats: MemoTypeStats;
  tagCount: Record<string, number>;
  pinnedMemos: string[];
  totalMemoCount: number;
}
