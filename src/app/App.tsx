import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { PlaygroundMasterDetail } from "../features/playground/PlaygroundMasterDetail";

export function App() {
  const [playgroundStarted, setPlaygroundStarted] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen("playground-started", () => {
      setPlaygroundStarted(true);
    })
      .then((cleanup) => {
        unlisten = cleanup;
      })
      .catch(() => {
        // Browser-only builds do not expose the Tauri event bridge.
      });

    return () => {
      unlisten?.();
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="product-title">
        <p className="eyebrow">OpenEduOps</p>
        <h1 id="product-title">Radar Escola</h1>
        <p className="summary">
          Aplicativo desktop local para validar o Radar Escola no Windows.
        </p>
        {!playgroundStarted ? (
          <div className="status-panel" aria-label="Estado do produto">
            <strong>Estado atual</strong>
            <span>
              Este build valida a casca desktop, o instalador e o playground de
              referencia. O MVP funcional ainda sera implementado.
            </span>
          </div>
        ) : null}
        <div className="status-panel" aria-label="Playground">
          <strong>Playground</strong>
          <span>
            {playgroundStarted
              ? "Playground iniciado a partir do menu do aplicativo."
              : "Use o menu Playground > Iniciar playground ou o botao abaixo para abrir o CRUD de referencia."}
          </span>
          {!playgroundStarted ? (
            <button
              className="playground-button"
              onClick={() => setPlaygroundStarted(true)}
              type="button"
            >
              Iniciar playground
            </button>
          ) : null}
        </div>
        {playgroundStarted ? <PlaygroundMasterDetail /> : null}
      </section>
    </main>
  );
}
