import { z } from "zod";

import { sunoModelSchema } from "../models";

export const submitBeatRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("quick"),
    prompt: z.string().min(1).max(500),
    model: sunoModelSchema.optional(),
  }),
  z.object({
    mode: z.literal("custom"),
    style: z.string().min(1).max(1000),
    title: z.string().min(1).max(100),
    model: sunoModelSchema.optional(),
  }),
]);

export type SubmitBeatRequest = z.infer<typeof submitBeatRequestSchema>;
