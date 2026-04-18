import { jsonResponse } from "@/lib/suno/http/json-response";
import { sunoMusicCallbackPayloadSchema } from "@/lib/suno/webhook/callback-payload.schema";
import { toSunoCallbackRecord } from "@/lib/suno/webhook/callback-record";
import { createSunoCallbackStore } from "@/lib/suno/webhook/create-callback-store";
import { isWebhookAuthorized } from "@/lib/suno/webhook/verify-webhook";

export async function POST(request: Request) {
  if (!isWebhookAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Expected JSON." }, { status: 400 });
  }

  const parsed = sunoMusicCallbackPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse({ error: "Unexpected payload shape." }, { status: 400 });
  }

  const store = createSunoCallbackStore();
  const record = toSunoCallbackRecord(parsed.data, new Date());

  await store.saveRecord(record);

  return jsonResponse({ ok: true as const }, { status: 200 });
}
