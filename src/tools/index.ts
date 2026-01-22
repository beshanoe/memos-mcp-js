import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MemosClient } from "../client/memos-client.js";
import { searchSchema, handleSearch, type SearchArgs } from "./search.js";
import { getSchema, handleGet, type GetArgs } from "./get.js";
import { createSchema, handleCreate, type CreateArgs } from "./create.js";
import { updateSchema, handleUpdate, type UpdateArgs } from "./update.js";
import { deleteSchema, handleDelete, type DeleteArgs } from "./delete.js";
import { currentUserSchema, handleCurrentUser, type CurrentUserArgs } from "./current-user.js";
import { userStatsSchema, handleUserStats, type UserStatsArgs } from "./user-stats.js";
import { listRelationsSchema, handleListRelations, type ListRelationsArgs } from "./list-relations.js";
import { setRelationsSchema, handleSetRelations, type SetRelationsArgs } from "./set-relations.js";

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

  server.registerTool(
    "memos_current_user",
    {
      description: "Get the authenticated user's info",
      inputSchema: currentUserSchema,
    },
    async (args: CurrentUserArgs) => {
      const result = await handleCurrentUser(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_user_stats",
    {
      description: "Get statistics for a user",
      inputSchema: userStatsSchema,
    },
    async (args: UserStatsArgs) => {
      const result = await handleUserStats(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_list_relations",
    {
      description: "List all relations for a specific memo",
      inputSchema: listRelationsSchema,
    },
    async (args: ListRelationsArgs) => {
      const result = await handleListRelations(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "memos_set_relations",
    {
      description: "Set/replace all relations for a memo. To add or remove relations, first list them, modify the array, then set.",
      inputSchema: setRelationsSchema,
    },
    async (args: SetRelationsArgs) => {
      const result = await handleSetRelations(client, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
