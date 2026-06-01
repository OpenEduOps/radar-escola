# Radar Escola

Aplicativo desktop local para escolas acompanharem necessidades operacionais.

Este repositorio e o projeto de produto e implementacao do Radar Escola dentro
da organizacao OpenEduOps.

## Estado Atual

O projeto esta em fase de scaffold executavel, especificacao V1 e organizacao
do ciclo de implementacao do MVP.

Ja existem:

- documentacao de produto V0 e V1;
- especificacao executavel V1;
- matriz de regras de dominio e modelo relacional planejado;
- matriz de issues V1 com 85 issues cadastradas no GitHub;
- app minimo Tauri + React + TypeScript;
- playground CRUD master-detail para referencia tecnica;
- testes unitarios do playground;
- teste E2E Playwright do playground;
- CI em `main` com checks de documentacao, higiene, frontend, testes e
  guardrail de metadados publicos;
- workflow `Desktop Release` para gerar instalador Windows tecnico do
  scaffold.

O app atual ainda nao e o MVP funcional completo. Ele valida a casca desktop,
o frontend empacotado, o menu nativo e o CRUD de referencia para pessoas
desenvolvedoras.

## Direcao Do Produto

- Windows-first.
- Local-first.
- Tauri + React + TypeScript + SQLite.
- UX da pessoa usuaria final antes da tecnologia.
- Linguagem em Portugues Brasileiro.
- Sem internet obrigatoria na V0.

SQLite faz parte da arquitetura alvo, mas ainda nao foi implementado no
scaffold atual.

## Fora Do MVP Implementado Hoje

Ainda nao existem no app:

- banco SQLite local;
- autenticacao;
- usuarios, cargos e apoio de gestao;
- cadastro e acompanhamento real de necessidades;
- envolvidos, andamento, resolucao e historico;
- equipamentos operacionais;
- auditoria persistida;
- exportacao/restauracao de seguranca.

## Proximo Passo

Implementar o MVP a partir das issues cadastradas, seguindo a ordem sugerida:

```text
REQ -> DOM -> PER -> ENG -> APP -> VIEW -> QA
```

Na pratica, o primeiro bloco tecnico deve consolidar dominio, persistencia
SQLite, bootstrap local e fluxos de acesso antes de avancar para as telas do
Radar de Necessidades.

## Como Contribuir

O backlog inicial da V1 esta aberto nas
[`issues do GitHub`](https://github.com/OpenEduOps/radar-escola/issues).

Para comecar:

- leia [`CONTRIBUTING.md`](CONTRIBUTING.md);
- escolha uma issue pequena e bem delimitada;
- para primeiras contribuicoes, procure labels como `good first issue`,
  `documentation`, `qa`, `domain` ou `tests`;
- mantenha branch, titulo de PR e commits focados no produto, na issue ou no
  comportamento alterado;
- atualize documentacao e testes quando a mudanca alterar comportamento,
  requisitos ou fluxo de validacao.

As regras de contribuicao permitem contribuicoes humanas ou assistidas por
automacao, desde que sejam revisaveis e que os metadados publicos continuem
focados no produto.

## Como Rodar Localmente

Instale as dependencias:

```text
npm ci
```

Execute o app web em modo desenvolvimento:

```text
npm run dev
```

Execute as verificacoes locais principais:

```text
npm test
npm run test:e2e
npm run typecheck
npm run build
```

Esses comandos validam regras puras do playground, fluxo E2E do CRUD de
referencia, TypeScript e build Vite.

## App Desktop Local

O projeto usa Tauri 2 como casca desktop.

Com a toolchain nativa instalada, o caminho esperado para build desktop local e:

```text
npm run tauri -- build
```

No ambiente local usado ate aqui, Rust/Cargo e Visual Studio Build Tools/MSVC
nao estavam instalados. Por isso, o instalador Windows foi gerado e validado
pelo workflow `Desktop Release` no GitHub Actions.

## Executavel Windows Validado

O workflow `Desktop Release` ja gerou um instalador tecnico do scaffold atual.

Validacoes realizadas sobre o artefato:

- workflow concluido com sucesso;
- instalador `.exe` e arquivo `.sha256` gerados;
- SHA-256 conferido localmente;
- instalacao silenciosa concluida com codigo `0`;
- executavel instalado abriu sem crash imediato;
- tela inicial renderizou no app instalado;
- menu nativo `Playground > Iniciar playground` foi acionado;
- tela `Master detalhe` do playground apareceu no executavel instalado;
- smoke Windows da CI tambem aciona o menu nativo do Playground.

O artefato atual e uma validacao tecnica do scaffold. Ele ainda nao deve ser
tratado como release funcional para escola.

## Leitura Recomendada

Para entender o produto antes de implementar:

- [`CONTEXTO_INICIAL.md`](CONTEXTO_INICIAL.md);
- [`REQUISITOS_V0.md`](REQUISITOS_V0.md);
- [`ESCOPO_V0.md`](ESCOPO_V0.md);
- [`FLUXO_E2E_V0.md`](FLUXO_E2E_V0.md);
- [`GUARDRAILS_V0.md`](GUARDRAILS_V0.md).

Para implementar a V1:

- [`GUIA_ESPECIFICACAO_EXECUTAVEL_V1.md`](GUIA_ESPECIFICACAO_EXECUTAVEL_V1.md);
- [`DETALHAMENTO_REQUISITOS_V1.md`](DETALHAMENTO_REQUISITOS_V1.md);
- [`DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`](DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md);
- [`REGRAS_DE_DOMINIO_V1.md`](REGRAS_DE_DOMINIO_V1.md);
- [`MATRIZ_ISSUES_V1.md`](MATRIZ_ISSUES_V1.md).

Para entender engenharia, CI e release:

- [`docs/architecture.md`](docs/architecture.md);
- [`docs/implementation-status.md`](docs/implementation-status.md);
- [`docs/ci.md`](docs/ci.md);
- [`docs/desktop-release.md`](docs/desktop-release.md).

## Documentacao

- [`CONTEXTO_INICIAL.md`](CONTEXTO_INICIAL.md): contexto educacional, decisao
  Windows-first e filosofia inicial do produto.
- [`REQUISITOS_V0.md`](REQUISITOS_V0.md): requisitos funcionais, nao funcionais
  e criterios de aceite da V0.
- [`ESCOPO_V0.md`](ESCOPO_V0.md): linha de corte do primeiro MVP executavel.
- [`FLUXO_E2E_V0.md`](FLUXO_E2E_V0.md): fluxo ponta a ponta esperado para uma
  escola.
- [`GUARDRAILS_V0.md`](GUARDRAILS_V0.md): limites, riscos, privacidade,
  seguranca local e testes planejados.
- [`VISAO_PROTOTIPAL_V0.md`](VISAO_PROTOTIPAL_V0.md): primeira visao prototipal
  em baixa fidelidade.
- [`VISAO_PROTOTIPAL_V1.md`](VISAO_PROTOTIPAL_V1.md): rascunhos de tela em
  ASCII alinhados aos requisitos, dominios e matriz de issues da V1.
- [`DETALHAMENTO_REQUISITOS_V0.md`](DETALHAMENTO_REQUISITOS_V0.md): ordem
  recomendada para detalhar requisitos implementaveis da V0.
- [`DETALHAMENTO_BLOCOS_TRANSVERSAIS_V0.md`](DETALHAMENTO_BLOCOS_TRANSVERSAIS_V0.md):
  detalhamento de auditoria, sessao, equipamentos, transferencia de direcao,
  testes, acessibilidade e criterios globais de aceite.
- [`GUIA_ESPECIFICACAO_EXECUTAVEL_V1.md`](GUIA_ESPECIFICACAO_EXECUTAVEL_V1.md):
  guia inicial para transformar requisitos V0 em especificacao executavel,
  modelo relacional, regras de dominio e issues por camada.
- [`DETALHAMENTO_REQUISITOS_V1.md`](DETALHAMENTO_REQUISITOS_V1.md): casos de
  uso em estilo RUP simplificado, com fluxos principais, excecoes, regras,
  aceite, testes e tarefas minimas e modulares.
- [`DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`](DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md):
  guardrails transversais da V1 para auditoria, sessao, seguranca local,
  privacidade, acessibilidade, exportacao/restauracao e testes.
- [`REGRAS_DE_DOMINIO_V1.md`](REGRAS_DE_DOMINIO_V1.md): modelo relacional,
  dominios, tabelas, operacoes CRUD, queries e regras de integridade.
- [`MATRIZ_ISSUES_V1.md`](MATRIZ_ISSUES_V1.md): planejamento de 85 issues
  minimas e modulares, ja cadastradas no GitHub, por requisitos, dominio,
  persistencia, application, view, QA e documentacao.
- [`CI_CD_OSS.md`](CI_CD_OSS.md): estrategia de CI/CD OSS para o produto.
- [`docs/project-context.md`](docs/project-context.md): contexto duravel do
  projeto.
- [`docs/implementation-plan.md`](docs/implementation-plan.md): fases de
  implementacao.
- [`docs/final-testable-delivery.md`](docs/final-testable-delivery.md): linha
  de chegada testavel da V0.
- [`docs/implementation-status.md`](docs/implementation-status.md): estado atual
  de implementacao.
- [`docs/roadmap.md`](docs/roadmap.md): roadmap navegavel.
- [`docs/desktop-release.md`](docs/desktop-release.md): esteira de release
  desktop para Windows.
- [`docs/architecture.md`](docs/architecture.md): arquitetura inicial de codigo,
  camadas e responsabilidades.
- [`docs/ci.md`](docs/ci.md): funcionamento da CI do produto.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): orientacoes para contribuir e politica
  de metadados publicos.
- [`docs/permissions.md`](docs/permissions.md): politica de permissoes minimas
  dos workflows.
- [`docs/oss-guardrails.md`](docs/oss-guardrails.md): guardrails praticos para
  contribuicao OSS.
