import os from 'node:os';
import type { PlatformInfo, OS, Arch } from './types.js';

const PLATFORM_MAP: Record<string, OS> = {
  darwin: 'darwin',
  linux: 'linux',
  win32: 'win32',
};

const ARCH_MAP: Record<string, Arch> = {
  x64: 'x64',
  arm64: 'arm64',
  amd64: 'x64',
};

export function detectPlatform(): PlatformInfo {
  const platform = os.platform();
  const arch = os.arch();

  const mappedOS = PLATFORM_MAP[platform];
  const mappedArch = ARCH_MAP[arch];

  if (!mappedOS) {
    throw new Error(
      `Unsupported operating system: ${platform}. Supported: darwin, linux, win32`
    );
  }

  if (!mappedArch) {
    throw new Error(
      `Unsupported architecture: ${arch}. Supported: x64, arm64`
    );
  }

  return {
    os: mappedOS,
    arch: mappedArch,
  };
}

export function getBinaryName(platform: PlatformInfo): string {
  const archName = platform.arch === 'x64' ? 'amd64' : platform.arch;
  const osName = platform.os === 'win32' ? 'windows' : platform.os;
  const ext = platform.os === 'win32' ? '.exe' : '';
  return `memos-mcp-${osName}-${archName}${ext}`;
}

export function getChecksumsFileName(): string {
  return 'checksums.txt';
}

export function isPlatformSupported(): boolean {
  try {
    const platform = detectPlatform();
    if (platform.os === 'win32') {
      console.error('[memos-mcp] Warning: Windows support is experimental');
    }
    return true;
  } catch {
    return false;
  }
}
