import type { SunoModel } from "./models";

export type QuickBeatInput = {
  prompt: string;
  model?: SunoModel | undefined;
};

export type CustomInstrumentalBeatInput = {
  style: string;
  title: string;
  model?: SunoModel | undefined;
};

export type GenerateMusicRequestBody =
  | {
      customMode: false;
      instrumental: true;
      model: SunoModel;
      callBackUrl: string;
      prompt: string;
    }
  | {
      customMode: true;
      instrumental: true;
      model: SunoModel;
      callBackUrl: string;
      style: string;
      title: string;
    };

const DEFAULT_MODEL: SunoModel = "V4_5ALL";

export function buildQuickInstrumentalPayload(
  input: QuickBeatInput,
  callbackUrl: string,
): GenerateMusicRequestBody {
  return {
    customMode: false,
    instrumental: true,
    model: input.model ?? DEFAULT_MODEL,
    callBackUrl: callbackUrl,
    prompt: input.prompt,
  };
}

export function buildCustomInstrumentalPayload(
  input: CustomInstrumentalBeatInput,
  callbackUrl: string,
): GenerateMusicRequestBody {
  return {
    customMode: true,
    instrumental: true,
    model: input.model ?? DEFAULT_MODEL,
    callBackUrl: callbackUrl,
    style: input.style,
    title: input.title,
  };
}
