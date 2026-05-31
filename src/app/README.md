# App

Camada de inicializacao da interface.

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
