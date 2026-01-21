# memos-mcp

MCP (Model Context Protocol) server for the self-hosted notes app [Memos](https://github.com/usememos/memos).

## Features

- Search memos with filters and pagination
- Create, read, update, delete memos
- Tag support for organizing memos
- Access token authentication via Bearer token

## Requirements

- Node.js >= 18
- A running Memos instance (default `http://localhost:5230`)
- An access token (Settings → Access Tokens)

## Installation

```bash
git clone https://github.com/beshanoe/memos-mcp-js.git
cd memos-mcp-js
npm install
npm run build
```

## Configuration

Environment variables:

- `MEMOS_BASE_URL` (default: `http://localhost:5230`)
- `MEMOS_ACCESS_TOKEN` or `MEMOS_API_TOKEN`

CLI flags:

- `--base-url` - Memos instance URL
- `--access-token` / `--api-token` - Bearer token for authentication
- `--timeout` - HTTP timeout in seconds (default: 30)

## MCP Tools

### memos_search

Search memos with filters and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | Text to search for in memo content |
| creator_id | number | Filter by creator user ID |
| tag | string | Filter by tag name |
| visibility | string | PUBLIC, PROTECTED, or PRIVATE |
| pinned | boolean | Filter by pinned status |
| limit | number | Maximum results (default 10) |
| offset | number | Results offset (default 0) |
| page_token | string | Page token from previous response |
| order_by | string | Order by fields, e.g. "pinned desc, display_time desc" |
| show_deleted | boolean | Include deleted memos |

### memos_get

Get a memo by UID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| memo_uid | string | Yes | Memo UID or name (e.g., 'abc123' or 'memos/abc123') |

### memos_create

Create a new memo.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string | Yes | Memo content in Markdown |
| visibility | string | No | PUBLIC, PROTECTED, or PRIVATE (default) |
| pinned | boolean | No | Whether to pin the memo |
| tags | string[] | No | Tags for the memo |

### memos_update

Update an existing memo.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| memo_uid | string | Yes | Memo UID or name (e.g., 'abc123' or 'memos/abc123') |
| content | string | No | New memo content |
| visibility | string | No | PUBLIC, PROTECTED, or PRIVATE |
| pinned | boolean | No | Whether to pin the memo |
| tags | string[] | No | Tags for the memo (replaces existing tags) |

### memos_delete

Delete a memo by UID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| memo_uid | string | Yes | Memo UID or name (e.g., 'abc123' or 'memos/abc123') |
| force | boolean | No | Force delete even if memo has associated data |

## MCP Client Configuration

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "memos": {
      "command": "node",
      "args": [
        "/path/to/memos-mcp/dist/cli.js",
        "--base-url", "http://localhost:5230",
        "--access-token", "YOUR_TOKEN"
      ]
    }
  }
}
```

### Using environment variables

```json
{
  "mcpServers": {
    "memos": {
      "command": "node",
      "args": ["/path/to/memos-mcp/dist/cli.js"],
      "env": {
        "MEMOS_BASE_URL": "http://localhost:5230",
        "MEMOS_ACCESS_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```

## Development

```bash
# Run in development mode
npm run dev -- --base-url http://localhost:5230 --access-token YOUR_TOKEN

# Type check
npm run typecheck

# Build
npm run build
```

## License

MIT
