import { useState } from "react";
import {
  PLAYGROUND_TABLE_NAME,
  type PlaygroundRecord,
  playgroundRecords,
} from "./playgroundData";

type PlaygroundDraft = Pick<PlaygroundRecord, "nome" | "descricao" | "status">;

const defaultInterfaceStatusOptions = [
  "Status A",
  "Status B",
  "Status C",
];

const statusLabels: Record<PlaygroundRecord["status"], string> = {
  rascunho: "Rascunho",
  em_validacao: "Em validacao",
  pronto: "Pronto",
};

export function PlaygroundMasterDetail() {
  const [records, setRecords] = useState(playgroundRecords);
  const [selectedId, setSelectedId] = useState(playgroundRecords[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlaygroundDraft | null>(null);
  const [interfaceStatusOptions, setInterfaceStatusOptions] = useState(
    defaultInterfaceStatusOptions,
  );
  const [interfaceStatus, setInterfaceStatus] = useState(
    defaultInterfaceStatusOptions[0] ?? "",
  );
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const selectedRecord =
    records.find((record) => record.id === selectedId) ?? records[0] ?? null;

  function startEditing(record: PlaygroundRecord) {
    setSelectedId(record.id);
    setEditingId(record.id);
    setDraft({
      nome: record.nome,
      descricao: record.descricao,
      status: record.status,
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
              status: draft.status,
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

    const existingStatus = interfaceStatusOptions.find(
      (option) =>
        option.toLocaleLowerCase() === normalizedStatusName.toLocaleLowerCase(),
    );
    const statusToSelect = existingStatus ?? normalizedStatusName;

    if (!existingStatus) {
      setInterfaceStatusOptions((currentOptions) => [
        ...currentOptions,
        normalizedStatusName,
      ]);
    }

    setInterfaceStatus(statusToSelect);
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
        <span className="table-chip">Tabela: {PLAYGROUND_TABLE_NAME}</span>
      </header>

      <div className="playground-toolbar">
        <label htmlFor="playground-interface-status">
          Status da interface
        </label>
        <select
          id="playground-interface-status"
          onChange={(event) => setInterfaceStatus(event.target.value)}
          value={interfaceStatus}
        >
          {interfaceStatusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>Selecionado: {interfaceStatus}</span>
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
                  {record.id} - {statusLabels[record.status]}
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
                  {statusLabels[selectedRecord.status]}
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
                          status: event.target
                            .value as PlaygroundRecord["status"],
                        })
                      }
                      value={draft.status}
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="em_validacao">Em validacao</option>
                      <option value="pronto">Pronto</option>
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
                    <dd>{statusLabels[selectedRecord.status]}</dd>
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
