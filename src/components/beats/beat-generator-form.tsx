"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useBeatStatus } from "@/hooks/use-beat-status";
import { buildDisplayTracks, getSessionStatusLabel } from "@/lib/suno/ui-utils";
import { ModeToggle } from "./mode-toggle";
import { ModelSelector } from "./model-selector";
import { TrackList } from "./track-list";
import type { SunoModel } from "@/lib/suno/models";
import type { GenerationMode } from "@/lib/types";

type GenerateResponse = { taskId: string } | { error: string; code?: number };

export function BeatGeneratorForm() {
  const [mode, setMode] = useState<GenerationMode>("quick");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [title, setTitle] = useState("");
  const [model, setModel] = useState<SunoModel>("V4_5ALL");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { details, callbackRecord, error: pollError } = useBeatStatus(taskId);

  const displayTracks = useMemo(
    () => buildDisplayTracks(details, callbackRecord),
    [details, callbackRecord]
  );

  const sessionLabel = getSessionStatusLabel(details, callbackRecord);
  const hasWebhookLinks = displayTracks.some((t) => t.source === "webhook");
  const formError = localError || pollError;

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    setTaskId(null);

    const body =
      mode === "quick"
        ? { mode: "quick", prompt, model }
        : { mode: "custom", style, title, model };

    try {
      const res = await fetch("/api/beats/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = (await res.json()) as GenerateResponse;

      if (!res.ok || "error" in payload) {
        setLocalError("error" in payload ? payload.error : "Submission failed.");
        return;
      }

      setTaskId(payload.taskId);
    } catch {
      setLocalError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 shadow-2xl backdrop-blur-xl">
      <form className="space-y-8" onSubmit={handleGenerate}>
        <ModeToggle mode={mode} onChange={setMode} />
        
        <ModelSelector value={model} onChange={setModel} />

        <div className="space-y-6">
          {mode === "quick" ? (
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Aural Vision
              </label>
              <textarea
                id="prompt"
                required
                maxLength={500}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Soulful keys, 90bpm, lofi texture..."
                className="min-h-[140px] w-full resize-none rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:ring-1 focus:ring-white/10"
              />
              <div className="flex justify-end">
                <span className="text-[10px] font-mono text-zinc-600">{prompt.length}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="style" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Genre & Texture
                </label>
                <textarea
                  id="style"
                  required
                  maxLength={1000}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Techno, industrial drums, sharp synths..."
                  className="min-h-[100px] w-full resize-none rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:ring-1 focus:ring-white/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Composition Title
                </label>
                <input
                  id="title"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-white outline-none transition focus:border-white/20 focus:ring-1 focus:ring-white/10"
                />
              </div>
            </div>
          )}
        </div>

        {formError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-full bg-white py-4 text-sm font-bold text-black transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? "Orchestrating..." : "Launch Generation"}
          </span>
        </button>
      </form>

      {taskId && (
        <div className="mt-12 space-y-6 border-t border-white/5 pt-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">active session</p>
              <p className="font-mono text-[10px] text-zinc-400 opacity-50">{taskId}</p>
            </div>
            <div className="rounded-full bg-zinc-800/50 px-4 py-1.5 text-[11px] font-medium text-white ring-1 ring-white/10">
              {sessionLabel}
            </div>
          </div>

          {callbackRecord?.code !== 200 && callbackRecord?.msg && (
            <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-200/80">
              {callbackRecord.msg}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">Generated Stems</h3>
              {hasWebhookLinks && (
                <span className="text-[10px] text-emerald-400/70">Verified via Webhook</span>
              )}
            </div>
            <TrackList tracks={displayTracks} loading={displayTracks.length === 0} />
          </div>
        </div>
      )}
    </div>
  );
}
