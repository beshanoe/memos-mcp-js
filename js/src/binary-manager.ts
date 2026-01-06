import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import type {
  BinaryManagerConfig,
  PlatformInfo,
  GithubRelease,
  ChecksumInfo,
} from './types.js';
import { getBinaryName, getChecksumsFileName } from './platform.js';

const DEFAULT_GITHUB_REPO = 'jtsang4/memos-mcp';
const DEFAULT_VERSION = 'latest';

export function getDefaultCacheDir(): string {
  const homeDir = os.homedir();
  if (process.platform === 'linux') {
    const xdgCache = process.env.XDG_CACHE_HOME;
    if (xdgCache) {
      return path.join(xdgCache, 'memos-mcp');
    }
  }
  return path.join(homeDir, '.cache', 'memos-mcp');
}

export function createDefaultConfig(
  overrides?: Partial<BinaryManagerConfig>
): BinaryManagerConfig {
  return {
    cacheDir: overrides?.cacheDir ?? getDefaultCacheDir(),
    githubRepo: overrides?.githubRepo ?? DEFAULT_GITHUB_REPO,
    version: overrides?.version ?? DEFAULT_VERSION,
  };
}

export class BinaryManager {
  private config: BinaryManagerConfig;

  constructor(config: BinaryManagerConfig) {
    this.config = config;
  }

  async ensureBinary(platform: PlatformInfo): Promise<string> {
    const binaryName = getBinaryName(platform);
    const version = await this.resolveVersion();
    const binaryDir = path.join(this.config.cacheDir, version);
    const binaryPath = path.join(binaryDir, binaryName);

    if (await this.isValidBinary(binaryPath, platform, version)) {
      this.log(`Using cached binary: ${binaryPath}`);
      return binaryPath;
    }

    this.log(`Downloading memos-mcp ${version} for ${platform.os}-${platform.arch}...`);
    await this.downloadBinary(binaryPath, platform, version);
    await this.makeExecutable(binaryPath);

    this.log(`Binary ready: ${binaryPath}`);
    return binaryPath;
  }

  private async resolveVersion(): Promise<string> {
    if (this.config.version !== 'latest') {
      return this.config.version;
    }

    const releaseUrl = `https://api.github.com/repos/${this.config.githubRepo}/releases/latest`;
    const response = await fetch(releaseUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'memos-mcp',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest release: ${response.statusText}`);
    }

    const release = (await response.json()) as GithubRelease;
    return release.tag_name;
  }

  private async isValidBinary(
    binaryPath: string,
    platform: PlatformInfo,
    version: string
  ): Promise<boolean> {
    try {
      await fs.promises.access(binaryPath, fs.constants.X_OK);
    } catch {
      return false;
    }

    try {
      const checksumInfo = await this.fetchChecksum(platform, version);
      if (checksumInfo) {
        const actualHash = await this.computeFileHash(binaryPath);
        return actualHash === checksumInfo.sha256;
      }
    } catch {
      this.log('Warning: Could not verify checksum, using cached binary');
    }

    return true;
  }

  private async downloadBinary(
    destPath: string,
    platform: PlatformInfo,
    version: string
  ): Promise<void> {
    const binaryName = getBinaryName(platform);
    const downloadUrl = `https://github.com/${this.config.githubRepo}/releases/download/${version}/${binaryName}`;

    const dir = path.dirname(destPath);
    await fs.promises.mkdir(dir, { recursive: true });

    const tempPath = `${destPath}.tmp`;

    try {
      const response = await fetch(downloadUrl, {
        headers: {
          'User-Agent': 'memos-mcp',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Binary not found for ${platform.os}-${platform.arch} version ${version}. ` +
              `Please check releases at https://github.com/${this.config.githubRepo}/releases`
          );
        }
        throw new Error(`Failed to download binary: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const arrayBuffer = await response.arrayBuffer();
      await fs.promises.writeFile(tempPath, Buffer.from(arrayBuffer));

      const checksumInfo = await this.fetchChecksum(platform, version);
      if (checksumInfo) {
        const actualHash = await this.computeFileHash(tempPath);
        if (actualHash !== checksumInfo.sha256) {
          await fs.promises.unlink(tempPath);
          throw new Error(
            `Checksum mismatch: expected ${checksumInfo.sha256}, got ${actualHash}`
          );
        }
        this.log('Checksum verified successfully');
      }

      await fs.promises.rename(tempPath, destPath);
    } catch (error) {
      try {
        await fs.promises.unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  private async fetchChecksum(
    platform: PlatformInfo,
    version: string
  ): Promise<ChecksumInfo | null> {
    const checksumFileName = getChecksumsFileName();
    const checksumUrl = `https://github.com/${this.config.githubRepo}/releases/download/${version}/${checksumFileName}`;

    try {
      const response = await fetch(checksumUrl, {
        headers: {
          'User-Agent': 'memos-mcp',
        },
      });

      if (!response.ok) {
        return null;
      }

      const content = await response.text();
      const binaryName = getBinaryName(platform);

      for (const line of content.split('\n')) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2 && parts[1] === binaryName) {
          return {
            sha256: parts[0],
            filename: parts[1],
          };
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  private async computeFileHash(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', (data: string | Buffer) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private async makeExecutable(filePath: string): Promise<void> {
    if (process.platform === 'win32') {
      return;
    }
    await fs.promises.chmod(filePath, 0o755);
  }

  private log(message: string): void {
    console.error(`[memos-mcp] ${message}`);
  }
}
