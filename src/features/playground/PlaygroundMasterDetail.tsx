import { useState } from "react";
import {
  PLAYGROUND_TABLE_NAME,
  type PlaygroundRecord,
  playgroundRecords,
} from "./playgroundData";

const statusLabels: Record<PlaygroundRecord["status"], string> = {
  rascunho: "Rascunho",
  em_validacao: "Em validacao",
  pronto: "Pronto",
};

export function PlaygroundMasterDetail() {
  const [selectedId, setSelectedId] = useState(playgroundRecords[0]?.id);
  const selectedRecord =
    playgroundRecords.find((record) => record.id === selectedId) ??
    playgroundRecords[0];

  return (
    <section className="playground-shell" aria-labelledby="playground-title">
      <header className="playground-header">
        <div>
          <p className="eyebrow">Playground</p>
          <h2 id="playground-title">Master detalhe</h2>
        </div>
        <span className="table-chip">Tabela: {PLAYGROUND_TABLE_NAME}</span>
      </header>

      <div className="master-detail-grid">
        <aside className="master-list" aria-label="Registros playground">
          {playgroundRecords.map((record) => (
            <button
              className="master-row"
              data-selected={record.id === selectedRecord.id}
              key={record.id}
              onClick={() => setSelectedId(record.id)}
              type="button"
            >
              <span>{record.nome}</span>
              <small>
                {record.id} - {statusLabels[record.status]}
              </small>
            </button>
          ))}
        </aside>

        <article className="detail-panel" aria-label="Detalhe playground">
          <div className="detail-heading">
            <div>
              <span className="record-id">{selectedRecord.id}</span>
              <h3>{selectedRecord.nome}</h3>
            </div>
            <span className="status-badge">
              {statusLabels[selectedRecord.status]}
            </span>
          </div>

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
        </article>
      </div>
    </section>
  );
}
