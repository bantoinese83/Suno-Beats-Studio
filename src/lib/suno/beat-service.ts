import {
  buildCustomInstrumentalPayload,
  buildQuickInstrumentalPayload,
  type CustomInstrumentalBeatInput,
  type QuickBeatInput,
} from "./beat-payload";
import { DEFAULT_SUNO_BASE_URL, type SunoEnv } from "./env";
import type { SunoModel } from "./models";
import { SunoClient } from "./suno-client";
import type { GenerationDetails } from "./schemas";

export type BeatGenerationService = {
  submitQuickBeat: (input: QuickBeatInput) => Promise<{ taskId: string }>;
  submitCustomInstrumentalBeat: (
    input: CustomInstrumentalBeatInput,
  ) => Promise<{ taskId: string }>;
  getGenerationStatus: (taskId: string) => Promise<GenerationDetails>;
};

export function createBeatGenerationService(
  env: SunoEnv,
  overrides?: { client?: SunoClient | undefined } | undefined,
): BeatGenerationService {
  const client =
    overrides?.client ??
    new SunoClient({
      apiKey: env.SUNO_API_KEY,
      baseUrl: env.SUNO_API_BASE_URL ?? DEFAULT_SUNO_BASE_URL,
    });

  const callbackUrl = env.SUNO_CALLBACK_URL;

  return {
    async submitQuickBeat(input: QuickBeatInput) {
      const body = buildQuickInstrumentalPayload(input, callbackUrl);
      return client.generateMusic(body);
    },

    async submitCustomInstrumentalBeat(input: CustomInstrumentalBeatInput) {
      const body = buildCustomInstrumentalPayload(input, callbackUrl);
      return client.generateMusic(body);
    },

    async getGenerationStatus(taskId: string) {
      return client.getGenerationRecord(taskId);
    },
  };
}

export type SubmitBeatBody =
  | {
      mode: "quick";
      prompt: string;
      model?: SunoModel | undefined;
    }
  | {
      mode: "custom";
      style: string;
      title: string;
      model?: SunoModel | undefined;
    };

export async function submitBeatForRequest(
  service: BeatGenerationService,
  body: SubmitBeatBody,
): Promise<{ taskId: string }> {
  if (body.mode === "quick") {
    return service.submitQuickBeat({
      prompt: body.prompt,
      model: body.model,
    });
  }

  return service.submitCustomInstrumentalBeat({
    style: body.style,
    title: body.title,
    model: body.model,
  });
}
