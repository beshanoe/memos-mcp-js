import type {
  Memo,
  SearchRequest,
  SearchResponse,
  CreateMemoRequest,
  UpdateMemoRequest,
} from "../types/index.js";
import { MemosApiError } from "../types/index.js";
import { buildMemoFilter, normalizeVisibility } from "../utils/filter.js";

export class MemosClient {
  private baseUrl: string;

  constructor(
    baseUrl: string,
    private accessToken: string,
    private timeout = 30000
  ) {
    const trimmed = baseUrl.trim();
    if (!trimmed) {
      throw new Error("base URL is required");
    }

    try {
      const parsed = new URL(trimmed);
      if (!parsed.protocol) {
        throw new Error("base URL must include scheme");
      }
    } catch {
      throw new Error(`invalid base URL: ${trimmed}`);
    }

    this.baseUrl = trimmed.replace(/\/+$/, "");
  }

  async searchMemos(req: SearchRequest): Promise<SearchResponse> {
    const limit = req.limit && req.limit > 0 ? req.limit : 10;
    const filter = buildMemoFilter(req);

    const params = new URLSearchParams();
    params.set("pageSize", String(limit));

    if (filter) {
      params.set("filter", filter);
    }
    if (req.orderBy) {
      params.set("orderBy", req.orderBy);
    }
    if (req.showDeleted) {
      params.set("showDeleted", "true");
    }
    if (req.pageToken) {
      params.set("pageToken", req.pageToken);
    } else if (req.offset && req.offset > 0) {
      params.set("pageToken", `offset=${req.offset}`);
    }

    return this.request<SearchResponse>(`/api/v1/memos?${params}`);
  }

  async getMemo(uid: string): Promise<Memo> {
    if (!uid.trim()) {
      throw new Error("memo uid is required");
    }
    return this.request<Memo>(`/api/v1/memos/${encodeURIComponent(uid)}`);
  }

  async createMemo(req: CreateMemoRequest): Promise<Memo> {
    if (!req.content.trim()) {
      throw new Error("content is required");
    }

    const visibility = normalizeVisibility(req.visibility || "PRIVATE");

    const payload: Record<string, unknown> = {
      state: "STATE_UNSPECIFIED",
      content: req.content,
      visibility,
    };

    if (req.pinned !== undefined) {
      payload.pinned = req.pinned;
    }
    if (req.tags !== undefined) {
      payload.tags = req.tags;
    }

    return this.request<Memo>("/api/v1/memos", {
      method: "POST",
      body: payload,
    });
  }

  async updateMemo(uid: string, req: UpdateMemoRequest): Promise<Memo> {
    if (!uid.trim()) {
      throw new Error("memo uid is required");
    }

    const payload: Record<string, unknown> = {
      state: "STATE_UNSPECIFIED",
    };

    if (req.content !== undefined) {
      payload.content = req.content;
    }
    if (req.visibility !== undefined) {
      payload.visibility = normalizeVisibility(req.visibility);
    }
    if (req.pinned !== undefined) {
      payload.pinned = req.pinned;
    }
    if (req.tags !== undefined) {
      payload.tags = req.tags;
    }

    if (Object.keys(payload).length === 1) {
      throw new Error("at least one field must be provided for update");
    }

    return this.request<Memo>(`/api/v1/memos/${encodeURIComponent(uid)}`, {
      method: "PATCH",
      body: payload,
    });
  }

  async deleteMemo(uid: string, force = false): Promise<void> {
    if (!uid.trim()) {
      throw new Error("memo uid is required");
    }

    const params = force ? "?force=true" : "";
    await this.request(`/api/v1/memos/${encodeURIComponent(uid)}${params}`, {
      method: "DELETE",
    });
  }

  private async request<T>(
    path: string,
    options?: { method?: string; body?: unknown }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const method = options?.method ?? "GET";

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (options?.body) {
      headers["Content-Type"] = "application/json";
    }

    if (this.accessToken.trim()) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const body = (await response.text()).trim();
      throw new MemosApiError(
        response.status,
        body || `Memos API error: ${response.status} ${response.statusText}`
      );
    }

    if (method === "DELETE") {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }
}
