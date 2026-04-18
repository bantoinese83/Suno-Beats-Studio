import { useEffect, useState } from "react";
import { fetchLatestBeatCallback } from "@/app/beats/actions";
import type { GenerationDetails } from "@/lib/suno/schemas";
import { isTerminalGenerationStatus } from "@/lib/suno/schemas";
import type { SunoCallbackRecord } from "@/lib/suno/webhook/callback-record";

type StatusResponse =
  | { details: GenerationDetails }
  | { error: string; code?: number };

export function useBeatStatus(taskId: string | null) {
  const [details, setDetails] = useState<GenerationDetails | null>(null);
  const [callbackRecord, setCallbackRecord] = useState<SunoCallbackRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [prevTaskId, setPrevTaskId] = useState(taskId);

  // Reset state during render if taskId changes to null
  if (taskId !== prevTaskId) {
    setPrevTaskId(taskId);
    if (!taskId) {
      setDetails(null);
      setCallbackRecord(null);
      setError(null);
    }
  }

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const poll = async () => {
      setIsPolling(true);
      try {
        const [statusResult, callbackResult] = await Promise.all([
          fetch(`/api/beats/status?taskId=${encodeURIComponent(taskId)}`).then(async (res) => {
            const isJson = res.headers.get("content-type")?.includes("application/json");
            const payload = isJson ? (await res.json()) as StatusResponse : { error: "Service temporarily unavailable" };
            return { res, payload };
          }),
          fetchLatestBeatCallback(taskId),
        ]);

        if (cancelled) return;

        const statusOk = statusResult.res.ok && !("error" in statusResult.payload);
        const callbackOk = callbackResult.ok;

        const newDetails: GenerationDetails | null = statusOk
          ? (statusResult.payload as { details: GenerationDetails }).details
          : null;
        const newCallback = callbackOk ? callbackResult.record : null;

        if (statusOk) setDetails(newDetails);
        if (callbackOk) setCallbackRecord(newCallback);

        if (!statusOk && !callbackOk) {
          setError(
            "error" in statusResult.payload
              ? statusResult.payload.error
              : "We could not refresh this session."
          );
        } else {
          setError(null);
        }

        const terminalPoll = newDetails != null && isTerminalGenerationStatus(newDetails.status);
        const terminalWebhook =
          newCallback?.callbackType === "complete" ||
          newCallback?.callbackType === "error" ||
          (newCallback != null && newCallback.code !== 200);

        if ((terminalPoll || terminalWebhook) && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      } catch {
        if (!cancelled) {
          setError("Connection dropped. Still trying...");
        }
      } finally {
        if (!cancelled) setIsPolling(false);
      }
    };

    void poll();
    timer = setInterval(() => {
      void poll();
    }, 4000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [taskId]);

  return { details, callbackRecord, error, isPolling };
}
