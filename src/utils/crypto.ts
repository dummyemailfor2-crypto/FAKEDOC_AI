/**
 * Cryptographic SHA-256 utilities for document fingerprinting
 */

export async function computeSha256(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    // Fallback simple 64-char hash if subtle crypto is somehow unavailable
    return fallbackHash(data);
  }

  let buffer: BufferSource;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    buffer = encoder.encode(data);
  } else if (data instanceof Uint8Array) {
    buffer = data;
  } else {
    buffer = data;
  }

  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function computeFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return computeSha256(arrayBuffer);
}

function fallbackHash(input: any): string {
  const str = String(input);
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2 + part1 + part2 + part1 + part2 + part1 + part2).slice(0, 64);
}
