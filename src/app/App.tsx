import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { PlaygroundMasterDetail } from "../features/playground/PlaygroundMasterDetail";
import { RadarMvpFlow } from "../features/radar/RadarMvpFlow";

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

  if (playgroundStarted) {
    return (
      <main className="app-shell">
        <section className="intro intro--active" aria-labelledby="product-title">
          <p className="eyebrow">OpenEduOps</p>
          <h1 id="product-title">Radar Escola</h1>
          <div className="status-panel" aria-label="Playground">
            <strong>Playground</strong>
            <span>Playground iniciado a partir do menu do aplicativo.</span>
            <button
              className="secondary-action"
              onClick={() => setPlaygroundStarted(false)}
              type="button"
            >
              Voltar ao Radar
            </button>
          </div>
          <PlaygroundMasterDetail />
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <RadarMvpFlow onStartPlayground={() => setPlaygroundStarted(true)} />
    </main>
  );
}
