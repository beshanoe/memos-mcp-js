import { expect, test } from 'bun:test';
import { buildServerArgs, validateOptions } from '../src/cli';
import type { CLIOptions } from '../src/types';

const baseOptions: CLIOptions = {
  baseUrl: 'http://127.0.0.1:5230',
  accessToken: 'token',
  timeout: 30,
  version: 'latest',
  verbose: false,
};

test('buildServerArgs includes base args and token', () => {
  const args = buildServerArgs(baseOptions);
  expect(args).toEqual([
    '--base-url',
    'http://127.0.0.1:5230',
    '--timeout',
    '30',
    '--access-token',
    'token',
  ]);
});

test('validateOptions rejects invalid base URL', () => {
  expect(() =>
    validateOptions({
      ...baseOptions,
      baseUrl: 'not-a-url',
    })
  ).toThrow('Invalid base URL');
});

test('validateOptions rejects invalid timeout', () => {
  expect(() =>
    validateOptions({
      ...baseOptions,
      timeout: 0,
    })
  ).toThrow('Timeout must be a positive number');
});
