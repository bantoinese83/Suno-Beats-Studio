import { Redis } from "@upstash/redis";

import type { SunoCallbackRecord } from "./callback-record";
import { sunoCallbackRecordSchema } from "./callback-record";
import type { SunoCallbackStore } from "./callback-store";

const TTL_SECONDS = 60 * 60 * 24 * 7;
const LOG_KEEP = 50;

export class RedisSunoCallbackStore implements SunoCallbackStore {
  private readonly redis: Redis;

  constructor(redis?: Redis) {
    this.redis = redis ?? Redis.fromEnv();
  }

  async saveRecord(record: SunoCallbackRecord): Promise<void> {
    const validated = sunoCallbackRecordSchema.parse(record);
    const latestKey = `suno:callback:latest:${validated.taskId}`;
    const logKey = `suno:callback:log:${validated.taskId}`;

    await this.redis.set(latestKey, JSON.stringify(validated), {
      ex: TTL_SECONDS,
    });

    await this.redis.rpush(logKey, JSON.stringify(validated));
    await this.redis.expire(logKey, TTL_SECONDS);
    await this.redis.ltrim(logKey, -LOG_KEEP, -1);
  }

  async getLatest(taskId: string): Promise<SunoCallbackRecord | null> {
    const raw = await this.redis.get<string>(`suno:callback:latest:${taskId}`);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    return sunoCallbackRecordSchema.parse(parsed);
  }
}
