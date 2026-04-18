import { describe, expect, it } from "vitest";

import { sunoMusicCallbackPayloadSchema } from "./callback-payload.schema";

describe("sunoMusicCallbackPayloadSchema", () => {
  it("accepts successful callbacks from the docs", () => {
    const sample = {
      code: 200,
      msg: "All generated successfully.",
      data: {
        callbackType: "complete",
        task_id: "2fac****9f72",
        data: [
          {
            id: "8551****662c",
            audio_url: "https://example.cn/track.mp3",
            stream_audio_url: "https://example.cn/stream",
            image_url: "https://example.cn/cover.jpeg",
            prompt: "[Verse] Night city lights shining bright",
            model_name: "chirp-v3-5",
            title: "Iron Man",
            tags: "electrifying, rock",
            createTime: "2025-01-01 00:00:00",
            duration: 198.44,
          },
        ],
      },
    };

    const parsed = sunoMusicCallbackPayloadSchema.parse(sample);
    expect(parsed.data.callbackType).toBe("complete");
    expect(parsed.data.data?.[0]?.title).toBe("Iron Man");
  });

  it("accepts error callbacks with null tracks", () => {
    const sample = {
      code: 400,
      msg: "Music generation failed",
      data: {
        callbackType: "error",
        task_id: "2fac****9f72",
        data: null,
      },
    };

    const parsed = sunoMusicCallbackPayloadSchema.parse(sample);
    expect(parsed.data.data).toBeNull();
  });
});
