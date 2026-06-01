export const TEMPORARY_PASSWORD = "123456";

export type PersonProfile = "direction" | "managementSupport" | "user";
export type NeedPriority = "low" | "medium" | "high";
export type NeedStatus = "registered" | "inProgress" | "resolved";

export interface School {
  id: string;
  name: string;
  directorPersonId: string;
  createdAt: string;
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

export function canResolveNeed(profile: PersonProfile): boolean {
  return profile === "direction" || profile === "managementSupport";
}

export function canExportSecurityData(profile: PersonProfile): boolean {
  return profile === "direction";
}

export function canViewAudit(profile: PersonProfile): boolean {
  return profile === "direction";
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
  };

  return labels[status];
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

  const activeInvolvedIds = dedupe(input.involvedPersonIds).filter((personId) =>
    state.people.some((person) => person.id === personId && person.active),
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

  if (need.status === "resolved") {
    throw new Error("Necessidade resolvida nao recebe novo andamento.");
  }

  const update: NeedUpdate = {
    id: formatId("U", state.nextIds.update),
    authorPersonId: actorPersonId,
    description: normalizeText(input.description),
    createdAt: input.now,
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

  if (need.status === "resolved") {
    throw new Error("Necessidade ja resolvida.");
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

function formatId(prefix: string, value: number): string {
  return `${prefix}-${String(value).padStart(3, "0")}`;
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}
