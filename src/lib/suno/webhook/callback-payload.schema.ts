import { z } from "zod";

/**
 * Raw track objects use snake_case keys as delivered by Suno callbacks.
 * @see https://docs.sunoapi.org/suno-api/generate-music-callbacks
 */
export const sunoRawCallbackTrackSchema = z.object({
  id: z.string().optional(),
  audio_url: z.string().optional(),
  source_audio_url: z.string().optional(),
  stream_audio_url: z.string().optional(),
  source_stream_audio_url: z.string().optional(),
  image_url: z.string().optional(),
  source_image_url: z.string().optional(),
  prompt: z.string().optional(),
  model_name: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  createTime: z.string().optional(),
  duration: z.number().optional(),
});

export type SunoRawCallbackTrack = z.infer<typeof sunoRawCallbackTrackSchema>;

export const sunoCallbackInnerSchema = z.object({
  callbackType: z.enum(["text", "first", "complete", "error"]),
  task_id: z.string().min(1),
  data: z.array(sunoRawCallbackTrackSchema).nullable().optional(),
});

export const sunoMusicCallbackPayloadSchema = z.object({
  code: z.number().int(),
  msg: z.string(),
  data: sunoCallbackInnerSchema,
});

export type SunoMusicCallbackPayload = z.infer<
  typeof sunoMusicCallbackPayloadSchema
>;
