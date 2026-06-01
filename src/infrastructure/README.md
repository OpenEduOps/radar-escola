# Infrastructure

Camada de detalhes tecnicos.

Estado atual em `v0.0.1`: esta camada ainda nao implementa SQLite, filesystem,
hashing ou CSV reais do MVP. A release tecnica valida empacotamento desktop e
frontend, mas a persistencia local ainda e trabalho futuro da V0 funcional.

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
