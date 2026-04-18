import { z } from "zod";

export const runtime = "edge";

import {
  SunoConfigError,
  SunoRequestError,
  SunoTransportError,
} from "@/lib/suno/errors";
import { getSunoEnv } from "@/lib/suno/env";
import { submitBeatRequestSchema } from "@/lib/suno/api/beat-request-schema";
import {
  createBeatGenerationService,
  submitBeatForRequest,
} from "@/lib/suno/beat-service";
import { jsonResponse } from "@/lib/suno/http/json-response";
import { beatRepository } from "@/lib/db/repository";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = submitBeatRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonResponse(
      { error: "Check your fields and try again." },
      { status: 400 },
    );
  }

  let env;

  try {
    env = getSunoEnv();
  } catch (error) {
    if (error instanceof SunoConfigError) {
      return jsonResponse(
        { error: "This studio is not fully set up yet. Try again soon." },
        { status: 503 },
      );
    }
    throw error;
  }

  const service = createBeatGenerationService(env);

  try {
    const result = await submitBeatForRequest(service, parsed.data);

    // Persist the blueprint
    await beatRepository.saveBlueprint({
      taskId: result.taskId,
      prompt:
        parsed.data.mode === "quick" ? parsed.data.prompt : parsed.data.style,
      mode: parsed.data.mode,
      model: parsed.data.model || "V4_5ALL",
      title: parsed.data.mode === "custom" ? parsed.data.title : undefined,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    });

    return jsonResponse({ taskId: result.taskId });
  } catch (error) {
    if (error instanceof SunoRequestError) {
      return jsonResponse(
        {
          error: "The music service declined this request.",
          code: error.apiCode,
        },
        { status: 502 },
      );
    }

    if (error instanceof SunoTransportError) {
      return jsonResponse(
        { error: "We could not reach the music service." },
        { status: 502 },
      );
    }

    if (error instanceof z.ZodError) {
      return jsonResponse(
        { error: "The music service sent an unexpected response." },
        { status: 502 },
      );
    }

    throw error;
  }
}
