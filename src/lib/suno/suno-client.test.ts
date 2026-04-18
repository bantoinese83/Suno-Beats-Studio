import { describe, expect, it } from "vitest";

import { buildQuickInstrumentalPayload } from "./beat-payload";
import { SunoRequestError } from "./errors";
import { SunoClient } from "./suno-client";

describe("SunoClient", () => {
  it("parses successful generate responses", async () => {
    const fetchFn = async () =>
      new Response(
        JSON.stringify({
          code: 200,
          msg: "success",
          data: { taskId: "abc" },
        }),
        { status: 200 },
      );

    const client = new SunoClient({
      apiKey: "test",
      baseUrl: "https://api.test",
      fetchFn,
    });

    const body = buildQuickInstrumentalPayload(
      { prompt: "House groove" },
      "https://example.com/hook",
    );

    await expect(client.generateMusic(body)).resolves.toEqual({
      taskId: "abc",
    });
  });

  it("maps API error codes to SunoRequestError", async () => {
    const fetchFn = async () =>
      new Response(
        JSON.stringify({
          code: 429,
          msg: "Insufficient credits",
        }),
        { status: 200 },
      );

    const client = new SunoClient({
      apiKey: "test",
      baseUrl: "https://api.test",
      fetchFn,
    });

    const body = buildQuickInstrumentalPayload(
      { prompt: "House groove" },
      "https://example.com/hook",
    );

    await expect(client.generateMusic(body)).rejects.toBeInstanceOf(
      SunoRequestError,
    );
  });
});
