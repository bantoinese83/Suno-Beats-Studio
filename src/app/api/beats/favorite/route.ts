import { z } from "zod";
import { beatRepository } from "@/lib/db/repository";
import { jsonResponse } from "@/lib/suno/http/json-response";

const bodySchema = z.object({
  taskId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { taskId } = bodySchema.parse(body);

    const isFavorite = await beatRepository.toggleFavorite(taskId);
    return jsonResponse({ taskId, isFavorite });
  } catch {
    return jsonResponse(
      { error: "Failed to toggle favorite." },
      { status: 400 },
    );
  }
}
