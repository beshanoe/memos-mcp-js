import type { SearchRequest, Visibility } from "../types/index.js";

export function buildMemoFilter(req: SearchRequest): string {
  const filters: string[] = [];

  if (req.creatorId !== undefined) {
    filters.push(`creator_id == ${req.creatorId}`);
  }

  if (req.query) {
    filters.push(`content.contains("${escapeFilterValue(req.query)}")`);
  }

  if (req.tag) {
    filters.push(`tag in ["${escapeFilterValue(req.tag)}"]`);
  }

  if (req.visibility) {
    const normalized = normalizeVisibility(req.visibility);
    filters.push(`visibility == "${normalized}"`);
  }

  if (req.pinned !== undefined) {
    filters.push(`pinned == ${req.pinned}`);
  }

  return filters.join(" && ");
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function normalizeVisibility(value: string): Visibility {
  const clean = value.trim().toUpperCase();

  if (!clean) {
    throw new Error("visibility cannot be empty");
  }

  switch (clean) {
    case "PUBLIC":
    case "PROTECTED":
    case "PRIVATE":
      return clean as Visibility;
    case "VISIBILITY_UNSPECIFIED":
    case "UNSPECIFIED":
      return "VISIBILITY_UNSPECIFIED";
    default:
      throw new Error(`invalid visibility: ${value}`);
  }
}
