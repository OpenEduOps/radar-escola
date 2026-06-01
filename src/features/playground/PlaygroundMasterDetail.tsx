import { useEffect, useMemo, useState } from "react";
import {
  PLAYGROUND_TABLE_NAME,
  STATUS_PLAYGROUND_TABLE_NAME,
  type PlaygroundRecord,
  playgroundRecords,
  statusPlaygroundRecords,
} from "./playgroundData";
import {
  getStatusName,
  isPlaygroundDraftComplete,
  type PlaygroundDraft,
} from "./playgroundCrud";
import {
  createPlaygroundRepository,
  type PlaygroundSnapshot,
} from "./playgroundRepository";

const initialStatusCode = statusPlaygroundRecords[0]?.codigoStatus ?? "";

function buildEmptyPlaygroundDraft(codigoStatus: string): PlaygroundDraft {
  return {
    nome: "",
    descricao: "",
    codigoStatus,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel acessar a persistencia local do playground.";
}

export function PlaygroundMasterDetail() {
  const repository = useMemo(() => createPlaygroundRepository(), []);
  const [records, setRecords] = useState(playgroundRecords);
  const [statusRecords, setStatusRecords] = useState(statusPlaygroundRecords);
  const [selectedId, setSelectedId] = useState(playgroundRecords[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlaygroundDraft | null>(null);
  const [selectedStatusCode, setSelectedStatusCode] = useState(
    initialStatusCode,
  );
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newPlaygroundDraft, setNewPlaygroundDraft] = useState(
    buildEmptyPlaygroundDraft(initialStatusCode),
  );
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [repositoryError, setRepositoryError] = useState("");
  const selectedRecord =
    records.find((record) => record.id === selectedId) ?? records[0] ?? null;
  const isNewPlaygroundDraftComplete =
    isPlaygroundDraftComplete(newPlaygroundDraft);
  const isEditDraftComplete = draft ? isPlaygroundDraftComplete(draft) : false;
  const isNewStatusNameComplete = Boolean(newStatusName.trim());

  useEffect(() => {
    let isCurrent = true;

    repository
      .load()
      .then((snapshot) => {
        if (!isCurrent) {
          return;
        }

        applySnapshot(snapshot);
        setRepositoryError("");
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return;
        }

        setRepositoryError(getErrorMessage(error));
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [repository]);

  function applySnapshot(
    snapshot: PlaygroundSnapshot,
    preferredSelectedId?: string,
  ) {
    const nextSelectedId =
      preferredSelectedId ??
      (snapshot.playgroundRecords.some((record) => record.id === selectedId)
        ? selectedId
        : snapshot.playgroundRecords[0]?.id ?? "");
    const nextStatusCode = snapshot.statusRecords.some(
      (statusRecord) => statusRecord.codigoStatus === selectedStatusCode,
    )
      ? selectedStatusCode
      : snapshot.statusRecords[0]?.codigoStatus ?? "";

    setRecords(snapshot.playgroundRecords);
    setStatusRecords(snapshot.statusRecords);
    setSelectedId(nextSelectedId);
    setSelectedStatusCode(nextStatusCode);
    setNewPlaygroundDraft((currentDraft) => ({
      ...currentDraft,
      codigoStatus: snapshot.statusRecords.some(
        (statusRecord) => statusRecord.codigoStatus === currentDraft.codigoStatus,
      )
        ? currentDraft.codigoStatus
        : nextStatusCode,
    }));
  }

  function startEditing(record: PlaygroundRecord) {
    setSelectedId(record.id);
    setIsCreateFormOpen(false);
    closeStatusForm();
    setEditingId(record.id);
    setDraft({
      nome: record.nome,
      descricao: record.descricao,
      codigoStatus: record.codigoStatus,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setDraft(null);
  }

  function resetNewPlaygroundDraft() {
    setNewPlaygroundDraft(
      buildEmptyPlaygroundDraft(selectedStatusCode || initialStatusCode),
    );
  }

  function closeStatusForm() {
    setIsStatusFormOpen(false);
    setNewStatusName("");
  }

  function selectRecord(id: string) {
    setSelectedId(id);
    cancelEditing();
    setIsCreateFormOpen(false);
    closeStatusForm();
    resetNewPlaygroundDraft();
  }

  function openCreateForm() {
    cancelEditing();
    closeStatusForm();
    setIsCreateFormOpen(true);
    resetNewPlaygroundDraft();
  }

  function cancelCreateForm() {
    setIsCreateFormOpen(false);
    resetNewPlaygroundDraft();
  }

  async function saveNewPlaygroundRecord() {
    try {
      const result = await repository.createRecord(newPlaygroundDraft);

      if (!result) {
        return;
      }

      applySnapshot(result.snapshot, result.record.id);
      setIsCreateFormOpen(false);
      resetNewPlaygroundDraft();
      setRepositoryError("");
    } catch (error) {
      setRepositoryError(getErrorMessage(error));
    }
  }

  async function deleteRecord(id: string) {
    try {
      const snapshot = await repository.deleteRecord(id);

      applySnapshot(snapshot);

      if (selectedId === id) {
        setSelectedId(snapshot.playgroundRecords[0]?.id ?? "");
      }

      if (editingId === id) {
        cancelEditing();
      }

      setRepositoryError("");
    } catch (error) {
      setRepositoryError(getErrorMessage(error));
    }
  }

  async function saveDraft() {
    if (!draft || !editingId) {
      return;
    }

    if (!isPlaygroundDraftComplete(draft)) {
      return;
    }

    try {
      const result = await repository.updateRecord(editingId, draft);

      if (result) {
        applySnapshot(result.snapshot, result.record.id);
      }

      cancelEditing();
      setRepositoryError("");
    } catch (error) {
      setRepositoryError(getErrorMessage(error));
    }
  }

  async function registerInterfaceStatus() {
    try {
      const result = await repository.registerStatus(newStatusName);

      if (!result) {
        return;
      }

      applySnapshot(result.snapshot);
      setSelectedStatusCode(result.statusRecord.codigoStatus);
      setNewPlaygroundDraft((currentDraft) => ({
        ...currentDraft,
        codigoStatus: result.statusRecord.codigoStatus,
      }));
      setNewStatusName("");
      setIsStatusFormOpen(false);
      setRepositoryError("");
    } catch (error) {
      setRepositoryError(getErrorMessage(error));
    }
  }

  function toggleStatusForm() {
    if (isStatusFormOpen) {
      closeStatusForm();
      return;
    }

    cancelEditing();
    setIsCreateFormOpen(false);
    resetNewPlaygroundDraft();
    setIsStatusFormOpen(true);
  }

  return (
    <section className="playground-shell" aria-labelledby="playground-title">
      <header className="playground-header">
        <div>
          <p className="eyebrow">Playground</p>
          <h2 id="playground-title">Master detalhe</h2>
        </div>
        <div className="table-chips">
          <span className="table-chip">Tabela: {PLAYGROUND_TABLE_NAME}</span>
          <span className="table-chip">
            Tabela: {STATUS_PLAYGROUND_TABLE_NAME}
          </span>
        </div>
      </header>

      {isLoading ? (
        <p className="feedback feedback--success">Carregando dados persistidos.</p>
      ) : null}
      {repositoryError ? (
        <p className="feedback feedback--error" role="alert">
          {repositoryError}
        </p>
      ) : null}

      <div className="playground-toolbar">
        <label htmlFor="playground-interface-status">
          Status playground
        </label>
        <select
          id="playground-interface-status"
          onChange={(event) => {
            setSelectedStatusCode(event.target.value);
            setNewPlaygroundDraft((currentDraft) => ({
              ...currentDraft,
              codigoStatus: event.target.value,
            }));
          }}
          value={selectedStatusCode}
        >
          {statusRecords.map((statusRecord) => (
            <option
              key={statusRecord.codigoStatus}
              value={statusRecord.codigoStatus}
            >
              {statusRecord.nome}
            </option>
          ))}
        </select>
        <span>Selecionado: {getStatusName(statusRecords, selectedStatusCode)}</span>
        <button
          aria-expanded={isCreateFormOpen}
          className="toolbar-action"
          onClick={() =>
            isCreateFormOpen ? cancelCreateForm() : openCreateForm()
          }
          type="button"
        >
          Cadastrar playground
        </button>
        <button
          aria-expanded={isStatusFormOpen}
          className="toolbar-action"
          onClick={toggleStatusForm}
          type="button"
        >
          Cadastrar status
        </button>
        {isStatusFormOpen ? (
          <form
            className="status-registration-form"
            onSubmit={(event) => {
              event.preventDefault();
              registerInterfaceStatus();
            }}
          >
            <label htmlFor="playground-new-status">Nome do status</label>
            <input
              id="playground-new-status"
              onChange={(event) => setNewStatusName(event.target.value)}
              placeholder="Ex.: Status D"
              required
              type="text"
              value={newStatusName}
            />
            <button
              className="primary-action"
              disabled={!isNewStatusNameComplete}
              type="submit"
            >
              Salvar status
            </button>
          </form>
        ) : null}
      </div>

      {isCreateFormOpen ? (
        <form
          className="playground-create-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveNewPlaygroundRecord();
          }}
        >
          <label>
            Nome
            <input
              onChange={(event) =>
                setNewPlaygroundDraft({
                  ...newPlaygroundDraft,
                  nome: event.target.value,
                })
              }
              required
              type="text"
              value={newPlaygroundDraft.nome}
            />
          </label>
          <label>
            Descricao
            <textarea
              onChange={(event) =>
                setNewPlaygroundDraft({
                  ...newPlaygroundDraft,
                  descricao: event.target.value,
                })
              }
              required
              rows={3}
              value={newPlaygroundDraft.descricao}
            />
          </label>
          <label>
            Status
            <select
              onChange={(event) =>
                setNewPlaygroundDraft({
                  ...newPlaygroundDraft,
                  codigoStatus: event.target.value,
                })
              }
              value={newPlaygroundDraft.codigoStatus}
            >
              {statusRecords.map((statusRecord) => (
                <option
                  key={statusRecord.codigoStatus}
                  value={statusRecord.codigoStatus}
                >
                  {statusRecord.nome}
                </option>
              ))}
            </select>
          </label>
          <div className="detail-actions">
            <button
              className="secondary-action"
              onClick={cancelCreateForm}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="primary-action"
              disabled={!isNewPlaygroundDraftComplete}
              type="submit"
            >
              Salvar playground
            </button>
          </div>
        </form>
      ) : null}

      <div className="master-detail-grid">
        <aside
          className="master-list"
          aria-label="Registros playground"
          role="table"
        >
          <div className="master-header" role="row">
            <span role="columnheader">Nome</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Acoes</span>
          </div>
          {records.map((record) => (
            <div
              className="master-row"
              data-selected={record.id === selectedRecord?.id}
              key={record.id}
              role="row"
            >
              <div className="master-cell" role="cell">
                <button
                  className="master-select"
                  onClick={() => selectRecord(record.id)}
                  type="button"
                >
                  {record.nome}
                </button>
              </div>
              <span className="master-status" role="cell">
                {getStatusName(statusRecords, record.codigoStatus)}
              </span>
              <div
                className="row-actions"
                aria-label={`Acoes de ${record.nome}`}
                role="cell"
              >
                <button
                  className="row-action"
                  onClick={() => startEditing(record)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="row-action row-action-danger"
                  onClick={() => deleteRecord(record.id)}
                  type="button"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </aside>

        <article className="detail-panel" aria-label="Detalhe playground">
          {selectedRecord ? (
            <>
              <div className="detail-heading">
                <div>
                  <span className="record-id">{selectedRecord.id}</span>
                  <h3>{selectedRecord.nome}</h3>
                </div>
                <span className="status-badge">
                  {getStatusName(statusRecords, selectedRecord.codigoStatus)}
                </span>
              </div>

              {editingId === selectedRecord.id && draft ? (
                <form
                  className="detail-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveDraft();
                  }}
                >
                  <label>
                    Nome
                    <input
                      onChange={(event) =>
                        setDraft({ ...draft, nome: event.target.value })
                      }
                      required
                      type="text"
                      value={draft.nome}
                    />
                  </label>
                  <label>
                    Descricao
                    <textarea
                      onChange={(event) =>
                        setDraft({ ...draft, descricao: event.target.value })
                      }
                      required
                      rows={4}
                      value={draft.descricao}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          codigoStatus: event.target.value,
                        })
                      }
                      value={draft.codigoStatus}
                    >
                      {statusRecords.map((statusRecord) => (
                        <option
                          key={statusRecord.codigoStatus}
                          value={statusRecord.codigoStatus}
                        >
                          {statusRecord.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="detail-actions">
                    <button
                      className="secondary-action"
                      onClick={cancelEditing}
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      className="primary-action"
                      disabled={!isEditDraftComplete}
                      type="submit"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="detail-fields">
                  <div>
                    <dt>Nome</dt>
                    <dd>{selectedRecord.nome}</dd>
                  </div>
                  <div>
                    <dt>Descricao</dt>
                    <dd>{selectedRecord.descricao}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {getStatusName(statusRecords, selectedRecord.codigoStatus)}
                    </dd>
                  </div>
                  <div>
                    <dt>codigo_status</dt>
                    <dd>{selectedRecord.codigoStatus}</dd>
                  </div>
                </dl>
              )}
            </>
          ) : (
            <div className="empty-detail">
              <h3>Nenhum registro</h3>
              <p>A tabela playground nao possui registros para exibir.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
