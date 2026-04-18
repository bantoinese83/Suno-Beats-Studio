import { beatRepository } from "@/lib/db/repository";
import { jsonResponse } from "@/lib/suno/http/json-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const history = await beatRepository.getHistory();
    return jsonResponse({ history });
  } catch (error) {
    console.error("[API/Library] Failed to fetch history:", error);
    return jsonResponse({ error: "Could not fetch your library." }, { status: 500 });
  }
}
