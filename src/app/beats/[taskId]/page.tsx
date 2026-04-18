import { notFound } from "next/navigation";
import { Metadata } from "next";
import { beatRepository } from "@/lib/db/repository";
import { BeatGeneratorForm } from "@/components/beats/beat-generator-form";
import { getSunoEnv } from "@/lib/suno/env";
import { createBeatGenerationService } from "@/lib/suno/beat-service";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { taskId } = await params;
  const blueprint = await beatRepository.getBlueprint(taskId);

  if (!blueprint) return { title: "Beat Not Found | Suno Beats Studio" };

  return {
    title: `${blueprint.title || "New Beat"} | Suno Beats Studio`,
    description: `Listen to this architectural sound sketch: ${blueprint.prompt.substring(0, 100)}...`,
  };
}

export default async function SharedBeatPage({ params }: PageProps) {
  const { taskId } = await params;
  const blueprint = await beatRepository.getBlueprint(taskId);

  if (!blueprint) {
    notFound();
  }

  // Pre-load the status to see if it exists
  const env = getSunoEnv();
  const service = createBeatGenerationService(env);

  try {
    await service.getGenerationStatus(taskId);
  } catch {
    console.warn("[SharedPage] Could not pre-fetch status for", taskId);
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary ring-1 ring-primary/20">
            Shared Blueprint
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {blueprint.title || "Sound Sketch"}
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground/80 sm:text-lg">
            This architectural musical blueprint was generated in the Suno Beats
            Studio.
          </p>
        </header>

        {/* We can reuse the BeatGeneratorForm but pass it initial state if we want, 
            or just show a special "Result" view. For now, we'll let it auto-poll by 
            passing the taskId to a specialized viewer or just the form.
        */}
        <div className="mx-auto max-w-2xl">
          {/* In this version, we will actually just redirect or show the form with the ID active. 
               Since BeatGeneratorForm stores taskId in state, we should probably 
               modify it to accept an initialTaskId prop.
           */}
          <BeatGeneratorForm initialTaskId={taskId} />
        </div>
      </div>
    </main>
  );
}
