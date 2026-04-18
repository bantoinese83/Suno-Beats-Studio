import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Suno does not document a signed header. Use a shared secret you embed in the
 * public callback URL query string and/or terminate TLS at a trusted proxy that
 * injects an authorization header.
 *
 * @see https://docs.sunoapi.org/suno-api/generate-music-callbacks — “Verify Source”
 */
function constantTimeEqual(expected: string, received: string): boolean {
  const left = createHash("sha256").update(expected, "utf8").digest();
  const right = createHash("sha256").update(received, "utf8").digest();
  return timingSafeEqual(left, right);
}

function readBearerToken(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const prefix = "Bearer ";

  if (!header.startsWith(prefix)) {
    return null;
  }

  return header.slice(prefix.length);
}

export function isWebhookAuthorized(request: Request): boolean {
  const secret = process.env.SUNO_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token && constantTimeEqual(secret, token)) {
    return true;
  }

  const bearer = readBearerToken(request.headers.get("authorization"));

  if (bearer && constantTimeEqual(secret, bearer)) {
    return true;
  }

  const headerSecret = request.headers.get("x-suno-beats-secret");

  return Boolean(headerSecret && constantTimeEqual(secret, headerSecret));
}

export function assertCanReadCallbackState(request: Request): boolean {
  const secret = process.env.SUNO_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  const bearer = readBearerToken(request.headers.get("authorization"));
  return Boolean(bearer && constantTimeEqual(secret, bearer));
}
