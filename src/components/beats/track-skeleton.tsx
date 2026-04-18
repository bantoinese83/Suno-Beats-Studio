"use client";

export function TrackSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-white/[0.02] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-3 w-1/4 rounded bg-white/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-white/5" />
          <div className="h-8 w-24 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
