import { describe, expect, it } from "vitest";

import { toSunoCallbackRecord } from "./callback-record";
import { sunoMusicCallbackPayloadSchema } from "./callback-payload.schema";
import { MemorySunoCallbackStore } from "./memory-callback-store";

describe("MemorySunoCallbackStore", () => {
  it("persists the latest record per task", async () => {
    const store = new MemorySunoCallbackStore();
    const payload = sunoMusicCallbackPayloadSchema.parse({
      code: 200,
      msg: "ok",
      data: {
        callbackType: "first",
        task_id: "task-1",
        data: [
          {
            id: "audio-1",
            title: "Sketch",
            audio_url: "https://cdn.test/a.mp3",
          },
        ],
      },
    });

    await store.saveRecord(toSunoCallbackRecord(payload, new Date("2025-01-01T00:00:00.000Z")));

    const latest = await store.getLatest("task-1");
    expect(latest?.callbackType).toBe("first");
    expect(latest?.tracks?.[0]?.title).toBe("Sketch");
  });
});
