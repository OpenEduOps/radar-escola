import { useState } from "react";
import {
  PLAYGROUND_TABLE_NAME,
  STATUS_PLAYGROUND_TABLE_NAME,
  type PlaygroundRecord,
  type StatusPlaygroundRecord,
  playgroundRecords,
  statusPlaygroundRecords,
} from "./playgroundData";

type PlaygroundDraft = Pick<
  PlaygroundRecord,
  "nome" | "descricao" | "codigoStatus"
>;

export function PlaygroundMasterDetail() {
  const [records, setRecords] = useState(playgroundRecords);
  const [statusRecords, setStatusRecords] = useState(statusPlaygroundRecords);
  const [selectedId, setSelectedId] = useState(playgroundRecords[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlaygroundDraft | null>(null);
  const [selectedStatusCode, setSelectedStatusCode] = useState(
    statusPlaygroundRecords[0]?.codigoStatus ?? "",
  );
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const selectedRecord =
    records.find((record) => record.id === selectedId) ?? records[0] ?? null;

  function getStatusName(codigoStatus: string) {
    return (
      statusRecords.find(
        (statusRecord) => statusRecord.codigoStatus === codigoStatus,
      )
        ?.nome ?? "Status nao encontrado"
    );
  }

  function startEditing(record: PlaygroundRecord) {
    setSelectedId(record.id);
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

  function deleteRecord(id: string) {
    const nextRecords = records.filter((record) => record.id !== id);

    setRecords(nextRecords);

    if (selectedId === id) {
      setSelectedId(nextRecords[0]?.id ?? "");
    }

    if (editingId === id) {
      cancelEditing();
    }
  }

  function saveDraft() {
    if (!draft || !editingId) {
      return;
    }

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === editingId
          ? {
              ...record,
              nome: draft.nome.trim(),
              descricao: draft.descricao.trim(),
              codigoStatus: draft.codigoStatus,
            }
          : record,
      ),
    );
    cancelEditing();
  }

  function registerInterfaceStatus() {
    const normalizedStatusName = newStatusName.trim();

    if (!normalizedStatusName) {
      return;
    }

    const existingStatus = statusRecords.find(
      (statusRecord) =>
        statusRecord.nome.toLocaleLowerCase() ===
        normalizedStatusName.toLocaleLowerCase(),
    );
    const statusToSelect =
      existingStatus ??
      ({
        codigoStatus: `SP-${String(statusRecords.length + 1).padStart(3, "0")}`,
        nome: normalizedStatusName,
      } satisfies StatusPlaygroundRecord);

    if (!existingStatus) {
      setStatusRecords((currentStatusRecords) => [
        ...currentStatusRecords,
        statusToSelect,
      ]);
    }

    setSelectedStatusCode(statusToSelect.codigoStatus);
    setNewStatusName("");
    setIsStatusFormOpen(false);
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

      <div className="playground-toolbar">
        <label htmlFor="playground-interface-status">
          Status playground
        </label>
        <select
          id="playground-interface-status"
          onChange={(event) => setSelectedStatusCode(event.target.value)}
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
        <span>Selecionado: {getStatusName(selectedStatusCode)}</span>
        <button
          aria-expanded={isStatusFormOpen}
          className="toolbar-action"
          onClick={() => setIsStatusFormOpen((isOpen) => !isOpen)}
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
              type="text"
              value={newStatusName}
            />
            <button className="primary-action" type="submit">
              Salvar status
            </button>
          </form>
        ) : null}
      </div>

      <div className="master-detail-grid">
        <aside className="master-list" aria-label="Registros playground">
          {records.map((record) => (
            <div
              className="master-row"
              data-selected={record.id === selectedRecord?.id}
              key={record.id}
            >
              <button
                className="master-select"
                onClick={() => setSelectedId(record.id)}
                type="button"
              >
                <span>{record.nome}</span>
                <small>
                  {record.id} - {getStatusName(record.codigoStatus)}
                </small>
              </button>
              <div className="row-actions" aria-label={`Acoes de ${record.nome}`}>
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
                  {getStatusName(selectedRecord.codigoStatus)}
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
                    <button className="primary-action" type="submit">
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
                    <dd>{getStatusName(selectedRecord.codigoStatus)}</dd>
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
