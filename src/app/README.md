# App

Camada de inicializacao da interface.

Estado atual em `v0.0.1`: esta camada monta a tela raiz do scaffold, inicia o
Playground de referencia e reage ao menu nativo `Playground > Iniciar
playground`. Ela ainda nao possui rotas ou fluxos reais da V0 funcional.

Responsabilidades:

- montar a aplicacao React;
- conectar provedores globais quando existirem;
- definir rotas ou telas raiz;
- manter composicao de alto nivel, sem regra de dominio.

Nao deve conter:

- acesso direto ao banco;
- regras de negocio;
- chamadas Tauri espalhadas;
- validacoes de dominio.
