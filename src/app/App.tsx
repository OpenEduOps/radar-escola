export function App() {
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
      </section>
    </main>
  );
}
