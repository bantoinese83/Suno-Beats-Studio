"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TrackItemProps {
  id: string;
  title?: string;
  duration?: number;
  streamAudioUrl?: string;
  audioUrl?: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TrackItem({
  title,
  duration,
  streamAudioUrl,
  audioUrl,
}: TrackItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const toggleFavorite = async () => {
    try {
      const res = await fetch("/api/beats/favorite", {
        method: "POST",
        body: JSON.stringify({ taskId: id }),
      });
      const data = await res.json();
      setIsFavorite(!!data.isFavorite);
    } catch {
      console.error("Favorite failed");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    const newTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleMetadata = () => setTrackDuration(audio.duration);
    const handleTimeUpdate = () => {
      if (isSeeking) return;
      setCurrentTime(audio.currentTime);
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isSeeking]);

  return (
    <li className={`group relative rounded-xl border transition-all duration-500 ${isPlaying ? 'border-white/20 bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-border bg-white/[0.03] hover:bg-white/[0.05]'}`}>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3 mb-1">
                  <div className="w-0.5 bg-primary animate-[music-bar_0.8s_ease-in-out_infinite]" style={{ height: '40%' }} />
                  <div className="w-0.5 bg-primary animate-[music-bar_1.2s_ease-in-out_infinite]" style={{ height: '80%' }} />
                  <div className="w-0.5 bg-primary animate-[music-bar_0.9s_ease-in-out_infinite]" style={{ height: '60%' }} />
                </div>
              )}
              <p className="text-sm font-semibold text-white truncate">
                {title || "Untitled architectural sketch"}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              {duration ? `${Math.round(duration)}s output` : "Analyzing structure..."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={toggleFavorite}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${isFavorite ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-white'}`}
            >
              <svg 
                className={`h-4 w-4 ${isFavorite ? 'fill-current' : 'fill-none'}`} 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {streamAudioUrl && (
              <>
                <audio ref={audioRef} src={streamAudioUrl} preload="metadata" />
                <button
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="h-3 w-1.5 bg-black" />
                      <div className="h-3 w-1.5 bg-black" />
                    </div>
                  ) : (
                    <svg className="ml-0.5 h-4 w-4 fill-black" viewBox="0 0 24 24">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  )}
                </button>
              </>
            )}
            
            {audioUrl && (
              <a
                href={audioUrl}
                download
                className="flex h-10 items-center rounded-full border border-white/10 px-5 text-[11px] font-bold text-white transition hover:bg-white/5 active:scale-95"
              >
                Download
              </a>
            )}
          </div>
        </div>

        {streamAudioUrl && (
          <div className="space-y-2">
            <div 
              ref={progressBarRef}
              onClick={handleSeek}
              className="relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/5 transition-colors hover:bg-white/10"
            >
              <div 
                className="absolute inset-y-0 left-0 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-100" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(trackDuration || duration || 0)}</span>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
