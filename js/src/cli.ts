import { Command } from 'commander';
import { createRequire } from 'node:module';
import type { CLIOptions } from './types.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string };
const VERSION = pkg.version;

export function parseArgs(): CLIOptions {
  const program = new Command();
  const envBaseUrl = process.env.MEMOS_BASE_URL ?? 'http://127.0.0.1:5230';
  const envToken =
    process.env.MEMOS_ACCESS_TOKEN ?? process.env.MEMOS_API_TOKEN ?? '';

  program
    .name('memos-mcp')
    .description('MCP stdio wrapper for memos-mcp')
    .version(VERSION)
    .option('-b, --base-url <url>', 'Memos base URL', envBaseUrl)
    .option('-t, --access-token <token>', 'Memos access token', envToken)
    .option('--api-token <token>', 'Alias for --access-token')
    .option('--timeout <seconds>', 'HTTP timeout in seconds', '30')
    .option('--version-tag <version>', 'Specific memos-mcp version to use', 'latest')
    .option('-v, --verbose', 'Enable verbose logging', false)
    .parse(process.argv);

  const opts = program.opts();
  const accessToken = (opts.apiToken as string) || (opts.accessToken as string);

  return {
    baseUrl: opts.baseUrl as string,
    accessToken,
    timeout: Number.parseInt(opts.timeout as string, 10),
    version: opts.versionTag as string,
    verbose: opts.verbose as boolean,
  };
}

export function buildServerArgs(options: CLIOptions): string[] {
  const args: string[] = [];

  args.push('--base-url', options.baseUrl);
  args.push('--timeout', String(options.timeout));

  if (options.accessToken) {
    args.push('--access-token', options.accessToken);
  }

  return args;
}

export function validateOptions(options: CLIOptions): void {
  try {
    new URL(options.baseUrl);
  } catch {
    throw new Error(`Invalid base URL: ${options.baseUrl}`);
  }

  if (!Number.isFinite(options.timeout) || options.timeout <= 0) {
    throw new Error('Timeout must be a positive number');
  }
}
