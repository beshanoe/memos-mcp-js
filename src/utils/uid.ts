/**
 * Extracts the UID from a memo identifier.
 * Handles both formats:
 * - "abc123" → "abc123"
 * - "memos/abc123" → "abc123"
 */
export function extractUid(value: string): string {
  if (value.startsWith("memos/")) {
    return value.slice(6);
  }
  return value;
}
