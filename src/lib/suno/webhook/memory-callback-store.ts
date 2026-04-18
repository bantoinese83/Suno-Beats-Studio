import type { SunoCallbackRecord } from "./callback-record";
import { sunoCallbackRecordSchema } from "./callback-record";
import type { SunoCallbackStore } from "./callback-store";

const MAX_HISTORY = 50;

export class MemorySunoCallbackStore implements SunoCallbackStore {
  private readonly latest = new Map<string, SunoCallbackRecord>();
  private readonly history = new Map<string, SunoCallbackRecord[]>();

  async saveRecord(record: SunoCallbackRecord): Promise<void> {
    const validated = sunoCallbackRecordSchema.parse(record);
    this.latest.set(validated.taskId, validated);

    const list = this.history.get(validated.taskId) ?? [];
    const next = [...list, validated];

    if (next.length > MAX_HISTORY) {
      next.splice(0, next.length - MAX_HISTORY);
    }

    this.history.set(validated.taskId, next);
  }

  async getLatest(taskId: string): Promise<SunoCallbackRecord | null> {
    return this.latest.get(taskId) ?? null;
  }
}
