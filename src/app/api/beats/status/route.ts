import { z } from "zod";

import {
  SunoConfigError,
  SunoRequestError,
  SunoTransportError,
} from "@/lib/suno/errors";
import { getSunoEnv } from "@/lib/suno/env";
import { createBeatGenerationService } from "@/lib/suno/beat-service";
import { jsonResponse } from "@/lib/suno/http/json-response";

const querySchema = z.object({
  taskId: z.string().min(1),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    taskId: url.searchParams.get("taskId") ?? "",
  });

  if (!parsed.success) {
    return jsonResponse({ error: "Add a task reference." }, { status: 400 });
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
    const details = await service.getGenerationStatus(parsed.data.taskId);
    return jsonResponse({ details });
  } catch (error) {
    if (error instanceof SunoRequestError) {
      return jsonResponse(
        {
          error: "The music service could not load this task.",
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
