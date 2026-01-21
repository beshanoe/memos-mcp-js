import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MemosClient } from "./client/memos-client.js";
import { registerTools } from "./tools/index.js";

const VERSION = "0.2.0";

export interface ServerOptions {
  baseUrl: string;
  accessToken: string;
  timeout?: number;
}

export function createServer(options: ServerOptions): McpServer {
  const client = new MemosClient(
    options.baseUrl,
    options.accessToken,
    options.timeout
  );

  const server = new McpServer({
    name: "memos-mcp",
    version: VERSION,
  });

  registerTools(server, client);

  return server;
}

export async function main(options: ServerOptions): Promise<void> {
  const server = createServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export { MemosClient } from "./client/memos-client.js";
export * from "./types/index.js";
