import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-white/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-white/5 blur-[120px]" />

      <div className="relative z-10 animate-in flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            Suno Beats · v1.0
          </p>
        </div>

        <h1 className="mt-10 max-w-3xl bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-transparent sm:text-7xl">
          The art of the <br /> 
          <span className="font-serif italic">unspoken</span> rhythm.
        </h1>

        <p className="mt-8 max-w-lg text-base leading-relaxed text-zinc-400/80">
          A minimalist sanctuary for instrumental sketches. Create, iterate, and download custom beats powered by generative intelligence.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
          <Link
            href="/beats"
            className="flex h-12 items-center justify-center rounded-full bg-white px-10 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter the Lab
          </Link>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-zinc-500 hover:text-white transition-colors"
          >
            View Specification →
          </a>
        </div>
      </div>

      {/* Subtle bottom grid */}
      <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
