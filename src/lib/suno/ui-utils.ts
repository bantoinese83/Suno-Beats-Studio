import type { GenerationDetails, GenerationStatus } from "./schemas";
import type { SunoCallbackRecord } from "./webhook/callback-record";

export function getStatusLabel(status: GenerationStatus): string {
  switch (status) {
    case "PENDING":
      return "Queued";
    case "TEXT_SUCCESS":
      return "Sketch ready";
    case "FIRST_SUCCESS":
      return "First take ready";
    case "SUCCESS":
      return "Finished";
    case "CREATE_TASK_FAILED":
      return "Could not start";
    case "GENERATE_AUDIO_FAILED":
      return "Playback failed";
    case "CALLBACK_EXCEPTION":
      return "Delivery hiccup";
    case "SENSITIVE_WORD_ERROR":
      return "Needs a softer prompt";
    default:
      return "Unknown status";
  }
}

export function getSessionStatusLabel(
  details: GenerationDetails | null,
  callbackRecord: SunoCallbackRecord | null
): string {
  if (callbackRecord?.callbackType === "error") {
    return "Needs attention";
  }

  if (callbackRecord != null && callbackRecord.code !== 200) {
    return "Needs attention";
  }

  if (callbackRecord?.callbackType === "complete") {
    return "Finished";
  }

  if (callbackRecord?.callbackType === "first") {
    return "First take ready";
  }

  if (callbackRecord?.callbackType === "text") {
    return "Sketch ready";
  }

  if (details) {
    return getStatusLabel(details.status);
  }

  return "Listening for updates";
}

export type DisplayTrack = {
  id: string;
  title?: string;
  duration?: number;
  streamAudioUrl?: string;
  audioUrl?: string;
  source: "webhook" | "poll";
};

export function buildDisplayTracks(
  details: GenerationDetails | null,
  callbackRecord: SunoCallbackRecord | null
): DisplayTrack[] {
  const pollTracks = details?.response?.sunoData ?? [];
  const webhookTracks = callbackRecord?.tracks ?? [];

  const preferWebhook =
    webhookTracks.length > 0 &&
    (callbackRecord?.callbackType === "complete" ||
      pollTracks.length === 0 ||
      webhookTracks.length >= pollTracks.length);

  if (preferWebhook) {
    return webhookTracks.map((track) => ({
      id: track.id,
      title: track.title,
      duration: track.duration,
      streamAudioUrl: track.streamAudioUrl,
      audioUrl: track.audioUrl,
      source: "webhook",
    }));
  }

  return pollTracks.map((track) => ({
    id: track.id,
    title: track.title,
    duration: track.duration,
    streamAudioUrl: track.streamAudioUrl,
    audioUrl: track.audioUrl,
    source: "poll",
  }));
}
