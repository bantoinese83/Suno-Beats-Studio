import { z } from "zod";

import type { SunoMusicCallbackPayload } from "./callback-payload.schema";
import { sunoRawCallbackTrackSchema } from "./callback-payload.schema";

export const sunoCallbackTrackSchema = z.object({
  id: z.string(),
  audioUrl: z.string().optional(),
  sourceAudioUrl: z.string().optional(),
  streamAudioUrl: z.string().optional(),
  sourceStreamAudioUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  sourceImageUrl: z.string().optional(),
  prompt: z.string().optional(),
  modelName: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  createTime: z.string().optional(),
  duration: z.number().optional(),
});

export type SunoCallbackTrack = z.infer<typeof sunoCallbackTrackSchema>;

export const sunoCallbackRecordSchema = z.object({
  receivedAtIso: z.string(),
  code: z.number(),
  msg: z.string(),
  callbackType: z.enum(["text", "first", "complete", "error"]),
  taskId: z.string(),
  tracks: z.array(sunoCallbackTrackSchema).nullable(),
});

export type SunoCallbackRecord = z.infer<typeof sunoCallbackRecordSchema>;

function normalizeTrack(
  raw: z.infer<typeof sunoRawCallbackTrackSchema>,
): SunoCallbackTrack | null {
  if (!raw.id) {
    return null;
  }

  return {
    id: raw.id,
    audioUrl: raw.audio_url,
    sourceAudioUrl: raw.source_audio_url,
    streamAudioUrl: raw.stream_audio_url,
    sourceStreamAudioUrl: raw.source_stream_audio_url,
    imageUrl: raw.image_url,
    sourceImageUrl: raw.source_image_url,
    prompt: raw.prompt,
    modelName: raw.model_name,
    title: raw.title,
    tags: raw.tags,
    createTime: raw.createTime,
    duration: raw.duration,
  };
}

export function toSunoCallbackRecord(
  payload: SunoMusicCallbackPayload,
  receivedAt: Date,
): SunoCallbackRecord {
  const rawTracks = payload.data.data ?? null;
  const normalized =
    rawTracks?.map(normalizeTrack).filter((track) => track !== null) ?? [];

  return {
    receivedAtIso: receivedAt.toISOString(),
    code: payload.code,
    msg: payload.msg,
    callbackType: payload.data.callbackType,
    taskId: payload.data.task_id,
    tracks: normalized.length > 0 ? normalized : null,
  };
}
