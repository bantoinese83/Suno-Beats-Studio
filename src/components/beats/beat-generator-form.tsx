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
  const [prompt, setPrompt] = useState("Dark, melancholic piano loop in G MAJOR E MINOR layered with vintage soul samples and atmospheric synth pads. Keys and subtle synth textures create a moody backdrop. Occasional, sparse drum fills and processed vocal stabs add texture. No full drums");
  const [style, setStyle] = useState("Dark, melancholic piano loop in G MAJOR E MINOR layered with vintage soul samples and atmospheric synth pads. Keys and subtle synth textures create a moody backdrop. Occasional, sparse drum fills and processed vocal stabs add texture. No full drums");
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
    <div className="rounded-3xl border border-border bg-gradient-to-br from-white/[0.08] to-transparent p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <form className="space-y-8" onSubmit={handleGenerate}>
        <ModeToggle mode={mode} onChange={setMode} />
        
        <ModelSelector value={model} onChange={setModel} />

        <div className="space-y-6">
          {mode === "quick" ? (
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Aural Vision
              </label>
              <textarea
                id="prompt"
                required
                maxLength={500}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Soulful keys, 90bpm, lofi texture..."
                className="min-h-[140px] w-full resize-none rounded-2xl border border-input bg-black/40 p-4 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-ring focus:ring-1 focus:ring-ring"
              />
              <div className="flex justify-end pt-1">
                <span className="text-[10px] font-mono text-muted/60">{prompt.length}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="style" className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Genre & Texture
                </label>
                <textarea
                  id="style"
                  required
                  maxLength={1000}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Techno, industrial drums, sharp synths..."
                  className="min-h-[100px] w-full resize-none rounded-2xl border border-input bg-black/40 p-4 text-sm text-foreground outline-none transition placeholder:text-muted/50 focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Composition Title
                </label>
                <input
                  id="title"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-black/40 p-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        {formError && (
          <div className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error/80">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin text-primary-foreground" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Orchestrating...</span>
              </>
            ) : (
              "Launch Generation"
            )}
          </span>
        </button>
      </form>

      {taskId && (
        <div className="mt-12 space-y-6 border-t border-border pt-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">active session</p>
              <p className="font-mono text-[10px] text-muted/50">{taskId}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 py-1.5 px-4 ring-1 ring-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-foreground">
                {sessionLabel}
              </span>
            </div>
          </div>

          {callbackRecord?.code !== 200 && callbackRecord?.msg && (
            <div className="rounded-xl bg-warning/10 p-3 text-xs text-warning/80">
              {callbackRecord.msg}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Generated Stems</h3>
              {hasWebhookLinks && (
                <span className="text-[10px] text-success/70">Verified via Webhook</span>
              )}
            </div>
            <TrackList tracks={displayTracks} loading={displayTracks.length === 0} />
          </div>
        </div>
      )}
    </div>
  );
}
