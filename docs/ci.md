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
- validacao Docker dev adicional para `Dockerfile.dev`;
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
  `npm run build` e `npm run test:e2e` para o scaffold frontend. Tambem
  constroi a imagem Docker dev e roda typecheck, testes unitarios e build
  frontend dentro do container.
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

## Validacao Local Equivalente

Os checks documentais principais da CI sao scripts Python inline no proprio
workflow `.github/workflows/ci.yml`. Eles verificam documentos obrigatorios,
links internos, arquivos vazios, tabs e espacos sobrando.

Como Docker agora faz parte do fluxo tecnico de validacao, o contrato documental
tambem exige `PROJETO_DOCKERIZACAO_AMBIENTE.md` e
`docs/development-docker.md`, ambos linkados a partir do README.

Para reproduzir exatamente esses checks, consulte e rode os blocos do workflow.
Para uma checagem rapida de escopo alterado, use `git diff --check`.

`markdownlint` pode ser usado como apoio local, mas nao e o contrato atual da
CI. Se for usado dentro da imagem Docker, prefira apontar arquivos especificos
do projeto para nao incluir dependencias instaladas em `node_modules`.

## Evolucao do App

A CI devera evoluir para validar:

- lint, typecheck, testes e build do frontend;
- checks Rust/Tauri;
- testes de persistencia SQLite;
- regras criticas de seguranca local;
- smoke test do fluxo minimo.

O scaffold minimo atual valida a casca desktop e o pipeline de release sem
fingir funcionalidade de MVP.

## Higiene Do Repositorio

O job `Repository hygiene` impede que arquivos locais, sensiveis ou gerados
entrem no historico.

Ele bloqueia:

- arquivos de ambiente e credenciais locais, como `.env`, `.npmrc`, chaves e
  certificados;
- logs e arquivos temporarios;
- artefatos de release desktop, como `.msi`, checksums `.sha256` e instaladores
  `setup.exe`;
- diretorios gerados, como `node_modules`, `dist`, `coverage`,
  `playwright-report`, `test-results`, `dist-artifacts` e
  `src-tauri/target`.

Essas regras complementam `.gitignore` e `.dockerignore`: Git deve evitar
versionar esses arquivos, Docker nao deve copia-los para a imagem, e a CI deve
falhar se algum deles entrar por engano.

## Docker E CI

A CI atual usa Docker apenas como validacao adicional da imagem dev Node.

A dockerizacao do ambiente esta documentada como iniciativa de projeto em
[`PROJETO_DOCKERIZACAO_AMBIENTE.md`](../PROJETO_DOCKERIZACAO_AMBIENTE.md).

Direcao atual:

- manter CI simples enquanto ela validar o scaffold com clareza;
- usar Docker como apoio local de desenvolvimento e QA tecnico;
- validar `Dockerfile.dev` sem substituir os checks Node diretos;
- nao usar Docker como substituto do workflow `Desktop Release`;
- registrar qualquer ampliacao de estrategia antes de exigir novos checks Docker.

Docker entrou na CI depois da validacao local da imagem dev Node basica.

O job `Docker dev validation`:

- constroi `radar-escola-dev:ci`;
- roda `npm run typecheck` no container;
- roda `npm test` no container;
- roda `npm run build` no container;
- nao roda Playwright/E2E;
- nao publica imagem;
- nao substitui `Desktop Release`.

Esse job faz parte do agregado `All CI checks` e preserva permissoes minimas.

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
