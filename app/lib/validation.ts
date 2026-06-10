const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TICKER_PATTERN = /^[A-Z0-9][A-Z0-9.-]{0,9}$/;

export function normalizeTicker(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Invalid ticker.');
  }

  const ticker = value.trim().toUpperCase();
  if (!TICKER_PATTERN.test(ticker)) {
    throw new Error('Invalid ticker.');
  }

  return ticker;
}

export function sanitizeFreeText(value: unknown, maxLength = 1200): string {
  if (value === null || value === undefined) {
    return '';
  }

  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const text = typeof serialized === 'string' ? serialized : String(value);
  return text
    .replace(CONTROL_CHAR_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function serializeForPrompt(value: unknown, maxLength = 6000): string {
  try {
    return sanitizeFreeText(JSON.stringify(value, null, 2), maxLength);
  } catch {
    return '';
  }
}

export function sanitizeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getSafeMarkdownHref(value: unknown): { href: string; isExternal: boolean } | null {
  if (typeof value !== 'string') {
    return null;
  }

  const href = value.trim();
  if (!href || href.startsWith('//')) {
    return null;
  }

  if (href.startsWith('/')) {
    return { href, isExternal: false };
  }

  try {
    const url = new URL(href);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return { href: url.toString(), isExternal: true };
    }

    if (url.protocol === 'mailto:') {
      return { href: url.toString(), isExternal: true };
    }
  } catch {
    return null;
  }

  return null;
}
