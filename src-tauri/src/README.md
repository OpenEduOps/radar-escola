# Tauri Runtime

Camada nativa minima.

Estado atual: esta camada ja cria a janela desktop, configura o menu nativo do
Playground, abre a janela maximizada, participa do empacotamento Windows validado
pelo smoke test e expoe comandos SQLite para o playground de referencia.

Responsabilidades:

- inicializar a casca desktop;
- expor comandos Tauri quando houver necessidade real;
- persistir o playground de referencia em SQLite local;
- manter a ponte nativa pequena;
- evitar mover regras de produto para Rust sem justificativa.

Regra atual:

React/TypeScript cuida da experiencia, telas, estado e regras simples. Tauri/Rust
deve permanecer como casca desktop e ponte nativa minima. O SQLite do playground
existe como referencia tecnica para a futura persistencia do fluxo principal.
