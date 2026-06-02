import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBrowserPlaygroundRepository } from "../src/features/playground/playgroundRepository.ts";

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

describe("playgroundRepository", () => {
  it("carrega seed inicial em armazenamento novo", async () => {
    const repository = createBrowserPlaygroundRepository(createMemoryStorage());
    const snapshot = await repository.load();

    assert.equal(snapshot.statusRecords.length, 3);
    assert.equal(snapshot.playgroundRecords.length, 3);
    assert.equal(snapshot.statusRecords[0].codigoStatus, "SP-001");
    assert.equal(snapshot.playgroundRecords[0].id, "PG-001");
  });

  it("recupera seed inicial quando o armazenamento esta invalido", async () => {
    const storage = createMemoryStorage();

    storage.setItem("radar-escola:playground:v1", "{json invalido");

    const repository = createBrowserPlaygroundRepository(storage);
    const snapshot = await repository.load();

    assert.equal(snapshot.statusRecords.length, 3);
    assert.equal(snapshot.playgroundRecords.length, 3);
    assert.equal(snapshot.statusRecords[0].nome, "Status A");
    assert.equal(snapshot.playgroundRecords[0].nome, "Primeiro uso");
  });

  it("persiste status e registro entre instancias do repositorio", async () => {
    const storage = createMemoryStorage();
    const firstRepository = createBrowserPlaygroundRepository(storage);
    const statusResult = await firstRepository.registerStatus("Status Persistido");

    assert.ok(statusResult);

    const createResult = await firstRepository.createRecord({
      nome: "Registro Persistido",
      descricao: "Registro salvo no armazenamento local de desenvolvimento.",
      codigoStatus: statusResult.statusRecord.codigoStatus,
    });

    assert.ok(createResult);

    const secondRepository = createBrowserPlaygroundRepository(storage);
    const snapshot = await secondRepository.load();

    assert.equal(
      snapshot.statusRecords.some(
        (statusRecord) => statusRecord.nome === "Status Persistido",
      ),
      true,
    );
    assert.equal(
      snapshot.playgroundRecords.some(
        (record) => record.nome === "Registro Persistido",
      ),
      true,
    );
  });

  it("rejeita cadastro com codigo_status inexistente", async () => {
    const storage = createMemoryStorage();
    const repository = createBrowserPlaygroundRepository(storage);
    const before = await repository.load();

    const result = await repository.createRecord({
      nome: "Registro sem status",
      descricao: "Nao deve persistir sem relacao valida.",
      codigoStatus: "SP-999",
    });
    const after = await repository.load();

    assert.equal(result, null);
    assert.deepEqual(after.playgroundRecords, before.playgroundRecords);
  });

  it("rejeita atualizacao incompleta sem alterar o registro persistido", async () => {
    const storage = createMemoryStorage();
    const repository = createBrowserPlaygroundRepository(storage);
    const before = await repository.load();

    const result = await repository.updateRecord("PG-001", {
      nome: "   ",
      descricao: "Descricao invalida",
      codigoStatus: "SP-002",
    });
    const after = await repository.load();

    assert.equal(result, null);
    assert.deepEqual(after.playgroundRecords, before.playgroundRecords);
  });

  it("rejeita atualizacao com codigo_status inexistente", async () => {
    const storage = createMemoryStorage();
    const repository = createBrowserPlaygroundRepository(storage);
    const before = await repository.load();

    const result = await repository.updateRecord("PG-001", {
      nome: "Primeiro uso atualizado",
      descricao: "Nao deve persistir sem relacao valida.",
      codigoStatus: "SP-999",
    });
    const after = await repository.load();

    assert.equal(result, null);
    assert.deepEqual(after.playgroundRecords, before.playgroundRecords);
  });
});
