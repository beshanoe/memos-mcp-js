import { parseArgs, buildServerArgs, validateOptions } from './cli.js';
import { detectPlatform } from './platform.js';
import { BinaryManager, createDefaultConfig } from './binary-manager.js';
import { spawnMemosServer } from './spawner.js';

function log(message: string): void {
  console.error(`[memos-mcp] ${message}`);
}

function logError(message: string): void {
  console.error(`[memos-mcp] Error: ${message}`);
}

async function main(): Promise<void> {
  try {
    const options = parseArgs();
    validateOptions(options);

    if (options.verbose) {
      log(`Base URL: ${options.baseUrl}`);
      log(`Version: ${options.version}`);
    }

    const platform = detectPlatform();
    if (options.verbose) {
      log(`Platform: ${platform.os}-${platform.arch}`);
    }

    const binaryConfig = createDefaultConfig({
      version: options.version,
    });
    const binaryManager = new BinaryManager(binaryConfig);

    const binaryPath = await binaryManager.ensureBinary(platform);
    if (options.verbose) {
      log(`Binary path: ${binaryPath}`);
    }

    const serverArgs = buildServerArgs(options);

    const exitCode = await spawnMemosServer({
      binaryPath,
      args: serverArgs,
    });

    process.exit(exitCode);
  } catch (error) {
    logError(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
