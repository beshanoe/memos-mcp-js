import { spawn } from 'node:child_process';
import type { SpawnOptions } from './types.js';

export function spawnMemosServer(options: SpawnOptions): Promise<number> {
  const { binaryPath, args, env } = options;

  return new Promise((resolve, reject) => {
    const processEnv = {
      ...process.env,
      ...env,
    };

    const child = spawn(binaryPath, args, {
      stdio: 'inherit',
      env: processEnv,
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to spawn memos-mcp: ${error.message}`));
    });

    child.on('close', (code) => {
      resolve(code ?? 0);
    });

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    for (const signal of signals) {
      process.on(signal, () => {
        child.kill(signal);
      });
    }
  });
}
