import { afterEach, describe, expect, it } from "vitest";

import {
  assertCanReadCallbackState,
  isWebhookAuthorized,
} from "./verify-webhook";

describe("isWebhookAuthorized", () => {
  const originalSecret = process.env.SUNO_WEBHOOK_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SUNO_WEBHOOK_SECRET;
    } else {
      process.env.SUNO_WEBHOOK_SECRET = originalSecret;
    }
  });

  it("allows traffic when no secret is configured", () => {
    delete process.env.SUNO_WEBHOOK_SECRET;
    expect(
      isWebhookAuthorized(new Request("https://example.com/api/webhooks/suno")),
    ).toBe(true);
  });

  it("validates token query parameters", () => {
    process.env.SUNO_WEBHOOK_SECRET = "secret-value";
    expect(
      isWebhookAuthorized(
        new Request("https://example.com/api/webhooks/suno?token=secret-value"),
      ),
    ).toBe(true);
    expect(
      isWebhookAuthorized(
        new Request("https://example.com/api/webhooks/suno?token=nope"),
      ),
    ).toBe(false);
  });

  it("validates bearer tokens", () => {
    process.env.SUNO_WEBHOOK_SECRET = "secret-value";
    expect(
      isWebhookAuthorized(
        new Request("https://example.com/api/webhooks/suno", {
          headers: { Authorization: "Bearer secret-value" },
        }),
      ),
    ).toBe(true);
  });
});

describe("assertCanReadCallbackState", () => {
  const originalSecret = process.env.SUNO_WEBHOOK_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SUNO_WEBHOOK_SECRET;
    } else {
      process.env.SUNO_WEBHOOK_SECRET = originalSecret;
    }
  });

  it("requires bearer secret when configured", () => {
    process.env.SUNO_WEBHOOK_SECRET = "secret-value";
    expect(
      assertCanReadCallbackState(
        new Request("https://example.com", {
          headers: { Authorization: "Bearer secret-value" },
        }),
      ),
    ).toBe(true);
    expect(assertCanReadCallbackState(new Request("https://example.com"))).toBe(
      false,
    );
  });
});
