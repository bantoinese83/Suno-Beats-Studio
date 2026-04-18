import type { SunoCallbackRecord } from "./callback-record";

export type SunoCallbackStore = {
  saveRecord: (record: SunoCallbackRecord) => Promise<void>;
  getLatest: (taskId: string) => Promise<SunoCallbackRecord | null>;
};
