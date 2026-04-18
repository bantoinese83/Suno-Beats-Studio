"use client";

import { TrackItem } from "./track-item";

export interface DisplayTrack {
  id: string;
  title?: string;
  duration?: number;
  streamAudioUrl?: string;
  audioUrl?: string;
  source: "webhook" | "poll";
}

interface TrackListProps {
  tracks: DisplayTrack[];
  loading?: boolean;
}

export function TrackList({ tracks, loading }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
        <p className="text-sm text-zinc-500">
          {loading ? "Warming up the engines..." : "Stems will appear here when ready."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tracks.map((track) => (
        <TrackItem key={track.id} {...track} />
      ))}
    </ul>
  );
}
