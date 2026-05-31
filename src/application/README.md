# Application

Camada de casos de uso.

Responsabilidades:

- orquestrar fluxos da V0;
- chamar repositorios e servicos de dominio;
- transformar intencoes da interface em operacoes de negocio;
- devolver resultados claros para a camada de interface.

Exemplos futuros:

- configurar primeiro uso;
- cadastrar pessoa;
- registrar necessidade;
- marcar necessidade como resolvida;
- exportar dados de seguranca.

Esta camada deve depender de contratos, nao de detalhes concretos de SQLite,
Tauri ou sistema de arquivos.
