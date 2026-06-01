# Tauri Runtime

Camada nativa minima.

Estado atual em `v0.0.1`: esta camada ja cria a janela desktop, configura o menu
nativo do Playground, abre a janela maximizada e participa do empacotamento
Windows validado pelo smoke test. Ela ainda nao contem comandos de dominio do
MVP.

Responsabilidades:

- inicializar a casca desktop;
- expor comandos Tauri quando houver necessidade real;
- manter a ponte nativa pequena;
- evitar mover regras de produto para Rust sem justificativa.

Regra atual:

React/TypeScript cuida da experiencia, telas, estado e regras simples. Tauri/Rust
deve permanecer como casca desktop e ponte nativa minima.
