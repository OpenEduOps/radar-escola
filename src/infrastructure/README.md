# Infrastructure

Camada de detalhes tecnicos.

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
