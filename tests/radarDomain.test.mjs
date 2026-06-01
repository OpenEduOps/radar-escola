import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canExportSecurityData,
  canRegisterPerson,
  canResolveNeed,
  completeFirstAccess,
  configureSchool,
  registerNeed,
  registerPerson,
  addNeedUpdate,
  resolveNeed,
} from "../src/domain/radar/radarDomain.ts";

const now = "2026-06-01T12:00:00.000Z";

function configuredState() {
  return configureSchool({
    schoolName: "Escola Municipal Exemplo",
    directorName: "Maria Direcao",
    username: "direcao",
    passwordHash: "hash-direcao",
    recoveryTokenHash: "hash-token-direcao",
    recoveryQuestion: "Bairro onde cresci",
    recoveryAnswerHash: "hash-centro",
    now,
  }).state;
}

describe("radarDomain", () => {
  it("modela permissoes basicas por perfil", () => {
    assert.equal(canRegisterPerson("direction"), true);
    assert.equal(canRegisterPerson("managementSupport"), true);
    assert.equal(canRegisterPerson("user"), false);
    assert.equal(canResolveNeed("direction"), true);
    assert.equal(canResolveNeed("managementSupport"), true);
    assert.equal(canResolveNeed("user"), false);
    assert.equal(canExportSecurityData("direction"), true);
    assert.equal(canExportSecurityData("managementSupport"), false);
  });

  it("configura escola com direcao atual", () => {
    const state = configuredState();

    assert.equal(state.school?.name, "Escola Municipal Exemplo");
    assert.equal(state.school?.directorPersonId, "P-001");
    assert.equal(state.people[0].profile, "direction");
    assert.equal(state.people[0].mustChangePassword, false);
  });

  it("cadastra pessoa com senha temporaria e bloqueia terceiro apoio", () => {
    let state = configuredState();

    const firstSupport = registerPerson(state, "P-001", {
      name: "Ana Coordenacao",
      username: "ana",
      roleName: "Coordenacao",
      profile: "managementSupport",
      temporaryPasswordHash: "hash-123456",
      now,
    });
    state = firstSupport.state;
    const secondSupport = registerPerson(state, "P-001", {
      name: "Joao Vice",
      username: "joao",
      roleName: "Vice-direcao",
      profile: "managementSupport",
      temporaryPasswordHash: "hash-123456",
      now,
    });
    state = secondSupport.state;

    assert.equal(firstSupport.value.mustChangePassword, true);
    assert.equal(firstSupport.value.recoveryTokenHash, undefined);
    assert.throws(
      () =>
        registerPerson(state, "P-001", {
          name: "Terceiro Apoio",
          username: "terceiro",
          roleName: "Secretaria",
          profile: "managementSupport",
          temporaryPasswordHash: "hash-123456",
          now,
        }),
      /limitado a duas pessoas/,
    );
  });

  it("conclui primeiro acesso sem expor salvaguarda para a direcao", () => {
    let state = configuredState();
    const personResult = registerPerson(state, "P-001", {
      name: "Ana Coordenacao",
      username: "ana",
      roleName: "Coordenacao",
      profile: "user",
      temporaryPasswordHash: "hash-123456",
      now,
    });
    state = personResult.state;

    const firstAccessResult = completeFirstAccess(
      state,
      personResult.value.id,
      {
        newPasswordHash: "hash-nova-senha",
        recoveryTokenHash: "hash-token-pessoal",
        recoveryQuestion: "Bairro onde cresceu",
        recoveryAnswerHash: "hash-resposta-pessoal",
        now: "2026-06-01T12:10:00.000Z",
      },
    );

    assert.equal(firstAccessResult.value.mustChangePassword, false);
    assert.equal(firstAccessResult.value.passwordHash, "hash-nova-senha");
    assert.equal(
      firstAccessResult.value.recoveryTokenHash,
      "hash-token-pessoal",
    );
    assert.equal(
      firstAccessResult.value.recoveryQuestion,
      "Bairro onde cresceu",
    );
    assert.equal(
      firstAccessResult.value.recoveryAnswerHash,
      "hash-resposta-pessoal",
    );
  });

  it("fecha fluxo de necessidade com envolvidos, andamento e resolucao", () => {
    let state = configuredState();
    const personResult = registerPerson(state, "P-001", {
      name: "Ana Coordenacao",
      username: "ana",
      roleName: "Coordenacao",
      profile: "user",
      temporaryPasswordHash: "hash-123456",
      now,
    });
    state = personResult.state;
    const needResult = registerNeed(state, "P-001", {
      title: "Computador da secretaria nao liga",
      description: "Equipamento usado para atendimento esta parado.",
      location: "Secretaria",
      priority: "high",
      involvedPersonIds: [personResult.value.id, personResult.value.id],
      now,
    });
    state = needResult.state;

    assert.deepEqual(needResult.value.involvedPersonIds, [personResult.value.id]);
    assert.equal(needResult.value.status, "registered");

    const updateResult = addNeedUpdate(state, "P-001", {
      needId: needResult.value.id,
      description: "Fonte foi testada e precisa troca.",
      now: "2026-06-01T13:00:00.000Z",
    });
    state = updateResult.state;

    assert.equal(updateResult.value.status, "inProgress");
    assert.equal(updateResult.value.updates.length, 1);

    const resolvedResult = resolveNeed(state, "P-001", {
      needId: needResult.value.id,
      resolutionSummary: "Fonte substituida e computador voltou a ligar.",
      now: "2026-06-01T14:00:00.000Z",
    });

    assert.equal(resolvedResult.value.status, "resolved");
    assert.equal(resolvedResult.value.resolvedByPersonId, "P-001");
  });

  it("bloqueia usuario comum ao marcar necessidade como resolvida", () => {
    let state = configuredState();
    const personResult = registerPerson(state, "P-001", {
      name: "Ana Coordenacao",
      username: "ana",
      roleName: "Coordenacao",
      profile: "user",
      temporaryPasswordHash: "hash-123456",
      now,
    });
    state = personResult.state;
    const needResult = registerNeed(state, "P-001", {
      title: "Projetor sem cabo",
      description: "Sala 3 nao tem cabo para uso do projetor.",
      location: "Sala 3",
      priority: "medium",
      involvedPersonIds: [personResult.value.id],
      now,
    });

    assert.throws(
      () =>
        resolveNeed(personResult.state, personResult.value.id, {
          needId: needResult.value.id,
          resolutionSummary: "Cabo encontrado.",
          now,
        }),
      /Somente direcao ou apoio de gestao/,
    );
  });
});
