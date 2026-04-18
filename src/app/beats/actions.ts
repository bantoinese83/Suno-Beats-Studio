"use server";

import { z } from "zod";

import type { SunoCallbackRecord } from "@/lib/suno/webhook/callback-record";
import { createSunoCallbackStore } from "@/lib/suno/webhook/create-callback-store";

const taskIdSchema = z.string().min(1).max(200);

export type FetchLatestBeatCallbackResult =
  | { ok: true; record: SunoCallbackRecord | null }
  | { ok: false; error: string };

/**
 * Reads the latest webhook snapshot for a generation task without exposing
 * SUNO_WEBHOOK_SECRET to the browser.
 */
export async function fetchLatestBeatCallback(
  taskId: string,
): Promise<FetchLatestBeatCallbackResult> {
  const parsed = taskIdSchema.safeParse(taskId);

  if (!parsed.success) {
    return { ok: false, error: "That session reference looks off." };
  }

  const store = createSunoCallbackStore();
  const record = await store.getLatest(parsed.data);
  return { ok: true, record };
}
