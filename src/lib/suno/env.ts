import { z } from "zod";

import { SunoConfigError } from "./errors";

const envSchema = z.object({
  SUNO_API_KEY: z.string().min(1),
  SUNO_CALLBACK_URL: z.url(),
  SUNO_API_BASE_URL: z.url().optional(),
});

export type SunoEnv = z.infer<typeof envSchema>;

export const DEFAULT_SUNO_BASE_URL = "https://api.sunoapi.org";

export function getSunoEnv(): SunoEnv {
  const parsed = envSchema.safeParse({
    SUNO_API_KEY: process.env.SUNO_API_KEY,
    SUNO_CALLBACK_URL: process.env.SUNO_CALLBACK_URL,
    SUNO_API_BASE_URL: process.env.SUNO_API_BASE_URL,
  });

  if (!parsed.success) {
    throw new SunoConfigError(
      "Add SUNO_API_KEY and SUNO_CALLBACK_URL to your environment.",
    );
  }

  return parsed.data;
}
