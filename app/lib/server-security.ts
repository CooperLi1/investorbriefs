import { auth } from '@clerk/nextjs/server';

const TRUSTED_JSON_HOSTS = new Set(['newsapi.org', 'www.alphavantage.co']);
const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_MAX_RESPONSE_BYTES = 1_000_000;

export async function requireSignedInUser(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized.');
  }

  return userId;
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server configuration: ${name}`);
  }

  return value;
}

export async function fetchTrustedJson(
  url: URL,
  options: { maxBytes?: number; timeoutMs?: number } = {},
): Promise<unknown> {
  if (url.protocol !== 'https:' || !TRUSTED_JSON_HOSTS.has(url.hostname)) {
    throw new Error('Blocked untrusted upstream request.');
  }

  const maxBytes = options.maxBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Upstream request failed with status ${response.status}.`);
    }

    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > maxBytes) {
      throw new Error('Upstream response was too large.');
    }

    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      throw new Error('Upstream response was too large.');
    }

    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}
