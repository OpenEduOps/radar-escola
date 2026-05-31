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
- typecheck e build do scaffold React/TypeScript;
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
  Tambem valida `npm ci`, `npm run typecheck` e `npm run build` para o scaffold
  frontend.
- `.github/workflows/security.yml`: valida postura de seguranca e dependency
  review em pull requests.
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
