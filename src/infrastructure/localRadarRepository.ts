import type { RadarState } from "../domain/radar/radarDomain";

const RADAR_STORAGE_KEY = "radar-escola:radar-state:v1";

export function loadRadarState(): RadarState | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  const storedValue = localStorage.getItem(RADAR_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as RadarState;

    if (!isRadarStateLike(parsedValue)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

export function saveRadarState(state: RadarState): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  localStorage.setItem(RADAR_STORAGE_KEY, JSON.stringify(state));
}

function isBrowserStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
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
