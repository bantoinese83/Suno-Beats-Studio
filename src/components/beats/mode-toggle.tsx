"use client";

import type { GenerationMode } from "@/lib/types";

interface ModeToggleProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 rounded-full bg-black/30 p-1 text-xs font-medium text-zinc-300">
      <button
        type="button"
        className={`flex-1 rounded-full px-3 py-2 transition ${
          mode === "quick"
            ? "bg-white text-zinc-900 shadow"
            : "hover:text-white"
        }`}
        onClick={() => onChange("quick")}
      >
        Quick idea
      </button>
      <button
        type="button"
        className={`flex-1 rounded-full px-3 py-2 transition ${
          mode === "custom"
            ? "bg-white text-zinc-900 shadow"
            : "hover:text-white"
        }`}
        onClick={() => onChange("custom")}
      >
        Custom control
      </button>
    </div>
  );
}
