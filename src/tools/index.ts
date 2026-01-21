import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MemosClient } from "../client/memos-client.js";
import { searchSchema, handleSearch, type SearchArgs } from "./search.js";
import { getSchema, handleGet, type GetArgs } from "./get.js";
import { createSchema, handleCreate, type CreateArgs } from "./create.js";
import { updateSchema, handleUpdate, type UpdateArgs } from "./update.js";
import { deleteSchema, handleDelete, type DeleteArgs } from "./delete.js";

export function registerTools(server: McpServer, client: MemosClient): void {
  server.registerTool(
    "memos_search",
    {
      description: "Search memos with filters and pagination",
      inputSchema: searchSchema,
    },
    async (args: SearchArgs) => {
      const result = await handleSearch(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_get",
    {
      description: "Get a memo by UID",
      inputSchema: getSchema,
    },
    async (args: GetArgs) => {
      const result = await handleGet(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_create",
    {
      description: "Create a new memo",
      inputSchema: createSchema,
    },
    async (args: CreateArgs) => {
      const result = await handleCreate(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_update",
    {
      description: "Update an existing memo",
      inputSchema: updateSchema,
    },
    async (args: UpdateArgs) => {
      const result = await handleUpdate(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_delete",
    {
      description: "Delete a memo by UID",
      inputSchema: deleteSchema,
    },
    async (args: DeleteArgs) => {
      const result = await handleDelete(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
