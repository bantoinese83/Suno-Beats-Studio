"use client";

import { useEffect, useState } from "react";
import type { GenerationStatus } from "@/lib/suno/schemas";

const LOGS_MAP: Record<string, string[]> = {
  START: [
    "Initializing neural architecture...",
    "Calibrating tonal oscillators...",
    "Analyzing prompt semantics...",
  ],
  PENDING: [
    "Mapping harmonic blueprints...",
    "Generating spectral sketches...",
    "Optimizing audio buffers...",
    "Synthesizing texture layers...",
  ],
  TEXT_SUCCESS: [
    "Compiling wavetable data...",
    "Applying dynamic mastering...",
    "Finalizing stem orchestration...",
  ],
  SUCCESS: ["Architecture stable.", "Rendering complete."],
};

export function useOrchestrationLogs(
  status: GenerationStatus | "START" | null,
) {
  const [currentLog, setCurrentLog] = useState<string>("");
  const [, setLogIndex] = useState(0);
  const [prevStatus, setPrevStatus] = useState(status);

  if (status !== prevStatus) {
    setPrevStatus(status);
    if (!status) {
      setCurrentLog("");
      setLogIndex(0);
    } else {
      const logs = LOGS_MAP[status] || LOGS_MAP.PENDING || [];
      setCurrentLog(logs[0] || "");
      setLogIndex(0);
    }
  }

  useEffect(() => {
    if (!status) return;

    const logs = LOGS_MAP[status] || LOGS_MAP.PENDING || [];
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        const next = prev + 1;
        if (next < logs.length) {
          setCurrentLog(logs[next] || "");
          return next;
        }
        return prev;
      });
    }, 4500); // Change log every 4.5 seconds to keep it slow and premium

    return () => clearInterval(interval);
  }, [status]);

  return currentLog;
}
