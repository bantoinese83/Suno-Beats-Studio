import { z } from "zod";

export const runtime = "nodejs";

import { jsonResponse } from "@/lib/suno/http/json-response";
import { createSunoCallbackStore } from "@/lib/suno/webhook/create-callback-store";
import { assertCanReadCallbackState } from "@/lib/suno/webhook/verify-webhook";

const querySchema = z.object({
  taskId: z.string().min(1),
});

export async function GET(request: Request) {
  if (!assertCanReadCallbackState(request)) {
    return jsonResponse({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    taskId: url.searchParams.get("taskId") ?? "",
  });

  if (!parsed.success) {
    return jsonResponse({ error: "Add a task reference." }, { status: 400 });
  }

  const store = createSunoCallbackStore();
  const record = await store.getLatest(parsed.data.taskId);

  return jsonResponse({ record });
}
