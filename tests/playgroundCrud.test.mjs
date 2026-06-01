import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlaygroundRecord,
  deletePlaygroundRecord,
  getStatusName,
  registerStatusPlayground,
  updatePlaygroundRecord,
} from "../src/features/playground/playgroundCrud.ts";
import {
  playgroundRecords,
  statusPlaygroundRecords,
} from "../src/features/playground/playgroundData.ts";

describe("playgroundCrud", () => {
  it("resolve o nome do status pelo codigo_status", () => {
    assert.equal(
      getStatusName(statusPlaygroundRecords, "SP-001"),
      "Status A",
    );
  });

  it("cadastra um status novo para alimentar o select", () => {
    const result = registerStatusPlayground(
      statusPlaygroundRecords,
      "Status D",
    );

    assert.ok(result);
    assert.equal(result.statusRecord.codigoStatus, "SP-004");
    assert.equal(result.statusRecord.nome, "Status D");
    assert.equal(result.statusRecords.length, 4);
  });

  it("reaproveita status existente sem duplicar cadastro", () => {
    const result = registerStatusPlayground(
      statusPlaygroundRecords,
      "status a",
    );

    assert.ok(result);
    assert.equal(result.statusRecord.codigoStatus, "SP-001");
    assert.equal(result.statusRecords.length, 3);
  });

  it("cria um registro playground com codigo_status relacionado", () => {
    const result = createPlaygroundRecord(playgroundRecords, {
      nome: "Novo fluxo",
      descricao: "Validar criacao de registro no CRUD.",
      codigoStatus: "SP-002",
    });

    assert.ok(result);
    assert.equal(result.record.id, "PG-004");
    assert.equal(result.record.codigoStatus, "SP-002");
    assert.equal(result.records.length, 4);
  });

  it("edita um registro playground existente", () => {
    const updatedRecords = updatePlaygroundRecord(playgroundRecords, "PG-001", {
      nome: "Primeiro uso revisado",
      descricao: "Descricao revisada.",
      codigoStatus: "SP-003",
    });
    const updatedRecord = updatedRecords.find((record) => record.id === "PG-001");

    assert.equal(updatedRecord?.nome, "Primeiro uso revisado");
    assert.equal(updatedRecord?.descricao, "Descricao revisada.");
    assert.equal(updatedRecord?.codigoStatus, "SP-003");
  });

  it("exclui um registro playground existente", () => {
    const updatedRecords = deletePlaygroundRecord(playgroundRecords, "PG-002");

    assert.equal(updatedRecords.length, 2);
    assert.equal(
      updatedRecords.some((record) => record.id === "PG-002"),
      false,
    );
  });
});
