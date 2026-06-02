import type {
  PlaygroundRecord,
  StatusPlaygroundRecord,
} from "./playgroundData.ts";
import { playgroundRecords, statusPlaygroundRecords } from "./playgroundData.ts";
import {
  createPlaygroundRecord,
  deletePlaygroundRecord,
  isPlaygroundDraftComplete,
  normalizePlaygroundText,
  registerStatusPlayground,
  type PlaygroundDraft,
  updatePlaygroundRecord,
} from "./playgroundCrud.ts";

export type PlaygroundSnapshot = {
  statusRecords: StatusPlaygroundRecord[];
  playgroundRecords: PlaygroundRecord[];
};

export type StatusPlaygroundMutation = {
  statusRecord: StatusPlaygroundRecord;
  snapshot: PlaygroundSnapshot;
};

export type PlaygroundMutation = {
  record: PlaygroundRecord;
  snapshot: PlaygroundSnapshot;
};

export type PlaygroundRepository = {
  load: () => Promise<PlaygroundSnapshot>;
  registerStatus: (nome: string) => Promise<StatusPlaygroundMutation | null>;
  createRecord: (draft: PlaygroundDraft) => Promise<PlaygroundMutation | null>;
  updateRecord: (
    id: string,
    draft: PlaygroundDraft,
  ) => Promise<PlaygroundMutation | null>;
  deleteRecord: (id: string) => Promise<PlaygroundSnapshot>;
};

export type PlaygroundStorage = Pick<Storage, "getItem" | "setItem">;

const PLAYGROUND_STORAGE_KEY = "radar-escola:playground:v1";

export function createPlaygroundRepository(): PlaygroundRepository {
  if (isTauriRuntime()) {
    return createTauriPlaygroundRepository();
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return createBrowserPlaygroundRepository(window.localStorage);
  }

  throw new Error("Persistencia local do playground indisponivel.");
}

export function createBrowserPlaygroundRepository(
  storage: PlaygroundStorage,
): PlaygroundRepository {
  function loadSnapshot(): PlaygroundSnapshot {
    const storedValue = storage.getItem(PLAYGROUND_STORAGE_KEY);

    if (!storedValue) {
      return getInitialSnapshot();
    }

    try {
      const parsedValue = JSON.parse(storedValue) as PlaygroundSnapshot;

      if (!isPlaygroundSnapshot(parsedValue)) {
        return getInitialSnapshot();
      }

      return parsedValue;
    } catch {
      return getInitialSnapshot();
    }
  }

  function saveSnapshot(snapshot: PlaygroundSnapshot) {
    storage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(snapshot));
  }

  return {
    async load() {
      const snapshot = loadSnapshot();
      saveSnapshot(snapshot);

      return snapshot;
    },
    async registerStatus(nome: string) {
      const snapshot = loadSnapshot();
      const result = registerStatusPlayground(snapshot.statusRecords, nome);

      if (!result) {
        return null;
      }

      const nextSnapshot = {
        ...snapshot,
        statusRecords: result.statusRecords,
      };
      saveSnapshot(nextSnapshot);

      return {
        statusRecord: result.statusRecord,
        snapshot: nextSnapshot,
      };
    },
    async createRecord(draft: PlaygroundDraft) {
      const snapshot = loadSnapshot();

      if (!hasStatusRecord(snapshot, draft.codigoStatus)) {
        return null;
      }

      const result = createPlaygroundRecord(snapshot.playgroundRecords, draft);

      if (!result) {
        return null;
      }

      const nextSnapshot = {
        ...snapshot,
        playgroundRecords: result.records,
      };
      saveSnapshot(nextSnapshot);

      return {
        record: result.record,
        snapshot: nextSnapshot,
      };
    },
    async updateRecord(id: string, draft: PlaygroundDraft) {
      if (!isPlaygroundDraftComplete(draft)) {
        return null;
      }

      const snapshot = loadSnapshot();

      if (!hasStatusRecord(snapshot, draft.codigoStatus)) {
        return null;
      }

      const nextRecords = updatePlaygroundRecord(
        snapshot.playgroundRecords,
        id,
        draft,
      );
      const record = nextRecords.find((currentRecord) => currentRecord.id === id);

      if (!record) {
        return null;
      }

      const nextSnapshot = {
        ...snapshot,
        playgroundRecords: nextRecords,
      };
      saveSnapshot(nextSnapshot);

      return {
        record,
        snapshot: nextSnapshot,
      };
    },
    async deleteRecord(id: string) {
      const snapshot = loadSnapshot();
      const nextSnapshot = {
        ...snapshot,
        playgroundRecords: deletePlaygroundRecord(
          snapshot.playgroundRecords,
          id,
        ),
      };
      saveSnapshot(nextSnapshot);

      return nextSnapshot;
    },
  };
}

function hasStatusRecord(snapshot: PlaygroundSnapshot, codigoStatus: string) {
  const normalizedStatus = normalizePlaygroundText(codigoStatus);

  return snapshot.statusRecords.some(
    (statusRecord) => statusRecord.codigoStatus === normalizedStatus,
  );
}

function createTauriPlaygroundRepository(): PlaygroundRepository {
  return {
    load() {
      return invokeTauri<PlaygroundSnapshot>("playground_load");
    },
    registerStatus(nome: string) {
      return invokeTauri<StatusPlaygroundMutation>(
        "playground_register_status",
        { nome },
      );
    },
    createRecord(draft: PlaygroundDraft) {
      return invokeTauri<PlaygroundMutation>("playground_create_record", {
        draft,
      });
    },
    updateRecord(id: string, draft: PlaygroundDraft) {
      return invokeTauri<PlaygroundMutation>("playground_update_record", {
        id,
        draft,
      });
    },
    deleteRecord(id: string) {
      return invokeTauri<PlaygroundSnapshot>("playground_delete_record", { id });
    },
  };
}

function getInitialSnapshot(): PlaygroundSnapshot {
  return {
    statusRecords: statusPlaygroundRecords,
    playgroundRecords,
  };
}

function isPlaygroundSnapshot(value: PlaygroundSnapshot): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(value.statusRecords) &&
    Array.isArray(value.playgroundRecords)
  );
}

function isTauriRuntime(): boolean {
  return (
    typeof window !== "undefined" &&
    "__TAURI_INTERNALS__" in window
  );
}

async function invokeTauri<T>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");

  return invoke<T>(command, args);
}
