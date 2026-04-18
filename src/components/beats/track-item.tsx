"use client";

import { useState, useRef, useEffect } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <li className="group relative rounded-xl border border-border bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05]">
      {/* Progress Bar Background */}
      {isPlaying && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl bg-white/5">
          <div 
            className="h-full bg-white/40 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="flex gap-0.5">
                <span className="h-2 w-0.5 animate-bounce bg-white/60" style={{ animationDelay: '0s' }} />
                <span className="h-3 w-0.5 animate-bounce bg-white/80" style={{ animationDelay: '0.1s' }} />
                <span className="h-2 w-0.5 animate-bounce bg-white/60" style={{ animationDelay: '0.2s' }} />
              </span>
            )}
            <p className="text-sm font-medium text-white break-words">
              {title || "Untitled sketch"}
            </p>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-widest">
            {duration ? `${Math.round(duration)}s architecture` : "Architecture pending"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {streamAudioUrl && (
            <div className="flex items-center gap-2">
              <audio ref={audioRef} src={streamAudioUrl} preload="none" />
              <button
                onClick={togglePlay}
                className="group/btn flex h-9 items-center gap-2 rounded-full border border-border bg-white/5 px-4 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                {isPlaying ? (
                  <>
                    <div className="flex h-1.5 w-1.5 gap-0.5">
                      <div className="h-full w-full bg-white" />
                      <div className="h-full w-full bg-white" />
                    </div>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="ml-0.5 h-2.5 w-2.5 fill-white" viewBox="0 0 24 24">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {audioUrl && (
            <a
              href={audioUrl}
              download
              className="flex h-9 items-center rounded-full bg-white px-5 text-[11px] font-bold text-black transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
