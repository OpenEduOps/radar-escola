export const TEMPORARY_PASSWORD = "123456";

export type PersonProfile = "direction" | "managementSupport" | "user";
export type NeedPriority = "low" | "medium" | "high";
export type NeedStatus =
  | "registered"
  | "inProgress"
  | "resolved"
  | "cancelled";
export type NeedUpdateKind = "progress" | "technicalClosure";
export type AuditEventType =
  | "SCHOOL_CONFIGURED"
  | "DIRECTORSHIP_TRANSFERRED"
  | "USER_CREATED"
  | "PASSWORD_RESET"
  | "MANAGEMENT_SUPPORT_GRANTED"
  | "MANAGEMENT_SUPPORT_REVOKED"
  | "NEED_RESOLVED"
  | "NEED_CANCELLED"
  | "SECURITY_EXPORTED"
  | "SECURITY_RESTORED";
export type SecurityRestoreMode = "replace_all";

export const SESSION_INACTIVITY_LIMIT_MINUTES = 30;
export const SECURITY_BACKUP_FORMAT_VERSION = "radar-escola.security.v1";
export const SECURITY_BACKUP_RESTORE_MODE: SecurityRestoreMode = "replace_all";
export const SECURITY_BACKUP_REQUIRED_TABLES = [
  "schools",
  "people",
  "roles",
  "user_accounts",
  "access_recovery",
  "management_support",
  "needs",
  "need_involved_people",
  "need_updates",
  "need_action_plan_items",
  "equipment",
  "audit_events",
  "security_exports",
  "security_imports",
] as const;

export interface School {
  id: string;
  name: string;
  directorPersonId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleOrFunction {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  inactiveAt?: string;
}

export interface Person {
  id: string;
  name: string;
  username: string;
  roleName: string;
  profile: PersonProfile;
  passwordHash: string;
  recoveryTokenHash?: string;
  recoveryQuestion?: string;
  recoveryAnswerHash?: string;
  mustChangePassword: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NeedUpdate {
  id: string;
  authorPersonId: string;
  description: string;
  createdAt: string;
  kind?: NeedUpdateKind;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: NeedPriority;
  status: NeedStatus;
  involvedPersonIds: string[];
  updates: NeedUpdate[];
  createdByPersonId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionSummary?: string;
  resolvedByPersonId?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledByPersonId?: string;
}

export interface ActionPlanItem {
  id: string;
  needId: string;
  description: string;
  responsiblePersonId?: string;
  completedAt?: string;
  completedByPersonId?: string;
  createdByPersonId: string;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  identification?: string;
  currentState: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  inactiveAt?: string;
}

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  actorPersonId: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface LocalSession {
  personId: string;
  authenticatedAt: string;
  lastActivityAt: string;
  lockedAt?: string;
}

export interface SecurityBackupPackage {
  formatVersion: string;
  restoreMode: SecurityRestoreMode;
  exportedAt: string;
  tables: Partial<
    Record<
      (typeof SECURITY_BACKUP_REQUIRED_TABLES)[number],
      Array<Record<string, unknown>>
    >
  >;
  plainSecretsDetected?: string[];
}

export interface RadarState {
  school: School | null;
  people: Person[];
  needs: Need[];
  nextIds: {
    person: number;
    need: number;
    update: number;
  };
}

export interface ConfigureSchoolInput {
  schoolName: string;
  directorName: string;
  username: string;
  passwordHash: string;
  recoveryTokenHash: string;
  recoveryQuestion: string;
  recoveryAnswerHash: string;
  now: string;
}

export interface RegisterPersonInput {
  name: string;
  username: string;
  roleName: string;
  profile: Exclude<PersonProfile, "direction">;
  temporaryPasswordHash: string;
  now: string;
}

export interface CompleteFirstAccessInput {
  newPasswordHash: string;
  temporaryPasswordHash?: string;
  recoveryTokenHash: string;
  recoveryQuestion: string;
  recoveryAnswerHash: string;
  now: string;
}

export interface RegisterNeedInput {
  title: string;
  description: string;
  location: string;
  priority: NeedPriority;
  involvedPersonIds: string[];
  now: string;
}

export interface AddNeedUpdateInput {
  needId: string;
  description: string;
  now: string;
}

export interface ResolveNeedInput {
  needId: string;
  resolutionSummary: string;
  now: string;
}

export interface CancelNeedInput {
  needId: string;
  cancellationReason: string;
  now: string;
}

export interface CreateEquipmentInput {
  name: string;
  location: string;
  identification?: string;
  currentState: string;
  now: string;
}

export interface RadarMutation<T> {
  state: RadarState;
  value: T;
}

export function createEmptyRadarState(): RadarState {
  return {
    school: null,
    people: [],
    needs: [],
    nextIds: {
      person: 1,
      need: 1,
      update: 1,
    },
  };
}

export function canRegisterPerson(profile: PersonProfile): boolean {
  return profile === "direction" || profile === "managementSupport";
}

export function canRegisterRoleOrFunction(profile: PersonProfile): boolean {
  return canRegisterPerson(profile);
}

export function canManageSupport(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canResolveNeed(profile: PersonProfile): boolean {
  return profile === "direction" || profile === "managementSupport";
}

export function canCancelOrCorrectNeed(profile: PersonProfile): boolean {
  return canResolveNeed(profile);
}

export function canExportSecurityData(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canRestoreSecurityData(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canViewAudit(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canTransferDirectorship(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canResetPassword(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canUseNormalSession(person: Person): boolean {
  return person.active && !person.mustChangePassword;
}

export function canConfigureSchool(state: RadarState): boolean {
  return state.school === null;
}

export function getPriorityLabel(priority: NeedPriority): string {
  const labels: Record<NeedPriority, string> = {
    low: "Baixa",
    medium: "Media",
    high: "Alta",
  };

  return labels[priority];
}

export function getStatusLabel(status: NeedStatus): string {
  const labels: Record<NeedStatus, string> = {
    registered: "Registrada",
    inProgress: "Em andamento",
    resolved: "Resolvida",
    cancelled: "Cancelada",
  };

  return labels[status];
}

export function isFinalNeedStatus(status: NeedStatus): boolean {
  return status === "resolved" || status === "cancelled";
}

export function configureInitialSchool(
  state: RadarState,
  input: ConfigureSchoolInput,
): RadarMutation<School> {
  if (!canConfigureSchool(state)) {
    throw new Error("A escola ja foi configurada neste computador.");
  }

  return configureSchool(input);
}

export function configureSchool(
  input: ConfigureSchoolInput,
): RadarMutation<School> {
  assertRequired(input.schoolName, "Nome da escola e obrigatorio.");
  assertRequired(input.directorName, "Nome da direcao e obrigatorio.");
  assertRequired(input.username, "Usuario da direcao e obrigatorio.");
  assertRequired(input.passwordHash, "Senha da direcao e obrigatoria.");
  assertRequired(
    input.recoveryTokenHash,
    "Token de recuperacao e obrigatorio.",
  );
  assertRequired(
    input.recoveryQuestion,
    "Pergunta de recuperacao e obrigatoria.",
  );
  assertRequired(
    input.recoveryAnswerHash,
    "Resposta de recuperacao e obrigatoria.",
  );

  const director: Person = {
    id: "P-001",
    name: normalizeText(input.directorName),
    username: normalizeUsername(input.username),
    roleName: "Direcao",
    profile: "direction",
    passwordHash: input.passwordHash,
    recoveryTokenHash: input.recoveryTokenHash,
    recoveryQuestion: normalizeText(input.recoveryQuestion),
    recoveryAnswerHash: input.recoveryAnswerHash,
    mustChangePassword: false,
    active: true,
    createdAt: input.now,
  };
  const school: School = {
    id: "S-001",
    name: normalizeText(input.schoolName),
    directorPersonId: director.id,
    createdAt: input.now,
  };

  return {
    state: {
      school,
      people: [director],
      needs: [],
      nextIds: {
        person: 2,
        need: 1,
        update: 1,
      },
    },
    value: school,
  };
}

export function completeFirstAccess(
  state: RadarState,
  actorPersonId: string,
  input: CompleteFirstAccessInput,
): RadarMutation<Person> {
  const person = requirePerson(state, actorPersonId);

  if (!person.mustChangePassword) {
    throw new Error("Primeiro acesso ja foi concluido.");
  }

  assertRequired(input.newPasswordHash, "Nova senha e obrigatoria.");
  if (
    input.temporaryPasswordHash &&
    input.newPasswordHash === input.temporaryPasswordHash
  ) {
    throw new Error("Escolha uma senha diferente da senha temporaria.");
  }
  assertRequired(input.recoveryTokenHash, "Token de recuperacao e obrigatorio.");
  assertRequired(
    input.recoveryQuestion,
    "Pergunta de recuperacao e obrigatoria.",
  );
  assertRequired(
    input.recoveryAnswerHash,
    "Resposta de recuperacao e obrigatoria.",
  );

  const updatedPerson: Person = {
    ...person,
    passwordHash: input.newPasswordHash,
    recoveryTokenHash: input.recoveryTokenHash,
    recoveryQuestion: normalizeText(input.recoveryQuestion),
    recoveryAnswerHash: input.recoveryAnswerHash,
    mustChangePassword: false,
    updatedAt: input.now,
  };

  return {
    state: replacePerson(state, updatedPerson),
    value: updatedPerson,
  };
}

export function registerPerson(
  state: RadarState,
  actorPersonId: string,
  input: RegisterPersonInput,
): RadarMutation<Person> {
  const actor = requirePerson(state, actorPersonId);

  if (!canRegisterPerson(actor.profile)) {
    throw new Error("Somente direcao ou apoio de gestao cadastra pessoas.");
  }

  assertRequired(input.name, "Nome da pessoa e obrigatorio.");
  assertRequired(input.username, "Usuario da pessoa e obrigatorio.");
  assertRequired(input.roleName, "Cargo ou funcao e obrigatorio.");
  assertRequired(input.temporaryPasswordHash, "Senha temporaria e obrigatoria.");
  assertSupportedProfile(input.profile);

  const username = normalizeUsername(input.username);

  if (state.people.some((person) => person.username === username)) {
    throw new Error("Esse usuario ja existe.");
  }

  if (
    input.profile === "managementSupport" &&
    countActiveManagementSupport(state) >= 2
  ) {
    throw new Error("Apoio de gestao esta limitado a duas pessoas.");
  }

  const person: Person = {
    id: formatId("P", state.nextIds.person),
    name: normalizeText(input.name),
    username,
    roleName: normalizeText(input.roleName),
    profile: input.profile,
    passwordHash: input.temporaryPasswordHash,
    mustChangePassword: true,
    active: true,
    createdAt: input.now,
  };

  return {
    state: {
      ...state,
      people: [...state.people, person],
      nextIds: {
        ...state.nextIds,
        person: state.nextIds.person + 1,
      },
    },
    value: person,
  };
}

export function registerNeed(
  state: RadarState,
  actorPersonId: string,
  input: RegisterNeedInput,
): RadarMutation<Need> {
  requirePerson(state, actorPersonId);
  assertRequired(input.title, "Titulo da necessidade e obrigatorio.");
  assertRequired(input.description, "Descricao da necessidade e obrigatoria.");
  assertRequired(input.location, "Local da necessidade e obrigatorio.");
  assertSupportedPriority(input.priority);

  const activeInvolvedIds = validateInvolvedPersonIds(
    state,
    input.involvedPersonIds,
  );
  const need: Need = {
    id: formatId("N", state.nextIds.need),
    title: normalizeText(input.title),
    description: normalizeText(input.description),
    location: normalizeText(input.location),
    priority: input.priority,
    status: "registered",
    involvedPersonIds: activeInvolvedIds,
    updates: [],
    createdByPersonId: actorPersonId,
    createdAt: input.now,
    updatedAt: input.now,
  };

  return {
    state: {
      ...state,
      needs: [need, ...state.needs],
      nextIds: {
        ...state.nextIds,
        need: state.nextIds.need + 1,
      },
    },
    value: need,
  };
}

export function addNeedUpdate(
  state: RadarState,
  actorPersonId: string,
  input: AddNeedUpdateInput,
): RadarMutation<Need> {
  requirePerson(state, actorPersonId);
  assertRequired(input.description, "Atualizacao de andamento e obrigatoria.");

  const need = requireNeed(state, input.needId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade resolvida nao recebe novo andamento.");
  }

  const update: NeedUpdate = {
    id: formatId("U", state.nextIds.update),
    authorPersonId: actorPersonId,
    description: normalizeText(input.description),
    createdAt: input.now,
    kind: "progress",
  };
  const updatedNeed: Need = {
    ...need,
    status: "inProgress",
    updates: [...need.updates, update],
    updatedAt: input.now,
  };

  return {
    state: replaceNeed(
      {
        ...state,
        nextIds: {
          ...state.nextIds,
          update: state.nextIds.update + 1,
        },
      },
      updatedNeed,
    ),
    value: updatedNeed,
  };
}

export function requestTechnicalClosure(
  state: RadarState,
  actorPersonId: string,
  input: AddNeedUpdateInput,
): RadarMutation<Need> {
  requirePerson(state, actorPersonId);
  assertRequired(input.description, "Fechamento tecnico exige descricao.");

  const need = requireNeed(state, input.needId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade finalizada nao recebe fechamento tecnico.");
  }

  const update: NeedUpdate = {
    id: formatId("U", state.nextIds.update),
    authorPersonId: actorPersonId,
    description: normalizeText(input.description),
    createdAt: input.now,
    kind: "technicalClosure",
  };
  const updatedNeed: Need = {
    ...need,
    status: "inProgress",
    updates: [...need.updates, update],
    updatedAt: input.now,
  };

  return {
    state: replaceNeed(
      {
        ...state,
        nextIds: {
          ...state.nextIds,
          update: state.nextIds.update + 1,
        },
      },
      updatedNeed,
    ),
    value: updatedNeed,
  };
}

export function resolveNeed(
  state: RadarState,
  actorPersonId: string,
  input: ResolveNeedInput,
): RadarMutation<Need> {
  const actor = requirePerson(state, actorPersonId);

  if (!canResolveNeed(actor.profile)) {
    throw new Error("Somente direcao ou apoio de gestao marca como resolvido.");
  }

  assertRequired(input.resolutionSummary, "Resumo da resolucao e obrigatorio.");

  const need = requireNeed(state, input.needId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade ja finalizada.");
  }

  const updatedNeed: Need = {
    ...need,
    status: "resolved",
    resolutionSummary: normalizeText(input.resolutionSummary),
    resolvedAt: input.now,
    resolvedByPersonId: actorPersonId,
    updatedAt: input.now,
  };

  return {
    state: replaceNeed(state, updatedNeed),
    value: updatedNeed,
  };
}

export function cancelNeed(
  state: RadarState,
  actorPersonId: string,
  input: CancelNeedInput,
): RadarMutation<Need> {
  const actor = requirePerson(state, actorPersonId);

  if (!canCancelOrCorrectNeed(actor.profile)) {
    throw new Error("Somente direcao ou apoio de gestao cancela necessidade.");
  }

  assertRequired(input.cancellationReason, "Motivo do cancelamento e obrigatorio.");

  const need = requireNeed(state, input.needId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade ja finalizada.");
  }

  const updatedNeed: Need = {
    ...need,
    status: "cancelled",
    cancellationReason: normalizeText(input.cancellationReason),
    cancelledAt: input.now,
    cancelledByPersonId: actorPersonId,
    updatedAt: input.now,
  };

  return {
    state: replaceNeed(state, updatedNeed),
    value: updatedNeed,
  };
}

export function addInvolvedPerson(
  state: RadarState,
  actorPersonId: string,
  needId: string,
  personId: string,
): RadarMutation<Need> {
  requirePerson(state, actorPersonId);
  const need = requireNeed(state, needId);
  const person = requirePerson(state, personId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade finalizada nao recebe novo envolvido.");
  }

  if (need.involvedPersonIds.includes(person.id)) {
    throw new Error("Pessoa ja esta marcada como envolvida.");
  }

  const updatedNeed = {
    ...need,
    involvedPersonIds: [...need.involvedPersonIds, person.id],
  };

  return {
    state: replaceNeed(state, updatedNeed),
    value: updatedNeed,
  };
}

export function removeInvolvedPerson(
  state: RadarState,
  actorPersonId: string,
  needId: string,
  personId: string,
): RadarMutation<Need> {
  requirePerson(state, actorPersonId);
  const need = requireNeed(state, needId);

  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade finalizada nao permite remover envolvido.");
  }

  const updatedNeed = {
    ...need,
    involvedPersonIds: need.involvedPersonIds.filter((id) => id !== personId),
  };

  return {
    state: replaceNeed(state, updatedNeed),
    value: updatedNeed,
  };
}

export function createRoleOrFunction(
  existingRoles: RoleOrFunction[],
  name: string,
  now: string,
): RoleOrFunction {
  assertRequired(name, "Cargo ou funcao e obrigatorio.");

  const normalizedName = normalizeText(name);

  if (
    existingRoles.some(
      (role) => role.active && normalizeUsername(role.name) === normalizeUsername(name),
    )
  ) {
    throw new Error("Cargo ou funcao ja existe.");
  }

  return {
    id: formatId("R", existingRoles.length + 1),
    name: normalizedName,
    active: true,
    createdAt: now,
  };
}

export function createActionPlanItem(
  need: Need,
  actorPersonId: string,
  existingItems: ActionPlanItem[],
  input: {
    description: string;
    responsiblePersonId?: string;
    now: string;
  },
): ActionPlanItem {
  if (isFinalNeedStatus(need.status)) {
    throw new Error("Necessidade finalizada nao recebe plano de acao.");
  }

  assertRequired(input.description, "Item do plano de acao e obrigatorio.");

  return {
    id: formatId("A", existingItems.length + 1),
    needId: need.id,
    description: normalizeText(input.description),
    responsiblePersonId: input.responsiblePersonId,
    createdByPersonId: actorPersonId,
    createdAt: input.now,
  };
}

export function completeActionPlanItem(
  item: ActionPlanItem,
  actorPersonId: string,
  now: string,
): ActionPlanItem {
  if (item.completedAt) {
    throw new Error("Item do plano de acao ja foi concluido.");
  }

  return {
    ...item,
    completedAt: now,
    completedByPersonId: actorPersonId,
  };
}

export function createEquipment(
  actorProfile: PersonProfile,
  existingEquipment: Equipment[],
  input: CreateEquipmentInput,
): Equipment {
  if (!canCancelOrCorrectNeed(actorProfile)) {
    throw new Error("Somente gestao cadastra equipamento.");
  }

  assertRequired(input.name, "Nome do equipamento e obrigatorio.");
  assertRequired(input.location, "Local do equipamento e obrigatorio.");
  assertRequired(input.currentState, "Estado atual do equipamento e obrigatorio.");

  const identification = input.identification
    ? normalizeText(input.identification)
    : undefined;

  if (
    identification &&
    existingEquipment.some(
      (equipment) =>
        equipment.active &&
        equipment.identification &&
        normalizeUsername(equipment.identification) ===
          normalizeUsername(identification),
    )
  ) {
    throw new Error("Identificacao do equipamento ja existe.");
  }

  return {
    id: formatId("E", existingEquipment.length + 1),
    name: normalizeText(input.name),
    location: normalizeText(input.location),
    identification,
    currentState: normalizeText(input.currentState),
    active: true,
    createdAt: input.now,
  };
}

export function inactivateEquipment(
  actorProfile: PersonProfile,
  equipment: Equipment,
  now: string,
): Equipment {
  if (!canCancelOrCorrectNeed(actorProfile)) {
    throw new Error("Somente gestao inativa equipamento.");
  }

  return {
    ...equipment,
    active: false,
    inactiveAt: now,
    updatedAt: now,
  };
}

export function createAuditEvent(input: {
  id: string;
  type: AuditEventType;
  actorPersonId: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
  now: string;
}): AuditEvent {
  assertRequired(input.id, "Evento de auditoria exige identificador.");
  assertRequired(input.actorPersonId, "Evento de auditoria exige autor.");
  assertRequired(input.entityType, "Evento de auditoria exige entidade.");
  assertRequired(input.entityId, "Evento de auditoria exige entidade afetada.");
  assertRequired(input.summary, "Evento de auditoria exige resumo.");

  const metadata = input.metadata ?? {};

  assertNoPlainSecret(input.summary, metadata);

  return {
    id: input.id,
    type: input.type,
    actorPersonId: input.actorPersonId,
    entityType: normalizeText(input.entityType),
    entityId: input.entityId,
    summary: normalizeText(input.summary),
    metadata,
    createdAt: input.now,
  };
}

export function createLocalSession(personId: string, now: string): LocalSession {
  assertRequired(personId, "Sessao exige pessoa autenticada.");

  return {
    personId,
    authenticatedAt: now,
    lastActivityAt: now,
  };
}

export function shouldLockSession(
  session: LocalSession,
  now: string,
): boolean {
  if (session.lockedAt) {
    return true;
  }

  const inactiveMilliseconds =
    new Date(now).getTime() - new Date(session.lastActivityAt).getTime();

  return inactiveMilliseconds >= SESSION_INACTIVITY_LIMIT_MINUTES * 60 * 1000;
}

export function markSessionActivity(
  session: LocalSession,
  now: string,
): LocalSession {
  if (session.lockedAt) {
    throw new Error("Sessao bloqueada precisa ser desbloqueada.");
  }

  return {
    ...session,
    lastActivityAt: now,
  };
}

export function lockSession(session: LocalSession, now: string): LocalSession {
  return {
    ...session,
    lockedAt: now,
  };
}

export function canUnlockSession(
  session: LocalSession,
  personId: string,
): boolean {
  return session.personId === personId;
}

export function validateSecurityBackupPackage(
  backupPackage: SecurityBackupPackage,
): SecurityBackupPackage {
  if (backupPackage.formatVersion !== SECURITY_BACKUP_FORMAT_VERSION) {
    throw new Error("Pacote de seguranca com versao invalida.");
  }

  if (backupPackage.restoreMode !== SECURITY_BACKUP_RESTORE_MODE) {
    throw new Error("Restauracao de seguranca sempre substitui tudo.");
  }

  if (backupPackage.plainSecretsDetected?.length) {
    throw new Error("Pacote de seguranca contem segredo em texto claro.");
  }

  for (const tableName of SECURITY_BACKUP_REQUIRED_TABLES) {
    if (!Array.isArray(backupPackage.tables[tableName])) {
      throw new Error(`Pacote de seguranca sem tabela ${tableName}.`);
    }
  }

  assertBackupTablesDoNotExposePlainSecrets(backupPackage.tables);

  return backupPackage;
}

export function findPersonByUsername(
  state: RadarState,
  username: string,
): Person | undefined {
  const normalizedUsername = normalizeUsername(username);

  return state.people.find((person) => person.username === normalizedUsername);
}

export function getPersonName(state: RadarState, personId: string): string {
  return (
    state.people.find((person) => person.id === personId)?.name ??
    "Pessoa nao encontrada"
  );
}

function requirePerson(state: RadarState, personId: string): Person {
  const person = state.people.find(
    (candidate) => candidate.id === personId && candidate.active,
  );

  if (!person) {
    throw new Error("Pessoa ativa nao encontrada.");
  }

  return person;
}

function validateInvolvedPersonIds(
  state: RadarState,
  involvedPersonIds: string[],
): string[] {
  const uniqueIds = dedupe(involvedPersonIds);

  if (uniqueIds.length !== involvedPersonIds.length) {
    throw new Error("Pessoa envolvida nao pode ser marcada duas vezes.");
  }

  for (const personId of uniqueIds) {
    requirePerson(state, personId);
  }

  return uniqueIds;
}

function assertSupportedPriority(priority: NeedPriority): void {
  if (!["low", "medium", "high"].includes(priority)) {
    throw new Error("Prioridade invalida.");
  }
}

function assertSupportedProfile(
  profile: Exclude<PersonProfile, "direction">,
): void {
  if (!["managementSupport", "user"].includes(profile)) {
    throw new Error("Perfil invalido para cadastro de pessoa.");
  }
}

function requireNeed(state: RadarState, needId: string): Need {
  const need = state.needs.find((candidate) => candidate.id === needId);

  if (!need) {
    throw new Error("Necessidade nao encontrada.");
  }

  return need;
}

function replaceNeed(state: RadarState, updatedNeed: Need): RadarState {
  return {
    ...state,
    needs: state.needs.map((need) =>
      need.id === updatedNeed.id ? updatedNeed : need,
    ),
  };
}

function replacePerson(state: RadarState, updatedPerson: Person): RadarState {
  return {
    ...state,
    people: state.people.map((person) =>
      person.id === updatedPerson.id ? updatedPerson : person,
    ),
  };
}

function countActiveManagementSupport(state: RadarState): number {
  return state.people.filter(
    (person) => person.active && person.profile === "managementSupport",
  ).length;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeUsername(value: string): string {
  return normalizeText(value).toLowerCase();
}

function assertRequired(value: string, message: string): void {
  if (!value.trim()) {
    throw new Error(message);
  }
}

function assertNoPlainSecret(
  summary: string,
  metadata: Record<string, string | number | boolean | null>,
): void {
  const suspiciousSummaryValues = [
    /\b123456\b/,
    /\bRE-\d{6}\b/i,
    /(senha|password|token|resposta|answer)\s*[:=]/i,
  ];

  if (suspiciousSummaryValues.some((pattern) => pattern.test(summary))) {
    throw new Error("Auditoria nao deve registrar segredo em texto claro.");
  }

  for (const key of Object.keys(metadata)) {
    if (isPlainSecretKey(key)) {
      throw new Error("Auditoria nao deve registrar segredo em texto claro.");
    }
  }
}

function assertBackupTablesDoNotExposePlainSecrets(
  tables: SecurityBackupPackage["tables"],
): void {
  for (const rows of Object.values(tables)) {
    for (const row of rows ?? []) {
      for (const key of Object.keys(row)) {
        if (isPlainSecretKey(key)) {
          throw new Error("Pacote de seguranca contem segredo em texto claro.");
        }
      }
    }
  }
}

function isPlainSecretKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();

  return (
    ["password", "senha", "token", "secret", "resposta", "answer"].includes(
      normalizedKey,
    ) ||
    normalizedKey.endsWith("_plain") ||
    normalizedKey.endsWith("plaintext")
  );
}

function formatId(prefix: string, value: number): string {
  return `${prefix}-${String(value).padStart(3, "0")}`;
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}
