import { Redis } from "@upstash/redis";
import { z } from "zod";

// Schema for a persisted "BeatBlueprint"
export const beatBlueprintSchema = z.object({
  taskId: z.string(),
  prompt: z.string(),
  mode: z.enum(["quick", "custom"]),
  model: z.string(),
  title: z.string().optional(),
  createdAt: z.string(),
  isFavorite: z.boolean().default(false),
});

export type BeatBlueprint = z.infer<typeof beatBlueprintSchema>;

class BeatRepository {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  /**
   * Saves a new generation to persistent history
   */
  async saveBlueprint(blueprint: BeatBlueprint): Promise<void> {
    const key = `beat:blueprint:${blueprint.taskId}`;
    const historyKey = `user:beats:history`;

    // Store the blueprint details
    await this.redis.set(key, JSON.stringify(blueprint));

    // Add to history list (unique)
    await this.redis.lrem(historyKey, 0, blueprint.taskId);
    await this.redis.lpush(historyKey, blueprint.taskId);

    // Keep only the last 50 for now to prevent bloating, though Redis lists are cheap
    await this.redis.ltrim(historyKey, 0, 49);
  }

  /**
   * Retrieves a specific blueprint
   */
  async getBlueprint(taskId: string): Promise<BeatBlueprint | null> {
    const data = await this.redis.get<BeatBlueprint>(
      `beat:blueprint:${taskId}`,
    );
    return data || null;
  }

  /**
   * Toggles the favorite status of a beat
   */
  async toggleFavorite(taskId: string): Promise<boolean> {
    const key = `beat:blueprint:${taskId}`;
    const blueprint = await this.getBlueprint(taskId);

    if (!blueprint) return false;

    const updated = { ...blueprint, isFavorite: !blueprint.isFavorite };
    await this.redis.set(key, JSON.stringify(updated));

    // If favorited, add to a special set
    if (updated.isFavorite) {
      await this.redis.sadd(`user:beats:favorites`, taskId);
    } else {
      await this.redis.srem(`user:beats:favorites`, taskId);
    }

    return updated.isFavorite;
  }

  /**
   * Returns the full history of beats
   */
  async getHistory(): Promise<BeatBlueprint[]> {
    const historyKey = `user:beats:history`;
    const taskIds = await this.redis.lrange<string>(historyKey, 0, -1);

    if (!taskIds.length) return [];

    const pipeline = this.redis.pipeline();
    taskIds.forEach((id) => pipeline.get(`beat:blueprint:${id}`));

    const results = await pipeline.exec<BeatBlueprint[]>();
    return results.filter(Boolean);
  }
}

export const beatRepository = new BeatRepository();
