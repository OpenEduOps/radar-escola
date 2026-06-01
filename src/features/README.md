# Features

Camada de experiencia por fluxo de usuario.

Estado atual: `src/features/playground` contem o CRUD master-detail persistente
de referencia do scaffold, e `src/features/radar` contem a primeira fatia
funcional demonstravel do Radar. O fluxo principal ainda sera endurecido a
partir das issues do MVP.

Responsabilidades:

- telas;
- composicao de componentes;
- estados de interface;
- formularios;
- mensagens para a pessoa usuaria.

As features podem chamar casos de uso da camada `application` ou repositorios de
infraestrutura. Elas nao devem espalhar SQL nem detalhes de Tauri diretamente na
interface.

Exemplos planejados para o MVP:

- first-use;
- login;
- people-management;
- needs-radar;
- equipment;
- security-export.
