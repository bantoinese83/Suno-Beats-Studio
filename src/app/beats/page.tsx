import Link from "next/link";
import { BeatGeneratorForm } from "@/components/beats/beat-generator-form";
import { BeatLibrary } from "@/components/beats/beat-library";

export default function BeatsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-white/10">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 transition hover:text-white"
          >
            <span className="text-white transition-transform group-hover:-translate-x-1">←</span>
            Suno Beats
          </Link>
          <div className="flex items-center gap-4">
            <span className="h-4 w-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">Pure Instrumental</span>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 py-16 sm:px-6 lg:py-24">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 h-[500px] w-full max-w-4xl -translate-x-1/2 bg-white/[0.02] blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl space-y-12 animate-in">
          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
              Sculpt your <span className="font-serif italic">soundscape.</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
              Select an engine, define your texture, and let the generation unfold. 
              Our workflow keeps vocals silent, focusing entirely on rhythm, atmosphere, and melody.
            </p>
          </div>

          <BeatGeneratorForm />
          <BeatLibrary />
        </div>
      </main>

      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-700">
          <p>© 2026 Suno Beats Studio</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-zinc-400 transition">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
