"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { BeatBlueprint } from "@/lib/db/repository";

export function BeatLibrary() {
  const [history, setHistory] = useState<BeatBlueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const res = await fetch("/api/beats/library");
        const data = await res.json();
        if (data.history) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to load library", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLibrary();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-12">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Architectural Archive
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 w-64 shrink-0 animate-pulse rounded-2xl bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="space-y-4 pt-12 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Architectural Archive
        </h2>
        <span className="text-[10px] text-muted-foreground/50">
          {history.length} Blueprints
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {history.map((beat) => (
          <Link
            key={beat.taskId}
            href={`/beats/${beat.taskId}`}
            className="group block w-64 shrink-0 space-y-3 rounded-2xl border border-border bg-white/[0.03] p-4 transition hover:bg-white/[0.07] hover:ring-1 hover:ring-white/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-muted-foreground/60">
                {beat.taskId.substring(0, 8)}
              </p>
              {beat.isFavorite && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </div>

            <div className="space-y-1">
              <p className="line-clamp-2 text-xs font-medium text-white group-hover:text-primary transition">
                {beat.title || beat.prompt}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {formatDistanceToNow(new Date(beat.createdAt))} ago
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                {beat.mode}
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                {beat.model}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
