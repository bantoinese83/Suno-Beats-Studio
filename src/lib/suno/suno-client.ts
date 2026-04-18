import { SunoRequestError, SunoTransportError } from "./errors";
import type { GenerateMusicRequestBody } from "./beat-payload";
import {
  apiEnvelopeSchema,
  generateMusicResponseSchema,
  generationDetailsSchema,
} from "./schemas";
import type { GenerationDetails } from "./schemas";

export type SunoClientConfig = {
  apiKey: string;
  baseUrl?: string | undefined;
  fetchFn?: typeof fetch | undefined;
};

function parseJsonResponse(text: string): unknown {
  if (!text) {
    return null;
  }
  return JSON.parse(text) as unknown;
}

export class SunoClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: SunoClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? "https://api.sunoapi.org").replace(
      /\/$/,
      "",
    );
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async generateMusic(
    body: GenerateMusicRequestBody,
  ): Promise<{ taskId: string }> {
    const res = await this.fetchFn(`${this.baseUrl}/api/v1/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new SunoTransportError("Suno returned a non-success HTTP status.", res.status, text);
    }

    const json = parseJsonResponse(text);
    const envelope = apiEnvelopeSchema.parse(json);

    if (envelope.code !== 200) {
      throw new SunoRequestError(
        "Suno could not start this generation.",
        envelope.code,
        envelope.msg,
      );
    }

    const data = generateMusicResponseSchema.parse(envelope.data);
    return { taskId: data.taskId };
  }

  async getGenerationRecord(taskId: string): Promise<GenerationDetails> {
    const url = new URL(`${this.baseUrl}/api/v1/generate/record-info`);
    url.searchParams.set("taskId", taskId);

    const res = await this.fetchFn(url.toString(), {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    const text = await res.text();

    if (!res.ok) {
      throw new SunoTransportError("Suno returned a non-success HTTP status.", res.status, text);
    }

    const json = parseJsonResponse(text);
    const envelope = apiEnvelopeSchema.parse(json);

    if (envelope.code !== 200) {
      throw new SunoRequestError(
        "Suno could not load this task.",
        envelope.code,
        envelope.msg,
      );
    }

    return generationDetailsSchema.parse(envelope.data);
  }
}
