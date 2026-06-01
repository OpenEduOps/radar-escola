# Domain

Camada de dominio puro.

Estado atual em `v0.0.1`: o dominio real do MVP ainda nao foi implementado. O
Playground possui regras puras de referencia em `src/features/playground` para
demonstrar o padrao de teste e separacao.

Responsabilidades:

- entidades;
- value objects;
- regras de negocio;
- politicas simples;
- tipos centrais do Radar Escola.

Esta camada deve ser a mais facil de testar. Ela nao deve depender de React,
Tauri, SQLite, arquivos ou APIs externas.
