# CI do Radar Escola

Este documento explica a CI inicial do repositorio `OpenEduOps/radar-escola`.

## Escopo atual

Este repositorio e o projeto de produto do Radar Escola. Ele contem a
documentacao da V0 e o scaffold tecnico minimo Tauri + React + TypeScript.

Por isso, a CI atual valida:

- qualidade basica de Markdown;
- presenca dos documentos centrais;
- links internos;
- higiene do repositorio;
- typecheck, testes unitarios, E2E Playwright e build do scaffold
  React/TypeScript;
- postura minima de permissoes dos workflows.

## Check protegido

O check que deve proteger `main` e:

```text
All CI checks
```

Esse check agrega os jobs internos da CI. A regra de branch protection deve usar
apenas esse nome para nao depender de nomes de matrix ou jobs auxiliares.

## Workflows

- `.github/workflows/ci.yml`: valida documentacao e higiene do repositorio.
  Tambem valida `npm ci`, `npm run typecheck`, `npm test`,
  `npm run build` e `npm run test:e2e` para o scaffold frontend.
- `.github/workflows/security.yml`: valida postura de seguranca dos workflows e
  executa auditoria de dependencias de producao com `npm audit`.
- `.github/workflows/owner-auto-merge.yml`: habilita auto-merge apenas para
  pull requests abertos pelo usuario `Will-thom`, quando o PR nao for draft e a
  base for `main`.
- `.github/workflows/review-gate.yml`: exige aprovacao humana para pull requests
  de outros usuarios e libera automaticamente PRs do usuario `Will-thom`.
- `.github/workflows/thank-contributor.yml`: envia mensagem de boas-vindas para
  novas issues e pull requests.
- `.github/workflows/desktop-release.yml`: contrato futuro da esteira de
  instalador Windows. Hoje ele depende do scaffold do app Radar Escola para
  conseguir gerar artefatos reais. Em execucao manual, informa pendencias sem
  publicar artefatos; em tag `v*`, falha se o app ainda nao existir.

## Comandos locais equivalentes

Quando Node estiver disponivel:

```bash
npx --yes markdownlint-cli2@0.16.0 "**/*.md"
```

Os checks de consistencia documental e higiene estao descritos no proprio
workflow `ci.yml`.

## Evolucao do App

A CI devera evoluir para validar:

- lint, typecheck, testes e build do frontend;
- checks Rust/Tauri;
- testes de persistencia SQLite;
- regras criticas de seguranca local;
- smoke test do fluxo minimo.

O scaffold minimo atual valida a casca desktop e o pipeline de release sem
fingir funcionalidade de MVP.

## Docker E CI

A CI atual nao depende de Docker.

A dockerizacao do ambiente esta documentada como iniciativa de projeto em
[`PROJETO_DOCKERIZACAO_AMBIENTE.md`](../PROJETO_DOCKERIZACAO_AMBIENTE.md).

Direcao atual:

- manter CI simples enquanto ela ja validar o scaffold com clareza;
- usar Docker primeiro como apoio local de desenvolvimento e QA tecnico;
- nao trocar workflows atuais por Docker sem evidencia de ganho;
- nao usar Docker como substituto do workflow `Desktop Release`;
- registrar qualquer mudanca de estrategia antes de exigir Docker em CI.

Qualquer validacao Docker em CI deve ser tratada como etapa final da iniciativa,
dependente das issues de base de dockerizacao. Nao deve haver job Docker
protegido antes de existir imagem local validada, medicao de custo e
documentacao operacional com comandos reais.

Essa decisao esta concentrada na issue
[`DOCKER-009`](https://github.com/OpenEduOps/radar-escola/issues/97), que deve
ser executada apenas depois das issues `DOCKER-001` a `DOCKER-008`.

Se Docker entrar na CI no futuro, ele deve continuar dentro do agregado
`All CI checks` e preservar permissoes minimas.

## Teste E2E Do Playground

O script abaixo valida o CRUD de referencia do playground em navegador real:

```text
npm run test:e2e
```

Esse teste usa Playwright com o Chrome instalado no ambiente. Para evitar
download pesado de browser durante instalacao de dependencias, a CI define:

```text
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

O teste cobre:

- abertura do playground;
- cadastro de status em `status_playground`;
- cadastro de registro em `playground`;
- edicao de registro;
- exibicao de `codigo_status`;
- exclusao de registro.

## Guarda De Metadados Publicos

O job `Agent name guard` valida metadados publicos em pull requests e pushes
para `main`.

Ele verifica:

- titulo do pull request;
- nome da branch do pull request;
- mensagens de commit no intervalo do pull request;
- mensagens de commit em pushes para `main`.

Essa guarda nao tenta descobrir se uma contribuicao foi criada com apoio de
automacao. Contribuicoes automatizadas ou assistidas sao permitidas quando forem
revisaveis.

A politica bloqueia apenas nomes de agentes ou ferramentas em metadados
publicos. Branches, titulos e commits devem descrever produto, issue,
comportamento ou mudanca de engenharia.

O job `Agent name guard` faz parte do agregado `All CI checks`. Portanto, uma
contribuicao que falhar nessa guarda nao deve ser mergeada.

## Auto-Merge Do Mantenedor

O workflow `Owner auto-merge` existe para reduzir atrito operacional em pull
requests do mantenedor principal.

Regra desejada:

- PR aberto por `Will-thom`;
- base `main`;
- PR nao draft;
- checks obrigatorios verdes;
- auto-merge habilitado;
- merge automatico quando os requisitos remotos forem atendidos.

Para qualquer outro usuario, o fluxo continua sendo:

- PR aberto;
- checks verdes;
- `Review gate` pendente ate haver aprovacao humana;
- merge feito ou recusado por mantenedor.

Esse workflow nao aprova pull requests de terceiros e nao deve ser usado como
atalho para contributors externos. Ele apenas pede ao GitHub para habilitar
auto-merge em PRs do usuario autorizado. A protecao real continua dependendo das
regras da branch `main`.

Configuracao remota esperada no GitHub:

- auto-merge habilitado no repositorio;
- branch protection ou ruleset exigindo `All CI checks`;
- branch protection ou ruleset exigindo `All security checks`;
- branch protection ou ruleset exigindo `Review gate`;
- quando houver exigencia de review, `Will-thom` deve ser tratado como excecao
  pelo proprio `Review gate`;
- demais contributors devem continuar sujeitos a review antes do merge.

## Hardening Remoto Desejado

Depois que a guarda estiver estabilizada, o repositorio pode receber uma camada
adicional por GitHub repository ruleset.

Direcao desejada:

- target: branch;
- branch: `refs/heads/main`;
- regra: `commit_message_pattern`;
- operador: regex;
- negacao: true;
- pattern equivalente ao usado em `.github/scripts/check-public-metadata.sh`.

Essa camada remota seria complementar a CI. Se a criacao da ruleset falhar por
autenticacao, permissao ou limite de plano, a guarda de CI continua sendo a
camada principal.

## Esteira Desktop Futura

A esteira alvo de download, instalacao e execucao do app esta documentada em
[`docs/desktop-release.md`](desktop-release.md).

Ela devera gerar artefato baixavel, checksum SHA-256 e release versionada quando
o app desktop existir.
