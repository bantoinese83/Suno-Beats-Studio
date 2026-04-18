"use client";

import { SUNO_MODELS, type SunoModel } from "@/lib/suno/models";

interface ModelSelectorProps {
  value: SunoModel;
  onChange: (value: SunoModel) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Engine Model
      </label>
      <select
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/10"
        value={value}
        onChange={(e) => onChange(e.target.value as SunoModel)}
      >
        {SUNO_MODELS.map((option) => (
          <option key={option} value={option} className="bg-zinc-900">
            {option.replace(/_/g, ".")}
          </option>
        ))}
      </select>
    </div>
  );
}
