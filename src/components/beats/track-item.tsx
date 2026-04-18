"use client";

interface TrackItemProps {
  id: string;
  title?: string;
  duration?: number;
  streamAudioUrl?: string;
  audioUrl?: string;
}

export function TrackItem({
  title,
  duration,
  streamAudioUrl,
  audioUrl,
}: TrackItemProps) {
  return (
    <li className="group rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            {title || "Untitled sketch"}
          </p>
          <p className="text-xs text-zinc-500">
            {duration ? `${Math.round(duration)} seconds` : "Duration pending"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {streamAudioUrl && (
            <a
              href={streamAudioUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              Listen
            </a>
          )}
          {audioUrl && (
            <a
              href={audioUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
