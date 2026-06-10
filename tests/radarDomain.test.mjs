import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canExportSecurityData,
  canRegisterPerson,
  canRegisterRoleOrFunction,
  canManageSupport,
  canResolveNeed,
  canCancelOrCorrectNeed,
  canRestoreSecurityData,
  canTransferDirectorship,
  canResetPassword,
  canUnlockSession,
  canUseNormalSession,
  cancelNeed,
  addInvolvedPerson,
  completeFirstAccess,
  completeActionPlanItem,
  configureSchool,
  configureInitialSchool,
  createActionPlanItem,
  createAuditEvent,
  createEmptyRadarState,
  createEquipment,
  createLocalSession,
  createRoleOrFunction,
  inactivateEquipment,
  isFinalNeedStatus,
  lockSession,
  markSessionActivity,
  registerNeed,
  registerPerson,
  addNeedUpdate,
  requestTechnicalClosure,
  resolveNeed,
  shouldLockSession,
  validateSecurityBackupPackage,
  SECURITY_BACKUP_FORMAT_VERSION,
  SECURITY_BACKUP_REQUIRED_TABLES,
  SECURITY_BACKUP_RESTORE_MODE,
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
    assert.equal(canRegisterRoleOrFunction("direction"), true);
    assert.equal(canRegisterRoleOrFunction("managementSupport"), true);
    assert.equal(canRegisterRoleOrFunction("user"), false);
    assert.equal(canManageSupport("direction"), true);
    assert.equal(canManageSupport("managementSupport"), false);
    assert.equal(canResolveNeed("direction"), true);
    assert.equal(canResolveNeed("managementSupport"), true);
    assert.equal(canResolveNeed("user"), false);
    assert.equal(canCancelOrCorrectNeed("direction"), true);
    assert.equal(canCancelOrCorrectNeed("managementSupport"), true);
    assert.equal(canCancelOrCorrectNeed("user"), false);
    assert.equal(canExportSecurityData("direction"), true);
    assert.equal(canExportSecurityData("managementSupport"), false);
    assert.equal(canRestoreSecurityData("direction"), true);
    assert.equal(canRestoreSecurityData("managementSupport"), false);
    assert.equal(canTransferDirectorship("direction"), true);
    assert.equal(canTransferDirectorship("managementSupport"), false);
    assert.equal(canResetPassword("direction"), true);
    assert.equal(canResetPassword("managementSupport"), false);
  });

  it("configura escola com direcao atual", () => {
    const state = configuredState();

    assert.equal(state.school?.name, "Escola Municipal Exemplo");
    assert.equal(state.school?.directorPersonId, "P-001");
    assert.equal(state.people[0].profile, "direction");
    assert.equal(state.people[0].mustChangePassword, false);
  });

  it("bloqueia segunda escola ativa no dominio", () => {
    const state = configuredState();

    assert.throws(
      () =>
        configureInitialSchool(state, {
          schoolName: "Outra escola",
          directorName: "Outra direcao",
          username: "outra",
          passwordHash: "hash-outra",
          recoveryTokenHash: "hash-token",
          recoveryQuestion: "Bairro onde cresceu",
          recoveryAnswerHash: "hash-resposta",
          now,
        }),
      /ja foi configurada/,
    );
  });

  it("modela cargo ou funcao com nome unico ativo", () => {
    const role = createRoleOrFunction([], " Coordenacao Pedagogica ", now);

    assert.equal(role.name, "Coordenacao Pedagogica");
    assert.equal(role.active, true);
    assert.throws(
      () => createRoleOrFunction([role], "coordenacao pedagogica", now),
      /ja existe/,
    );
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

  it("mantem primeiro acesso como bloqueio de uso normal", () => {
    let state = configuredState();
    const personResult = registerPerson(state, "P-001", {
      name: "Ana Coordenacao",
      username: "ana",
      roleName: "Coordenacao",
      profile: "user",
      temporaryPasswordHash: "hash-123456",
      now,
    });

    assert.equal(canUseNormalSession(personResult.value), false);

    state = personResult.state;
    const firstAccessResult = completeFirstAccess(state, personResult.value.id, {
      newPasswordHash: "hash-nova-senha",
      temporaryPasswordHash: "hash-123456",
      recoveryTokenHash: "hash-token-pessoal",
      recoveryQuestion: "Bairro onde cresceu",
      recoveryAnswerHash: "hash-resposta-pessoal",
      now,
    });

    assert.equal(canUseNormalSession(firstAccessResult.value), true);
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

  it("bloqueia senha final igual a senha temporaria no primeiro acesso", () => {
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

    assert.throws(
      () =>
        completeFirstAccess(state, personResult.value.id, {
          newPasswordHash: "hash-123456",
          temporaryPasswordHash: "hash-123456",
          recoveryTokenHash: "hash-token-pessoal",
          recoveryQuestion: "Bairro onde cresceu",
          recoveryAnswerHash: "hash-resposta-pessoal",
          now,
        }),
      /diferente da senha temporaria/,
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
      involvedPersonIds: [personResult.value.id],
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

  it("bloqueia envolvido duplicado ou inativo", () => {
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

    assert.throws(
      () =>
        registerNeed(state, "P-001", {
          title: "Projetor sem cabo",
          description: "Sala 3 nao tem cabo para uso do projetor.",
          location: "Sala 3",
          priority: "medium",
          involvedPersonIds: [personResult.value.id, personResult.value.id],
          now,
        }),
      /marcada duas vezes/,
    );
    assert.throws(
      () =>
        registerNeed(state, "P-001", {
          title: "Projetor sem cabo",
          description: "Sala 3 nao tem cabo para uso do projetor.",
          location: "Sala 3",
          priority: "medium",
          involvedPersonIds: ["P-999"],
          now,
        }),
      /Pessoa ativa nao encontrada/,
    );
  });

  it("adiciona envolvido em necessidade ativa e bloqueia duplicidade", () => {
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
      involvedPersonIds: [],
      now,
    });
    state = needResult.state;

    const involvedResult = addInvolvedPerson(
      state,
      "P-001",
      needResult.value.id,
      personResult.value.id,
    );

    assert.deepEqual(involvedResult.value.involvedPersonIds, [
      personResult.value.id,
    ]);
    assert.throws(
      () =>
        addInvolvedPerson(
          involvedResult.state,
          "P-001",
          needResult.value.id,
          personResult.value.id,
        ),
      /ja esta marcada/,
    );
  });

  it("registra fechamento tecnico sem resolver a necessidade", () => {
    let state = configuredState();
    const needResult = registerNeed(state, "P-001", {
      title: "Impressora com atolamento recorrente",
      description: "Equipamento precisa de avaliacao antes de trocar.",
      location: "Secretaria",
      priority: "medium",
      involvedPersonIds: [],
      now,
    });
    state = needResult.state;

    const closureResult = requestTechnicalClosure(state, "P-001", {
      needId: needResult.value.id,
      description: "Tecnico avaliou e recomenda troca de rolo.",
      now: "2026-06-01T13:00:00.000Z",
    });

    assert.equal(closureResult.value.status, "inProgress");
    assert.equal(closureResult.value.updates[0].kind, "technicalClosure");
    assert.equal(isFinalNeedStatus(closureResult.value.status), false);
  });

  it("cancela necessidade apenas por gestao com motivo", () => {
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
      title: "Demanda duplicada",
      description: "Registro sera cancelado por duplicidade.",
      location: "Diretoria",
      priority: "low",
      involvedPersonIds: [],
      now,
    });
    state = needResult.state;

    assert.throws(
      () =>
        cancelNeed(state, personResult.value.id, {
          needId: needResult.value.id,
          cancellationReason: "Duplicada.",
          now,
        }),
      /Somente direcao ou apoio/,
    );

    const cancelledResult = cancelNeed(state, "P-001", {
      needId: needResult.value.id,
      cancellationReason: "Registro duplicado.",
      now: "2026-06-01T13:00:00.000Z",
    });

    assert.equal(cancelledResult.value.status, "cancelled");
    assert.equal(cancelledResult.value.cancelledByPersonId, "P-001");
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

  it("modela equipamento como apoio operacional, nao patrimonio completo", () => {
    const equipment = createEquipment("direction", [], {
      name: "Notebook secretaria",
      location: "Secretaria",
      identification: "NB-001",
      currentState: "Em uso",
      now,
    });

    assert.equal(equipment.name, "Notebook secretaria");
    assert.equal(equipment.active, true);
    assert.throws(
      () =>
        createEquipment("user", [], {
          name: "Projetor",
          location: "Sala 1",
          currentState: "Em uso",
          now,
        }),
      /Somente gestao/,
    );
    assert.throws(
      () =>
        createEquipment("managementSupport", [equipment], {
          name: "Outro notebook",
          location: "Biblioteca",
          identification: "nb-001",
          currentState: "Em uso",
          now,
        }),
      /ja existe/,
    );

    const inactiveEquipment = inactivateEquipment(
      "managementSupport",
      equipment,
      "2026-06-01T13:00:00.000Z",
    );

    assert.equal(inactiveEquipment.active, false);
  });

  it("modela auditoria sem registrar segredos claros", () => {
    const event = createAuditEvent({
      id: "AUD-001",
      type: "USER_CREATED",
      actorPersonId: "P-001",
      entityType: "user_account",
      entityId: "UA-001",
      summary: "Usuario criado com senha temporaria.",
      metadata: {
        targetPersonId: "P-002",
      },
      now,
    });

    assert.equal(event.type, "USER_CREATED");
    assert.throws(
      () =>
        createAuditEvent({
          id: "AUD-002",
          type: "PASSWORD_RESET",
          actorPersonId: "P-001",
          entityType: "user_account",
          entityId: "UA-001",
          summary: "Senha=123456",
          metadata: {},
          now,
        }),
      /segredo/,
    );
    assert.throws(
      () =>
        createAuditEvent({
          id: "AUD-003",
          type: "PASSWORD_RESET",
          actorPersonId: "P-001",
          entityType: "user_account",
          entityId: "UA-001",
          summary: "Senha redefinida.",
          metadata: { password: "123456" },
          now,
        }),
      /segredo/,
    );
  });

  it("modela plano de acao simples sem gerenciador complexo de tarefas", () => {
    const state = configuredState();
    const needResult = registerNeed(state, "P-001", {
      title: "Portao com defeito",
      description: "Portao precisa de manutencao.",
      location: "Entrada",
      priority: "high",
      involvedPersonIds: [],
      now,
    });
    const item = createActionPlanItem(needResult.value, "P-001", [], {
      description: "Solicitar avaliacao do prestador.",
      now,
    });

    assert.equal(item.description, "Solicitar avaliacao do prestador.");

    const completedItem = completeActionPlanItem(
      item,
      "P-001",
      "2026-06-01T13:00:00.000Z",
    );

    assert.equal(completedItem.completedByPersonId, "P-001");

    const resolvedResult = resolveNeed(needResult.state, "P-001", {
      needId: needResult.value.id,
      resolutionSummary: "Portao consertado.",
      now,
    });

    assert.throws(
      () =>
        createActionPlanItem(resolvedResult.value, "P-001", [completedItem], {
          description: "Novo item",
          now,
        }),
      /finalizada/,
    );
  });

  it("modela sessao local com bloqueio por inatividade", () => {
    const session = createLocalSession("P-001", "2026-06-01T12:00:00.000Z");

    assert.equal(
      shouldLockSession(session, "2026-06-01T12:29:59.000Z"),
      false,
    );
    assert.equal(
      shouldLockSession(session, "2026-06-01T12:30:00.000Z"),
      true,
    );
    assert.equal(canUnlockSession(session, "P-001"), true);
    assert.equal(canUnlockSession(session, "P-002"), false);

    const activeSession = markSessionActivity(
      session,
      "2026-06-01T12:10:00.000Z",
    );
    const lockedSession = lockSession(activeSession, "2026-06-01T12:40:00.000Z");

    assert.equal(
      shouldLockSession(lockedSession, "2026-06-01T12:41:00.000Z"),
      true,
    );
    assert.throws(
      () => markSessionActivity(lockedSession, "2026-06-01T12:41:00.000Z"),
      /Sessao bloqueada/,
    );
  });

  it("valida pacote de seguranca restauravel por substituicao total", () => {
    const tables = Object.fromEntries(
      SECURITY_BACKUP_REQUIRED_TABLES.map((tableName) => [tableName, []]),
    );
    const backupPackage = validateSecurityBackupPackage({
      formatVersion: SECURITY_BACKUP_FORMAT_VERSION,
      restoreMode: SECURITY_BACKUP_RESTORE_MODE,
      exportedAt: now,
      tables,
    });

    assert.equal(backupPackage.restoreMode, "replace_all");
    assert.throws(
      () =>
        validateSecurityBackupPackage({
          formatVersion: "old",
          restoreMode: SECURITY_BACKUP_RESTORE_MODE,
          exportedAt: now,
          tables,
        }),
      /versao invalida/,
    );
    assert.throws(
      () =>
        validateSecurityBackupPackage({
          formatVersion: SECURITY_BACKUP_FORMAT_VERSION,
          restoreMode: "merge",
          exportedAt: now,
          tables,
        }),
      /substitui tudo/,
    );
    assert.throws(
      () =>
        validateSecurityBackupPackage({
          formatVersion: SECURITY_BACKUP_FORMAT_VERSION,
          restoreMode: SECURITY_BACKUP_RESTORE_MODE,
          exportedAt: now,
          tables: {
            ...tables,
            user_accounts: [{ username: "ana", password: "123456" }],
          },
        }),
      /segredo/,
    );
  });
});
