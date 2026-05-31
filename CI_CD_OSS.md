# CI/CD OSS do OpenEduOps

Este documento define uma direcao inicial para CI/CD profissional no OpenEduOps.

Ele usa `TEMPLATE_CI_REFERENCE.md`, do projeto local `pr-maven-cli`, como
referencia de maturidade e postura de seguranca, mas adapta as decisoes para o
contexto do OpenEduOps e do futuro produto Radar Escola.

## Objetivo

Criar uma base de CI/CD que:

- proteja `main` sem tornar a contribuicao pesada;
- seja compreensivel para contribuidores iniciantes;
- valide documentacao e requisitos enquanto ainda nao existe codigo do app;
- prepare caminho para o futuro app Tauri + React + TypeScript + SQLite;
- use permissoes minimas por padrao;
- separe CI, seguranca, automacoes de comunidade e release;
- aponte para uma esteira final capaz de gerar instalador Windows baixavel;
- evite depender de servicos privados, pagos ou credenciais externas para checks
  essenciais.

## Principios

- CI deve ser barata de rodar em pull requests.
- O branch protegido deve depender de um unico check agregado e estavel:
  `All CI checks`.
- Workflows devem ter `contents: read` por padrao.
- Permissoes de escrita devem aparecer apenas no job que realmente precisa
  escrever.
- Checks criticos devem ser deterministico e locais.
- Checks de seguranca podem ser visiveis sem bloquear merge no inicio, se ainda
  houver risco de ruido alto.
- Forks nunca devem executar codigo de contributor em workflow
  `pull_request_target`.
- Release com artefatos, checksums, SBOMs e attestations deve entrar apenas
  quando existir produto empacotavel.

## Fase 0: Repositorio de organizacao

Estado atual:

- este repositorio contem documentacao, governanca e requisitos;
- ainda nao contem o codigo do aplicativo Radar Escola;
- a CI inicial deve proteger qualidade documental e consistencia basica.

Workflows recomendados para a Fase 0:

```text
.github/workflows/ci.yml
.github/workflows/security.yml
.github/workflows/thank-contributor.yml
```

Arquivos de apoio recomendados:

```text
.github/CODEOWNERS
.github/dependabot.yml
.github/contributor-thanks.md
.github/ISSUE_TEMPLATE/*
.github/PULL_REQUEST_TEMPLATE.md
docs/ci.md
docs/permissions.md
docs/oss-guardrails.md
SECURITY.md
MAINTAINERS.md
```

`desktop-release.yml` pode existir como contrato tecnico futuro. Em execucao
manual, ele deve informar que o app ainda nao esta pronto sem publicar artefatos.
Em tag `v*`, ele deve falhar se o scaffold do app nao existir. O projeto nao
deve publicar artefatos falsos.

## CI inicial para documentacao

O workflow `.github/workflows/ci.yml` deve rodar em:

```yaml
on:
  pull_request:
  push:
    branches:
      - main
```

Permissoes padrao:

```yaml
permissions:
  contents: read
```

Concorrencia:

```yaml
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Jobs recomendados:

- `Markdown quality`: validar Markdown, links internos e nomes de arquivos
  esperados.
- `Documentation consistency`: verificar se documentos centrais existem e se o
  README aponta para eles.
- `Repository hygiene`: validar ausencia de arquivos temporarios, secrets
  aparentes e artefatos gerados.
- `All CI checks`: job agregado que depende dos anteriores.

O branch protection deve exigir apenas:

```text
All CI checks
```

Isso evita trocar regras de protecao sempre que novos jobs forem adicionados.

## CI futura para o Radar Escola

Quando o repositorio do app existir, a CI deve ser adaptada para:

```text
Tauri + React + TypeScript + SQLite
```

Jobs esperados:

- `Frontend quality`: formatacao, lint, typecheck e testes de UI/regras simples.
- `Rust/Tauri quality`: `cargo fmt --check`, `cargo clippy` e testes Rust onde
  houver ponte nativa.
- `SQLite/persistence tests`: testes de persistencia, migracoes e restauracao.
- `Security-sensitive rules`: testes de hash de senha, primeiro acesso,
  auditoria, apoio de gestao, exportacao/restauracao e sessao.
- `Build`: build do frontend e build Tauri quando o scaffold existir.
- `Smoke test`: iniciar o app ou validar fluxo minimo em ambiente de teste.
- `All CI checks`: agregador estavel.

Comandos concretos so devem ser definidos depois que o scaffold do app existir.
Exemplos provaveis:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

Esses comandos sao indicativos. O projeto real deve definir scripts locais
claros antes de codificar o workflow definitivo.

## Security workflow

O workflow `.github/workflows/security.yml` deve rodar em:

```yaml
on:
  pull_request:
  push:
    branches:
      - main
  schedule:
    - cron: "17 9 * * 1"
  workflow_dispatch:
```

Politica inicial:

- Dependency Review em pull requests, se disponivel.
- Dependabot para GitHub Actions e, futuramente, npm/cargo.
- CodeQL quando o repositorio e o plano do GitHub suportarem.
- Scanners de seguranca devem ser visiveis, mas podem ser consultivos no inicio
  se gerarem ruido que a equipe ainda nao consegue tratar rapidamente.

Permissao para upload de resultados de seguranca deve ser dada apenas ao job que
precisar:

```yaml
permissions:
  contents: read
  security-events: write
```

## Contributor thank-you workflow

Objetivo: acolher contribuidores em issues e pull requests sem executar codigo.

Regras:

- Ler mensagem de `.github/contributor-thanks.md`.
- Comentar apenas uma vez, usando marcador oculto.
- Usar permissoes minimas:

```yaml
permissions:
  issues: write
  pull-requests: write
```

- Se usar `pull_request_target`, nunca fazer checkout nem executar codigo do PR.

## Release workflow desktop

O workflow `.github/workflows/desktop-release.yml` define a esteira alvo do app
desktop.

Enquanto o repositorio nao tiver `package.json`, `src-tauri/Cargo.toml` e
`scripts/smoke-windows.ps1`, o workflow deve parar no preflight com mensagem
clara. Execucoes manuais podem passar sem artefato; tags de release devem falhar
ate existir instalador real.

Para o Radar Escola, release futura deve considerar:

- instalador Windows como prioridade;
- smoke test de instalacao e abertura em runner Windows;
- artefatos verificaveis;
- checksums SHA-256;
- SBOMs;
- attestations quando disponiveis;
- tags versionadas, preferencialmente assinadas;
- documentacao clara de como verificar o download.

O objetivo final e permitir que uma pessoa baixe o instalador, instale e execute
o Radar Escola em uma maquina desktop Windows para validar a experiencia real do
produto.

Antes do primeiro release publico, criar:

```text
docs/release.md
docs/desktop-release.md
docs/permissions.md
SECURITY.md
MAINTAINERS.md
```

## Branch protection

Antes de receber contribuicoes externas frequentes, proteger `main` com:

- pull request obrigatorio antes do merge;
- pelo menos uma aprovacao;
- CODEOWNER review;
- conversas resolvidas;
- check obrigatorio `All CI checks`;
- bloqueio de force push;
- bloqueio de delecao do branch.

Se houver apenas uma pessoa mantenedora no inicio, documentar qualquer bypass
temporario para evitar deadlock operacional.

## Dependabot

Configurar `.github/dependabot.yml` desde a Fase 0 para:

- GitHub Actions;
- npm, quando o app React existir;
- cargo, quando o app Tauri/Rust existir.

Atualizacoes devem ser pequenas e revisaveis.

## Politica de permissoes

Padrao em todos os workflows:

```yaml
permissions:
  contents: read
```

Permissoes especiais:

- `contents: write`: apenas release publishing.
- `id-token: write` e `attestations: write`: apenas jobs de attestation.
- `issues: write` e `pull-requests: write`: apenas automacao de comentario.
- `security-events: write`: apenas jobs de seguranca que enviam resultados.

## O que nao fazer no primeiro MVP

- Nao exigir tokens privados para CI central.
- Nao depender de servicos externos instaveis para merge.
- Nao colocar permissoes amplas no nivel do workflow.
- Nao executar codigo de fork em `pull_request_target`.
- Nao bloquear merge por scanners ruidosos antes de haver capacidade de triagem.
- Nao prometer release assinada, SBOM gate ou distribuicao em package manager
  antes de existir produto empacotavel.
- Nao copiar comandos do `pr-maven-cli` quando forem especificos de outra stack.

## Checklist de aceite da CI/CD

### Fase 0: organizacao/documentacao

- [ ] `ci.yml` roda em PRs e pushes para `main`.
- [ ] CI valida documentacao e estrutura minima.
- [ ] Existe job agregado `All CI checks`.
- [ ] Workflows usam permissoes read-only por padrao.
- [ ] `security.yml` roda em PRs, `main`, agenda e manual.
- [ ] Dependabot esta configurado para GitHub Actions.
- [ ] `thank-contributor.yml` nao executa codigo de contributors.
- [ ] README aponta para a documentacao de CI.
- [ ] Branch protection exige `All CI checks`.

### Fase 1: app Radar Escola

- [x] Scaffold minimo Tauri + React + TypeScript existe sem funcionalidade falsa.
- [x] CI roda typecheck e build do frontend.
- [ ] CI roda checks Rust/Tauri quando houver codigo Rust.
- [ ] CI roda testes de persistencia SQLite.
- [ ] CI cobre regras criticas de seguranca local.
- [ ] Build do app roda sem servicos privados.
- [ ] Smoke test valida o fluxo minimo.
- [ ] Release workflow gera instalador Windows quando o produto estiver pronto.
- [ ] Release gera checksums e documenta verificacao.
- [ ] Smoke test instala e abre o app em ambiente Windows automatizado.

## Proxima decisao

Antes de implementar workflows reais, decidir se a primeira PR de CI/CD deve
entregar apenas a Fase 0 ou se tambem deve criar arquivos preparatorios para o
futuro app.

Recomendacao inicial:

> Implementar primeiro a Fase 0, porque este repositorio ainda e de organizacao
> e documentacao. Deixar a CI do app para o repositorio do Radar Escola quando
> o scaffold existir.
