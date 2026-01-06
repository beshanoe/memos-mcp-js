import { expect, test } from 'bun:test';
import { getBinaryName } from '../src/platform';

test('getBinaryName maps linux amd64', () => {
  const name = getBinaryName({ os: 'linux', arch: 'x64' });
  expect(name).toBe('memos-mcp-linux-amd64');
});

test('getBinaryName maps windows arm64', () => {
  const name = getBinaryName({ os: 'win32', arch: 'arm64' });
  expect(name).toBe('memos-mcp-windows-arm64.exe');
});
