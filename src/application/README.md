# Application

Camada de casos de uso.

Estado atual em `v0.0.1`: a camada esta reservada para os casos de uso do MVP.
O scaffold atual ainda usa apenas regras de referencia do Playground, sem
orquestracao real de escola, pessoas ou necessidades.

Responsabilidades:

- orquestrar fluxos da V0;
- chamar repositorios e servicos de dominio;
- transformar intencoes da interface em operacoes de negocio;
- devolver resultados claros para a camada de interface.

Exemplos planejados para o MVP:

- configurar primeiro uso;
- cadastrar pessoa;
- registrar necessidade;
- marcar necessidade como resolvida;
- exportar dados de seguranca.

Esta camada deve depender de contratos, nao de detalhes concretos de SQLite,
Tauri ou sistema de arquivos.
