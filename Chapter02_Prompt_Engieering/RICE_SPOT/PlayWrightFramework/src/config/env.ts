import 'dotenv/config';

function positiveInteger(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (rawValue === undefined || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer; received "${rawValue}".`);
  }
  return value;
}

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('BASE_URL is required. Copy .env.example to .env and configure the target URL.');
}

try {
  new URL(baseURL);
} catch {
  throw new Error(`BASE_URL must be an absolute URL; received "${baseURL}".`);
}

export const env = {
  baseURL,
  testTimeoutMs: positiveInteger('TEST_TIMEOUT_MS', 30_000),
  expectTimeoutMs: positiveInteger('EXPECT_TIMEOUT_MS', 7_000),
  workers: positiveInteger('WORKERS', 4),
} as const;
