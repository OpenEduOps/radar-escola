import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

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
          Scaffold tecnico minimo do futuro aplicativo desktop local para
          Windows.
        </p>
        <div className="status-panel" aria-label="Estado do produto">
          <strong>Estado atual</strong>
          <span>
            Este build valida a casca desktop e a esteira de release. O fluxo
            funcional do MVP ainda sera implementado.
          </span>
        </div>
        <div className="status-panel" aria-label="Playground">
          <strong>Playground</strong>
          <span>
            {playgroundStarted
              ? "Playground iniciado a partir do menu do aplicativo."
              : "Use o menu Playground > Iniciar playground para validar o primeiro acionamento nativo."}
          </span>
        </div>
      </section>
    </main>
  );
}
