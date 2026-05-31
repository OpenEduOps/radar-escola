# Tauri Runtime

Camada nativa minima.

Responsabilidades:

- inicializar a casca desktop;
- expor comandos Tauri quando houver necessidade real;
- manter a ponte nativa pequena;
- evitar mover regras de produto para Rust sem justificativa.

Regra atual:

React/TypeScript cuida da experiencia, telas, estado e regras simples. Tauri/Rust
deve permanecer como casca desktop e ponte nativa minima.
