# Infrastructure

Camada de detalhes tecnicos.

Estado atual: esta camada contem pontes locais demonstraveis para o fluxo Radar
e o repositório frontend do playground conversa com comandos Tauri quando roda no
desktop. SQLite real ja existe no runtime Tauri para o playground de referencia,
mas a persistencia SQLite do dominio principal ainda e trabalho futuro da V0
funcional.

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
