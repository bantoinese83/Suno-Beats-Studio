import { z } from "zod";

export const SUNO_MODELS = [
  "V4",
  "V4_5",
  "V4_5PLUS",
  "V4_5ALL",
  "V5",
  "V5_5",
] as const;

export const sunoModelSchema = z.enum(SUNO_MODELS);

export type SunoModel = z.infer<typeof sunoModelSchema>;
