import type { SunoCallbackStore } from "./callback-store";
import { MemorySunoCallbackStore } from "./memory-callback-store";
import { RedisSunoCallbackStore } from "./redis-callback-store";

let memorySingleton: MemorySunoCallbackStore | undefined;

export function createSunoCallbackStore(): SunoCallbackStore {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return new RedisSunoCallbackStore();
  }

  if (!memorySingleton) {
    memorySingleton = new MemorySunoCallbackStore();
  }

  return memorySingleton;
}
