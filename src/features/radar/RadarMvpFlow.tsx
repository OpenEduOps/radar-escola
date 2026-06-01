import { useMemo, useState, type FormEvent } from "react";
import {
  TEMPORARY_PASSWORD,
  addNeedUpdate,
  canRegisterPerson,
  canResolveNeed,
  completeFirstAccess,
  configureSchool,
  createEmptyRadarState,
  findPersonByUsername,
  getPersonName,
  getPriorityLabel,
  getStatusLabel,
  registerNeed,
  registerPerson,
  resolveNeed,
  type Need,
  type NeedPriority,
  type Person,
  type PersonProfile,
  type RadarState,
} from "../../domain/radar/radarDomain";
import { generateRecoveryToken, hashSecret } from "../../infrastructure/localHash";
import {
  loadRadarState,
  saveRadarState,
} from "../../infrastructure/localRadarRepository";

interface RadarMvpFlowProps {
  onStartPlayground: () => void;
}

type Feedback = {
  type: "success" | "error";
  message: string;
};

const recoveryQuestions = [
  "Bairro onde cresceu",
  "Apelido de infancia",
  "Nome de uma professora marcante",
  "Cidade onde nasceu",
];

const initialSetupForm = {
  schoolName: "",
  directorName: "",
  username: "",
  password: "",
  recoveryQuestion: recoveryQuestions[0],
  recoveryAnswer: "",
};

const initialLoginForm = {
  username: "",
  password: "",
};

const initialFirstAccessForm = {
  newPassword: "",
  recoveryQuestion: recoveryQuestions[0],
  recoveryAnswer: "",
};

const initialPersonForm = {
  name: "",
  username: "",
  roleName: "",
  profile: "user" as Exclude<PersonProfile, "direction">,
};

const initialNeedForm = {
  title: "",
  description: "",
  location: "",
  priority: "medium" as NeedPriority,
  involvedPersonIds: [] as string[],
};

const priorityOptions: Array<{ value: NeedPriority; label: string }> = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const profileOptions: Array<{
  value: Exclude<PersonProfile, "direction">;
  label: string;
}> = [
  { value: "user", label: "Usuario comum" },
  { value: "managementSupport", label: "Apoio de gestao" },
];

export function RadarMvpFlow({ onStartPlayground }: RadarMvpFlowProps) {
  const [state, setState] = useState<RadarState>(
    () => loadRadarState() ?? createEmptyRadarState(),
  );
  const [currentPersonId, setCurrentPersonId] = useState<string | null>(null);
  const [pendingFirstAccessPersonId, setPendingFirstAccessPersonId] = useState<
    string | null
  >(null);
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [setupRecoveryToken] = useState(generateRecoveryToken);
  const [firstAccessRecoveryToken, setFirstAccessRecoveryToken] = useState(
    generateRecoveryToken,
  );
  const [setupForm, setSetupForm] = useState(initialSetupForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [firstAccessForm, setFirstAccessForm] = useState(initialFirstAccessForm);
  const [personForm, setPersonForm] = useState(initialPersonForm);
  const [needForm, setNeedForm] = useState(initialNeedForm);
  const [updateDescription, setUpdateDescription] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");

  const currentPerson = findPerson(state, currentPersonId);
  const pendingFirstAccessPerson = findPerson(state, pendingFirstAccessPersonId);
  const selectedNeed =
    state.needs.find((need) => need.id === selectedNeedId) ??
    state.needs[0] ??
    null;
  const activePeople = useMemo(
    () => state.people.filter((person) => person.active),
    [state.people],
  );

  function persist(nextState: RadarState) {
    setState(nextState);
    saveRadarState(nextState);
  }

  function showSuccess(message: string) {
    setFeedback({ type: "success", message });
  }

  function showError(error: unknown) {
    setFeedback({
      type: "error",
      message: error instanceof Error ? error.message : "Acao nao concluida.",
    });
  }

  async function handleSetupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = configureSchool({
        schoolName: setupForm.schoolName,
        directorName: setupForm.directorName,
        username: setupForm.username,
        passwordHash: await hashSecret(setupForm.password),
        recoveryTokenHash: await hashSecret(setupRecoveryToken),
        recoveryQuestion: setupForm.recoveryQuestion,
        recoveryAnswerHash: await hashSecret(setupForm.recoveryAnswer),
        now: new Date().toISOString(),
      });

      persist(result.state);
      setCurrentPersonId(result.state.school?.directorPersonId ?? null);
      setSetupForm(initialSetupForm);
      showSuccess("Escola configurada. O Radar de Necessidades ja pode ser usado.");
    } catch (error) {
      showError(error);
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const person = findPersonByUsername(state, loginForm.username);

      if (!person || !person.active) {
        throw new Error("Usuario ou senha invalidos.");
      }

      const passwordHash = await hashSecret(loginForm.password);

      if (person.passwordHash !== passwordHash) {
        throw new Error("Usuario ou senha invalidos.");
      }

      setLoginForm(initialLoginForm);

      if (person.mustChangePassword) {
        setFirstAccessRecoveryToken(generateRecoveryToken());
        setPendingFirstAccessPersonId(person.id);
        setCurrentPersonId(null);
        showSuccess("Complete o primeiro acesso em privacidade.");
        return;
      }

      setCurrentPersonId(person.id);
      showSuccess("Entrada realizada.");
    } catch (error) {
      showError(error);
    }
  }

  async function handleFirstAccessSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!pendingFirstAccessPerson) {
        throw new Error("Pessoa do primeiro acesso nao encontrada.");
      }

      if (firstAccessForm.newPassword.trim() === TEMPORARY_PASSWORD) {
        throw new Error("Escolha uma senha diferente da senha temporaria.");
      }

      const result = completeFirstAccess(state, pendingFirstAccessPerson.id, {
        newPasswordHash: await hashSecret(firstAccessForm.newPassword),
        recoveryTokenHash: await hashSecret(firstAccessRecoveryToken),
        recoveryQuestion: firstAccessForm.recoveryQuestion,
        recoveryAnswerHash: await hashSecret(firstAccessForm.recoveryAnswer),
        now: new Date().toISOString(),
      });

      persist(result.state);
      setCurrentPersonId(result.value.id);
      setPendingFirstAccessPersonId(null);
      setFirstAccessForm(initialFirstAccessForm);
      showSuccess("Primeiro acesso concluido. Guarde o token em local seguro.");
    } catch (error) {
      showError(error);
    }
  }

  async function handlePersonSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPerson) {
      return;
    }

    try {
      const result = registerPerson(state, currentPerson.id, {
        ...personForm,
        temporaryPasswordHash: await hashSecret(TEMPORARY_PASSWORD),
        now: new Date().toISOString(),
      });

      persist(result.state);
      setPersonForm(initialPersonForm);
      showSuccess(
        `Pessoa cadastrada com senha temporaria ${TEMPORARY_PASSWORD}.`,
      );
    } catch (error) {
      showError(error);
    }
  }

  function handleNeedSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPerson) {
      return;
    }

    try {
      if (needForm.involvedPersonIds.length === 0) {
        throw new Error("Marque pelo menos uma pessoa envolvida.");
      }

      const result = registerNeed(state, currentPerson.id, {
        ...needForm,
        now: new Date().toISOString(),
      });

      persist(result.state);
      setSelectedNeedId(result.value.id);
      setNeedForm(initialNeedForm);
      showSuccess("Necessidade registrada no Radar.");
    } catch (error) {
      showError(error);
    }
  }

  function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPerson || !selectedNeed) {
      return;
    }

    try {
      const result = addNeedUpdate(state, currentPerson.id, {
        needId: selectedNeed.id,
        description: updateDescription,
        now: new Date().toISOString(),
      });

      persist(result.state);
      setSelectedNeedId(result.value.id);
      setUpdateDescription("");
      showSuccess("Andamento registrado.");
    } catch (error) {
      showError(error);
    }
  }

  function handleResolveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPerson || !selectedNeed) {
      return;
    }

    try {
      const result = resolveNeed(state, currentPerson.id, {
        needId: selectedNeed.id,
        resolutionSummary,
        now: new Date().toISOString(),
      });

      persist(result.state);
      setSelectedNeedId(result.value.id);
      setResolutionSummary("");
      showSuccess("Necessidade marcada como resolvida.");
    } catch (error) {
      showError(error);
    }
  }

  function logout() {
    setCurrentPersonId(null);
    setPendingFirstAccessPersonId(null);
    setFeedback(null);
  }

  if (!state.school) {
    return (
      <section className="radar-shell" aria-labelledby="setup-title">
        <RadarHero onStartPlayground={onStartPlayground} />
        <form className="radar-card radar-form" onSubmit={handleSetupSubmit}>
          <div>
            <p className="eyebrow">Primeiro uso</p>
            <h2 id="setup-title">Configurar escola</h2>
            <p className="radar-note">
              A direcao cria o primeiro acesso e deve guardar o token abaixo em
              local seguro.
            </p>
          </div>
          <label>
            Nome da escola
            <input
              onChange={(event) =>
                setSetupForm({ ...setupForm, schoolName: event.target.value })
              }
              required
              type="text"
              value={setupForm.schoolName}
            />
          </label>
          <label>
            Nome da direcao
            <input
              onChange={(event) =>
                setSetupForm({ ...setupForm, directorName: event.target.value })
              }
              required
              type="text"
              value={setupForm.directorName}
            />
          </label>
          <div className="radar-form-grid">
            <label>
              Usuario da direcao
              <input
                autoCapitalize="none"
                onChange={(event) =>
                  setSetupForm({ ...setupForm, username: event.target.value })
                }
                required
                type="text"
                value={setupForm.username}
              />
            </label>
            <label>
              Senha da direcao
              <input
                onChange={(event) =>
                  setSetupForm({ ...setupForm, password: event.target.value })
                }
                required
                type="password"
                value={setupForm.password}
              />
            </label>
          </div>
          <div className="radar-form-grid">
            <label>
              Pergunta de recuperacao
              <select
                onChange={(event) =>
                  setSetupForm({
                    ...setupForm,
                    recoveryQuestion: event.target.value,
                  })
                }
                value={setupForm.recoveryQuestion}
              >
                {recoveryQuestions.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Resposta de recuperacao
              <input
                onChange={(event) =>
                  setSetupForm({
                    ...setupForm,
                    recoveryAnswer: event.target.value,
                  })
                }
                required
                type="text"
                value={setupForm.recoveryAnswer}
              />
            </label>
          </div>
          <div className="secret-panel">
            <span>Token de recuperacao da direcao</span>
            <strong>{setupRecoveryToken}</strong>
          </div>
          {feedback ? <FeedbackMessage feedback={feedback} /> : null}
          <button className="primary-action" type="submit">
            Configurar escola
          </button>
        </form>
      </section>
    );
  }

  if (pendingFirstAccessPerson) {
    return (
      <section className="radar-shell" aria-labelledby="first-access-title">
        <RadarHero onStartPlayground={onStartPlayground} />
        <form
          className="radar-card radar-form"
          onSubmit={handleFirstAccessSubmit}
        >
          <div>
            <p className="eyebrow">Primeiro acesso</p>
            <h2 id="first-access-title">{pendingFirstAccessPerson.name}</h2>
            <p className="radar-note">
              Faca esta etapa sem a presenca de outra pessoa. A senha, a resposta
              e o token sao pessoais.
            </p>
          </div>
          <label>
            Nova senha
            <input
              onChange={(event) =>
                setFirstAccessForm({
                  ...firstAccessForm,
                  newPassword: event.target.value,
                })
              }
              required
              type="password"
              value={firstAccessForm.newPassword}
            />
          </label>
          <div className="radar-form-grid">
            <label>
              Pergunta de recuperacao
              <select
                onChange={(event) =>
                  setFirstAccessForm({
                    ...firstAccessForm,
                    recoveryQuestion: event.target.value,
                  })
                }
                value={firstAccessForm.recoveryQuestion}
              >
                {recoveryQuestions.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Resposta de recuperacao
              <input
                onChange={(event) =>
                  setFirstAccessForm({
                    ...firstAccessForm,
                    recoveryAnswer: event.target.value,
                  })
                }
                required
                type="text"
                value={firstAccessForm.recoveryAnswer}
              />
            </label>
          </div>
          <div className="secret-panel">
            <span>Token pessoal de recuperacao</span>
            <strong>{firstAccessRecoveryToken}</strong>
          </div>
          {feedback ? <FeedbackMessage feedback={feedback} /> : null}
          <button className="primary-action" type="submit">
            Concluir primeiro acesso
          </button>
        </form>
      </section>
    );
  }

  if (!currentPerson) {
    return (
      <section className="radar-shell" aria-labelledby="login-title">
        <RadarHero onStartPlayground={onStartPlayground} />
        <form className="radar-card radar-form" onSubmit={handleLoginSubmit}>
          <div>
            <p className="eyebrow">{state.school.name}</p>
            <h2 id="login-title">Entrar no Radar Escola</h2>
          </div>
          <label>
            Usuario
            <input
              autoCapitalize="none"
              onChange={(event) =>
                setLoginForm({ ...loginForm, username: event.target.value })
              }
              required
              type="text"
              value={loginForm.username}
            />
          </label>
          <label>
            Senha
            <input
              onChange={(event) =>
                setLoginForm({ ...loginForm, password: event.target.value })
              }
              required
              type="password"
              value={loginForm.password}
            />
          </label>
          {feedback ? <FeedbackMessage feedback={feedback} /> : null}
          <button className="primary-action" type="submit">
            Entrar
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="radar-shell" aria-labelledby="radar-title">
      <RadarHero onStartPlayground={onStartPlayground} />
      <header className="radar-session">
        <div>
          <p className="eyebrow">{state.school.name}</p>
          <h2 id="radar-title">Radar de Necessidades</h2>
          <p className="radar-note">
            {currentPerson.name} - {currentPerson.roleName}
          </p>
        </div>
        <button className="secondary-action" onClick={logout} type="button">
          Sair
        </button>
      </header>
      {feedback ? <FeedbackMessage feedback={feedback} /> : null}

      <div className="radar-workspace">
        <section className="radar-card radar-form" aria-labelledby="people-title">
          <div>
            <p className="eyebrow">Equipe</p>
            <h3 id="people-title">Cadastrar pessoa</h3>
            <p className="radar-note">
              Senha temporaria: {TEMPORARY_PASSWORD}. A pessoa troca no primeiro
              acesso.
            </p>
          </div>
          {canRegisterPerson(currentPerson.profile) ? (
            <form className="radar-form" onSubmit={handlePersonSubmit}>
              <label>
                Nome da pessoa
                <input
                  onChange={(event) =>
                    setPersonForm({ ...personForm, name: event.target.value })
                  }
                  required
                  type="text"
                  value={personForm.name}
                />
              </label>
              <div className="radar-form-grid">
                <label>
                  Usuario da pessoa
                  <input
                    autoCapitalize="none"
                    onChange={(event) =>
                      setPersonForm({
                        ...personForm,
                        username: event.target.value,
                      })
                    }
                    required
                    type="text"
                    value={personForm.username}
                  />
                </label>
                <label>
                  Cargo ou funcao
                  <input
                    onChange={(event) =>
                      setPersonForm({
                        ...personForm,
                        roleName: event.target.value,
                      })
                    }
                    required
                    type="text"
                    value={personForm.roleName}
                  />
                </label>
              </div>
              <label>
                Perfil
                <select
                  onChange={(event) =>
                    setPersonForm({
                      ...personForm,
                      profile: event.target.value as Exclude<
                        PersonProfile,
                        "direction"
                      >,
                    })
                  }
                  value={personForm.profile}
                >
                  {profileOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-action" type="submit">
                Cadastrar pessoa
              </button>
            </form>
          ) : (
            <p className="guardrail-note">
              Cadastro de pessoas fica com a direcao ou apoio de gestao.
            </p>
          )}
        </section>

        <section className="radar-card radar-form" aria-labelledby="need-title">
          <div>
            <p className="eyebrow">Necessidade</p>
            <h3 id="need-title">Registrar necessidade</h3>
          </div>
          <form className="radar-form" onSubmit={handleNeedSubmit}>
            <label>
              Titulo da necessidade
              <input
                onChange={(event) =>
                  setNeedForm({ ...needForm, title: event.target.value })
                }
                required
                type="text"
                value={needForm.title}
              />
            </label>
            <label>
              Descricao da necessidade
              <textarea
                onChange={(event) =>
                  setNeedForm({ ...needForm, description: event.target.value })
                }
                required
                rows={3}
                value={needForm.description}
              />
            </label>
            <div className="radar-form-grid">
              <label>
                Local
                <input
                  onChange={(event) =>
                    setNeedForm({ ...needForm, location: event.target.value })
                  }
                  required
                  type="text"
                  value={needForm.location}
                />
              </label>
              <label>
                Prioridade
                <select
                  onChange={(event) =>
                    setNeedForm({
                      ...needForm,
                      priority: event.target.value as NeedPriority,
                    })
                  }
                  value={needForm.priority}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset className="checkbox-group">
              <legend>Marcar envolvidos</legend>
              {activePeople.map((person) => (
                <label className="check-row" key={person.id}>
                  <input
                    aria-label={`Envolver ${person.name}`}
                    checked={needForm.involvedPersonIds.includes(person.id)}
                    onChange={(event) => {
                      const involvedPersonIds = event.target.checked
                        ? [...needForm.involvedPersonIds, person.id]
                        : needForm.involvedPersonIds.filter(
                            (personId) => personId !== person.id,
                          );

                      setNeedForm({ ...needForm, involvedPersonIds });
                    }}
                    type="checkbox"
                  />
                  <span>
                    {person.name}
                    <small>{person.roleName}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <button className="primary-action" type="submit">
              Registrar necessidade
            </button>
          </form>
        </section>
      </div>

      <section className="radar-board" aria-label="Necessidades cadastradas">
        <aside className="need-list">
          <header className="need-list-header">
            <h3>Veja o que sua escola precisa resolver</h3>
            <span>{state.needs.length} registros</span>
          </header>
          {state.needs.length === 0 ? (
            <p className="empty-state">Nenhuma necessidade registrada ainda.</p>
          ) : (
            state.needs.map((need) => (
              <button
                className="need-row"
                data-selected={need.id === selectedNeed?.id}
                key={need.id}
                onClick={() => setSelectedNeedId(need.id)}
                type="button"
              >
                <span>{need.title}</span>
                <small>
                  {getStatusLabel(need.status)} - {getPriorityLabel(need.priority)}
                </small>
              </button>
            ))
          )}
        </aside>

        <NeedDetail
          currentPerson={currentPerson}
          need={selectedNeed}
          onResolveSubmit={handleResolveSubmit}
          onUpdateSubmit={handleUpdateSubmit}
          resolutionSummary={resolutionSummary}
          setResolutionSummary={setResolutionSummary}
          setUpdateDescription={setUpdateDescription}
          state={state}
          updateDescription={updateDescription}
        />
      </section>
    </section>
  );
}

function RadarHero({ onStartPlayground }: RadarMvpFlowProps) {
  return (
    <section className="radar-hero" aria-label="Estado do produto">
      <div>
        <p className="eyebrow">OpenEduOps</p>
        <h1>Radar Escola</h1>
        <p className="summary">Veja o que sua escola precisa resolver.</p>
      </div>
      <button className="playground-button" onClick={onStartPlayground} type="button">
        Iniciar playground
      </button>
    </section>
  );
}

function NeedDetail({
  currentPerson,
  need,
  onResolveSubmit,
  onUpdateSubmit,
  resolutionSummary,
  setResolutionSummary,
  setUpdateDescription,
  state,
  updateDescription,
}: {
  currentPerson: Person;
  need: Need | null;
  onResolveSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resolutionSummary: string;
  setResolutionSummary: (value: string) => void;
  setUpdateDescription: (value: string) => void;
  state: RadarState;
  updateDescription: string;
}) {
  if (!need) {
    return (
      <article className="need-detail">
        <div className="empty-detail">
          <h3>Nenhuma necessidade selecionada</h3>
          <p>Registre uma necessidade para iniciar o acompanhamento.</p>
        </div>
      </article>
    );
  }

  const canResolveSelectedNeed =
    need.status !== "resolved" && canResolveNeed(currentPerson.profile);
  const canUpdateSelectedNeed = need.status !== "resolved";

  return (
    <article className="need-detail" aria-label="Detalhe da necessidade">
      <header className="detail-heading">
        <div>
          <span className="record-id">{need.id}</span>
          <h3>{need.title}</h3>
        </div>
        <span className="status-badge">{getStatusLabel(need.status)}</span>
      </header>
      <dl className="detail-fields">
        <div>
          <dt>Descricao</dt>
          <dd>{need.description}</dd>
        </div>
        <div>
          <dt>Local</dt>
          <dd>{need.location}</dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd>{getPriorityLabel(need.priority)}</dd>
        </div>
        <div>
          <dt>Envolvidos</dt>
          <dd>{formatInvolvedPeople(state, need.involvedPersonIds)}</dd>
        </div>
      </dl>

      <section className="updates-panel" aria-label="Andamentos">
        <h4>Andamento conjunto</h4>
        {need.updates.length === 0 ? (
          <p className="empty-state">Nenhum andamento registrado.</p>
        ) : (
          <ul>
            {need.updates.map((update) => (
              <li key={update.id}>
                <strong>{getPersonName(state, update.authorPersonId)}</strong>
                <span>{update.description}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canUpdateSelectedNeed ? (
        <form className="detail-form" onSubmit={onUpdateSubmit}>
          <label>
            Atualizacao de andamento
            <textarea
              onChange={(event) => setUpdateDescription(event.target.value)}
              required
              rows={3}
              value={updateDescription}
            />
          </label>
          <button className="secondary-action" type="submit">
            Registrar andamento
          </button>
        </form>
      ) : null}

      {canResolveSelectedNeed ? (
        <form className="detail-form" onSubmit={onResolveSubmit}>
          <label>
            Resumo da resolucao
            <textarea
              onChange={(event) => setResolutionSummary(event.target.value)}
              required
              rows={3}
              value={resolutionSummary}
            />
          </label>
          <button className="primary-action" type="submit">
            Marcar como resolvido
          </button>
        </form>
      ) : null}

      {!canResolveNeed(currentPerson.profile) ? (
        <p className="guardrail-note">
          Somente direcao ou apoio de gestao marca uma necessidade como
          resolvida.
        </p>
      ) : null}

      {need.status === "resolved" ? (
        <p className="guardrail-note">
          Resolvida por {getPersonName(state, need.resolvedByPersonId ?? "")}:{" "}
          {need.resolutionSummary}
        </p>
      ) : null}
    </article>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  return (
    <p className={`feedback feedback--${feedback.type}`} role="alert">
      {feedback.message}
    </p>
  );
}

function findPerson(state: RadarState, personId: string | null): Person | null {
  if (!personId) {
    return null;
  }

  return state.people.find((person) => person.id === personId) ?? null;
}

function formatInvolvedPeople(state: RadarState, involvedPersonIds: string[]) {
  if (involvedPersonIds.length === 0) {
    return "Sem envolvidos marcados.";
  }

  return involvedPersonIds
    .map((personId) => getPersonName(state, personId))
    .join(", ");
}
