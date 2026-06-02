import {
  createEmptyRadarState,
  type RadarState,
} from "../domain/radar/radarDomain.ts";

export type RadarRepository = {
  load: () => Promise<RadarState>;
  save: (state: RadarState) => Promise<RadarState>;
};

export type RadarStorage = Pick<Storage, "getItem" | "setItem">;

export const RADAR_STORAGE_KEY = "radar-escola:radar-state:v1";

export function createRadarRepository(): RadarRepository {
  if (isTauriRuntime()) {
    return createTauriRadarRepository();
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return createBrowserRadarRepository(window.localStorage);
  }

  throw new Error("Persistencia local do Radar indisponivel.");
}

export function createBrowserRadarRepository(
  storage: RadarStorage,
): RadarRepository {
  return {
    async load() {
      const storedValue = storage.getItem(RADAR_STORAGE_KEY);

      if (!storedValue) {
        return createEmptyRadarState();
      }

      try {
        const parsedValue = JSON.parse(storedValue) as RadarState;

        if (!isRadarStateLike(parsedValue)) {
          return createEmptyRadarState();
        }

        return parsedValue;
      } catch {
        return createEmptyRadarState();
      }
    },
    async save(state: RadarState) {
      storage.setItem(RADAR_STORAGE_KEY, JSON.stringify(state));

      return state;
    },
  };
}

function createTauriRadarRepository(): RadarRepository {
  return {
    load() {
      return invokeTauri<RadarState>("radar_load_state");
    },
    save(state: RadarState) {
      return invokeTauri<RadarState>("radar_save_state", { state });
    },
  };
}

function isRadarStateLike(value: RadarState): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(value.people) &&
    Array.isArray(value.needs) &&
    typeof value.nextIds === "object" &&
    value.nextIds !== null
  );
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

async function invokeTauri<T>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");

  return invoke<T>(command, args);
}
