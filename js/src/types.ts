export type OS = 'darwin' | 'linux' | 'win32';
export type Arch = 'x64' | 'arm64';

export interface PlatformInfo {
  os: OS;
  arch: Arch;
}

export interface BinaryManagerConfig {
  cacheDir: string;
  githubRepo: string;
  version: string;
}

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GithubRelease {
  tag_name: string;
  assets: ReleaseAsset[];
}

export interface SpawnOptions {
  binaryPath: string;
  args: string[];
  env?: Record<string, string>;
}

export interface CLIOptions {
  baseUrl: string;
  accessToken?: string;
  timeout: number;
  version: string;
  verbose: boolean;
}

export interface ChecksumInfo {
  sha256: string;
  filename: string;
}
