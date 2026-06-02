# Infrastructure

Camada de detalhes tecnicos.

Estado atual: esta camada contem o repositorio do Radar, com SQLite/Tauri como
fonte principal no desktop e `localStorage` apenas como fallback para navegador
de desenvolvimento e E2E web. O repositório frontend do playground tambem
conversa com comandos Tauri quando roda no desktop.

Responsabilidades:

- SQLite;
- sistema de arquivos;
- ponte Tauri;
- relogio;
- hashing de senha;
- exportacao/restauracao CSV;
- implementacoes concretas de repositorios.

Essa camada pode depender de bibliotecas e APIs nativas. O restante da aplicacao
deve depender dela por contratos.
