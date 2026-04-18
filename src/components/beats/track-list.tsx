"use client";

import { TrackItem } from "./track-item";
import { TrackSkeleton } from "./track-skeleton";
import type { DisplayTrack } from "@/lib/suno/ui-utils";

interface TrackListProps {
  tracks: DisplayTrack[];
  loading?: boolean;
}

export function TrackList({ tracks, loading }: TrackListProps) {
  if (tracks.length === 0) {
    if (loading) {
      return (
        <div className="space-y-3">
          <TrackSkeleton />
          <TrackSkeleton />
        </div>
      );
    }

    return (
      <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-dashed border-border text-center">
        <p className="text-sm text-muted">Stems will appear here when ready.</p>
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
