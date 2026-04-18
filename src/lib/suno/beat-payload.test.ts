import { describe, expect, it } from "vitest";

import {
  buildCustomInstrumentalPayload,
  buildQuickInstrumentalPayload,
} from "./beat-payload";

describe("buildQuickInstrumentalPayload", () => {
  it("creates non-custom instrumental bodies", () => {
    const body = buildQuickInstrumentalPayload(
      { prompt: "Lo-fi drums, no vocals" },
      "https://example.com/callback",
    );

    expect(body).toEqual({
      customMode: false,
      instrumental: true,
      model: "V4_5ALL",
      callBackUrl: "https://example.com/callback",
      prompt: "Lo-fi drums, no vocals",
    });
  });

  it("respects explicit models", () => {
    const body = buildQuickInstrumentalPayload(
      { prompt: "Trap bounce", model: "V5" },
      "https://example.com/callback",
    );

    expect(body.model).toBe("V5");
  });
});

describe("buildCustomInstrumentalPayload", () => {
  it("creates custom instrumental bodies", () => {
    const body = buildCustomInstrumentalPayload(
      { style: "Neo-soul drums, warm bass", title: "Velvet room" },
      "https://example.com/callback",
    );

    expect(body).toEqual({
      customMode: true,
      instrumental: true,
      model: "V4_5ALL",
      callBackUrl: "https://example.com/callback",
      style: "Neo-soul drums, warm bass",
      title: "Velvet room",
    });
  });
});
