# Features

Camada de experiencia por fluxo de usuario.

Estado atual em `v0.0.1`: `src/features/playground` contem o CRUD master-detail
de referencia do scaffold. As features reais da V0 ainda serao implementadas a
partir das issues do MVP.

Responsabilidades:

- telas;
- composicao de componentes;
- estados de interface;
- formularios;
- mensagens para a pessoa usuaria.

As features podem chamar casos de uso da camada `application`, mas nao devem
acessar SQLite ou Tauri diretamente.

Exemplos planejados para o MVP:

- first-use;
- login;
- people-management;
- needs-radar;
- equipment;
- security-export.
