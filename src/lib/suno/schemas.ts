import { z } from "zod";

export const apiEnvelopeSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.unknown().optional(),
});

export type ApiEnvelope = z.infer<typeof apiEnvelopeSchema>;

export const generateMusicResponseSchema = z.object({
  taskId: z.string(),
});

export type GenerateMusicResponse = z.infer<typeof generateMusicResponseSchema>;

const sunoTrackSchema = z.object({
  id: z.string(),
  audioUrl: z.string().optional(),
  streamAudioUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  prompt: z.string().optional(),
  modelName: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  createTime: z.union([z.string(), z.number()]).optional(),
  duration: z.number().nullable().optional(),
});

export const generationStatusSchema = z.enum([
  "PENDING",
  "TEXT_SUCCESS",
  "FIRST_SUCCESS",
  "SUCCESS",
  "CREATE_TASK_FAILED",
  "GENERATE_AUDIO_FAILED",
  "CALLBACK_EXCEPTION",
  "SENSITIVE_WORD_ERROR",
]);

export type GenerationStatus = z.infer<typeof generationStatusSchema>;

export const generationDetailsSchema = z.object({
  taskId: z.string(),
  parentMusicId: z.string().optional(),
  param: z.string().optional(),
  response: z
    .object({
      taskId: z.string().optional(),
      sunoData: z.array(sunoTrackSchema).optional(),
    })
    .nullable()
    .optional(),
  status: generationStatusSchema,
  type: z.string().optional(),
  operationType: z.string().optional(),
  errorCode: z.number().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
});

export type GenerationDetails = z.infer<typeof generationDetailsSchema>;

export const TERMINAL_GENERATION_STATUSES: readonly GenerationStatus[] = [
  "SUCCESS",
  "CREATE_TASK_FAILED",
  "GENERATE_AUDIO_FAILED",
  "CALLBACK_EXCEPTION",
  "SENSITIVE_WORD_ERROR",
] as const;

export function isTerminalGenerationStatus(
  status: GenerationStatus,
): boolean {
  return (TERMINAL_GENERATION_STATUSES as readonly string[]).includes(status);
}
