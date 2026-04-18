import { describe, expect, it } from "vitest";

import {
  generationDetailsSchema,
  isTerminalGenerationStatus,
} from "./schemas";

describe("generationDetailsSchema", () => {
  it("parses successful generation payloads", () => {
    const sample = {
      taskId: "task-123",
      status: "SUCCESS",
      response: {
        taskId: "task-123",
        sunoData: [
          {
            id: "audio-1",
            audioUrl: "https://cdn.test/track.mp3",
            streamAudioUrl: "https://cdn.test/stream",
            title: "Night run",
            duration: 180,
          },
        ],
      },
    };

    const parsed = generationDetailsSchema.parse(sample);
    expect(parsed.status).toBe("SUCCESS");
    expect(parsed.response?.sunoData?.[0]?.title).toBe("Night run");
  });
});

describe("isTerminalGenerationStatus", () => {
  it("flags completion and failure states", () => {
    expect(isTerminalGenerationStatus("SUCCESS")).toBe(true);
    expect(isTerminalGenerationStatus("PENDING")).toBe(false);
  });
});
