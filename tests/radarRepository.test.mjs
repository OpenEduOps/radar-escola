import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { configureSchool } from "../src/domain/radar/radarDomain.ts";
import {
  createBrowserRadarRepository,
  RADAR_STORAGE_KEY,
} from "../src/infrastructure/radarRepository.ts";

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function configuredState() {
  return configureSchool({
    schoolName: "Escola Municipal Esperanca",
    directorName: "Maria Direcao",
    username: "direcao",
    passwordHash: "hash-direcao",
    recoveryTokenHash: "hash-token-direcao",
    recoveryQuestion: "Bairro onde cresceu",
    recoveryAnswerHash: "hash-centro",
    now: "2026-06-01T12:00:00.000Z",
  }).state;
}

describe("radarRepository", () => {
  it("carrega estado vazio quando o armazenamento de desenvolvimento esta novo", async () => {
    const repository = createBrowserRadarRepository(createMemoryStorage());
    const state = await repository.load();

    assert.equal(state.school, null);
    assert.equal(state.people.length, 0);
    assert.equal(state.needs.length, 0);
    assert.equal(state.nextIds.person, 1);
    assert.equal(state.nextIds.need, 1);
    assert.equal(state.nextIds.update, 1);
  });

  it("persiste a fatia Radar entre instancias do fallback web", async () => {
    const storage = createMemoryStorage();
    const firstRepository = createBrowserRadarRepository(storage);
    const state = configuredState();

    await firstRepository.save(state);

    const secondRepository = createBrowserRadarRepository(storage);
    const loadedState = await secondRepository.load();

    assert.equal(loadedState.school?.name, "Escola Municipal Esperanca");
    assert.equal(loadedState.people[0].username, "direcao");
    assert.equal(loadedState.nextIds.person, 2);
  });

  it("volta para estado vazio quando o armazenamento web esta invalido", async () => {
    const storage = createMemoryStorage();

    storage.setItem(RADAR_STORAGE_KEY, "{json invalido");

    const repository = createBrowserRadarRepository(storage);
    const state = await repository.load();

    assert.equal(state.school, null);
    assert.equal(state.people.length, 0);
    assert.equal(state.needs.length, 0);
  });

  it("volta para estado vazio quando os contadores do fallback web estao invalidos", async () => {
    const storage = createMemoryStorage();
    const state = configuredState();

    storage.setItem(
      RADAR_STORAGE_KEY,
      JSON.stringify({
        ...state,
        nextIds: {
          person: 0,
          need: "2",
          update: 1,
        },
      }),
    );

    const repository = createBrowserRadarRepository(storage);
    const loadedState = await repository.load();

    assert.equal(loadedState.school, null);
    assert.equal(loadedState.people.length, 0);
    assert.equal(loadedState.needs.length, 0);
    assert.equal(loadedState.nextIds.person, 1);
    assert.equal(loadedState.nextIds.need, 1);
    assert.equal(loadedState.nextIds.update, 1);
  });
});
