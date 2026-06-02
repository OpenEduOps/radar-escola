# Status de Implementacao

Este documento registra o estado atual do Radar Escola apos a release tecnica
`v0.0.1` e o inicio da primeira fatia funcional do produto.

## Estado Atual

O projeto esta em fase de primeiro fluxo funcional demonstravel, consolidacao
documental e evolucao gradual para o MVP funcional completo.

Existe um app minimo Tauri + React + TypeScript para validar build frontend,
configuracao desktop, playground de referencia e a esteira de CI/CD. A partir
desta etapa, o app tambem demonstra o primeiro caminho de uso do Radar Escola:
configurar escola, entrar, cadastrar pessoa, registrar necessidade, marcar
envolvidos, atualizar andamento e marcar como resolvido.

Esse fluxo ainda nao representa a V0 funcional completa, porque recuperacao
local completa, auditoria persistida, exportacao/restauracao e hardening de
seguranca ainda nao foram implementados. A primeira fatia funcional do Radar e o
playground de referencia ja possuem persistencia SQLite local no runtime Tauri.

Versao tecnica atual:

```text
v0.0.1
```

Release publicada:

```text
https://github.com/OpenEduOps/radar-escola/releases/tag/v0.0.1
```

## Comandos / Interfaces Implementadas

Comandos npm existentes:

```text
npm ci
npm run dev
npm test
npm run test:e2e
npm run typecheck
npm run build
npm run tauri -- --version
npm run tauri -- info
```

Workflows existentes:

- `CI`;
- `Security`;
- `Desktop Release`;
- `Review gate`;
- `Owner auto merge`;
- `Thank contributor`;
- `Dependabot Updates`.

## Pacotes / Modulos Implementados

Frontend:

- `src/app/App.tsx`;
- `src/app/app.css`;
- `src/features/radar/RadarMvpFlow.tsx`;
- `src/features/playground/PlaygroundMasterDetail.tsx`;
- `src/features/playground/playgroundRepository.ts`;
- `src/infrastructure/radarRepository.ts`;
- `src/main.tsx`;
- `index.html`;
- `vite.config.ts`;
- `tsconfig.json`.

Dominio:

- `src/domain/radar/radarDomain.ts`;

Infraestrutura local demonstravel:

- `src/infrastructure/localHash.ts`;
- `src/infrastructure/radarRepository.ts`.

Desktop/Tauri:

- `src-tauri/Cargo.toml`;
- `src-tauri/build.rs`;
- `src-tauri/capabilities/default.json`;
- `src-tauri/icons/icon.ico`;
- `src-tauri/src/main.rs`;
- `src-tauri/src/playground.rs`;
- `src-tauri/src/radar.rs`;
- `src-tauri/tauri.conf.json`.

Automacao:

- `.github/workflows/ci.yml`;
- `.github/workflows/security.yml`;
- `.github/workflows/desktop-release.yml`;
- `scripts/smoke-windows.ps1`.

Docker:

- `PROJETO_DOCKERIZACAO_AMBIENTE.md` documenta a iniciativa de projeto;
- `docs/development-docker.md` registra o guia operacional;
- issues `DOCKER-001` a `DOCKER-009` foram cadastradas e concluidas como trilha
  transversal;
- `.dockerignore` existe;
- `Dockerfile.dev` existe;
- imagem `radar-escola-dev:local` foi validada localmente;
- Docker faz parte da CI como validacao adicional pequena.

Estrutura planejada:

- `src/application`;
- `src/domain`;
- `src/features`;
- `src/infrastructure`;
- `src/shared`;
- `src/testing`.

## Comportamentos Implementados

### Scaffold Visual

O app renderiza uma tela inicial simples com nome `Radar Escola` e mensagem de
estado tecnico.

Validado por:

```text
npm run build
```

### Build Frontend

O frontend compila com TypeScript e Vite.

Validado por:

```text
npm ci
npm test
npm run test:e2e
npm run typecheck
npm run build
```

### Playground CRUD

O scaffold executavel contem um playground de referencia para desenvolvedores.

O playground implementa, com persistencia SQLite local no desktop:

- cadastro de status em `status_playground`;
- cadastro de registros em `playground`;
- listagem master-detail;
- selecao de registro;
- edicao de `nome`, `descricao` e `codigo_status`;
- exclusao de registros;
- relacao logica `playground.codigo_status -> status_playground.codigo_status`.

No runtime Tauri, o schema real contem:

```text
status_playground(codigo_status, nome, created_at)
playground(id, nome, descricao, codigo_status, created_at, updated_at)
```

O banco local e criado em `radar-escola.sqlite3` dentro da pasta de dados do app.
No navegador de desenvolvimento, o repositorio usa `localStorage` como fallback
para preservar o mesmo contrato assincrono nos testes E2E.

As regras puras ficam em:

```text
src/features/playground/playgroundCrud.ts
```

O repositorio frontend fica em:

```text
src/features/playground/playgroundRepository.ts
```

Os comandos SQLite/Tauri ficam em:

```text
src-tauri/src/playground.rs
```

Os testes ficam em:

```text
tests/playgroundCrud.test.mjs
tests/playgroundRepository.test.mjs
e2e/playground-crud.spec.mjs
```

Validado por:

```text
npm test
npm run test:e2e
npm run typecheck
npm run build
```

### Fluxo Inicial Do Radar

O app ja contem uma primeira fatia de produto utilizavel. O fluxo atual permite:

- configurar a escola e a direcao;
- guardar token de recuperacao da direcao;
- entrar com usuario e senha;
- cadastrar pessoas com senha temporaria `123456`;
- obrigar pessoa cadastrada a concluir primeiro acesso em privacidade;
- registrar necessidade operacional;
- marcar pessoas envolvidas;
- registrar andamento conjunto;
- impedir usuario comum de marcar como resolvido;
- permitir direcao ou apoio de gestao marcar como resolvido.

No desktop Tauri, essa fatia persiste em SQLite local por comandos nativos.
No navegador de desenvolvimento, o repositorio usa `localStorage` apenas como
fallback para manter o contrato assincrono em testes web.

As regras puras ficam em:

```text
src/domain/radar/radarDomain.ts
```

A tela principal fica em:

```text
src/features/radar/RadarMvpFlow.tsx
```

A persistencia frontend fica em:

```text
src/infrastructure/radarRepository.ts
```

No runtime Tauri, o schema real fica em:

```text
radar_people
radar_schools
radar_needs
radar_need_involved_people
radar_need_updates
```

Os comandos SQLite/Tauri ficam em:

```text
src-tauri/src/radar.rs
```

Validado por:

```text
npm test
npm run test:e2e
npm run typecheck
npm run build
```

### CI Documental e Frontend

A CI valida:

- guardrail de metadados publicos;
- qualidade basica de Markdown;
- documentos centrais;
- links internos;
- higiene do repositorio;
- testes unitarios;
- teste E2E Playwright do playground;
- teste E2E Playwright de persistencia por reload no playground;
- teste E2E Playwright do fluxo inicial do Radar;
- teste E2E Playwright de persistencia por reload/reabertura no Radar;
- frontend build;
- validacao Docker dev adicional.

### Docker Dev

A imagem Docker dev valida o scaffold Node sem instalar browsers Playwright,
Rust/Tauri ou dependencias de release Windows.

Validado localmente por:

```text
docker build --no-cache -f Dockerfile.dev -t radar-escola-dev:local .
docker run --rm radar-escola-dev:local npm run typecheck
docker run --rm radar-escola-dev:local npm test
docker run --rm radar-escola-dev:local npm run build
```

Resultado observado:

- build sem cache: 41.36s;
- imagem: 523MB;
- Node no container: `v24.16.0`;
- npm no container: `11.13.0`;
- usuario no container: `node`.

### Especificacao e Issues V1

A especificacao executavel V1 foi consolidada em documentos de requisitos,
blocos transversais, regras de dominio, visao prototipal e matriz de issues.

A matriz V1 planeja 85 issues minimas e modulares, e essas issues ja foram
cadastradas no GitHub entre `#4` e `#88`.

### Release Desktop

O workflow `Desktop Release` gera um instalador Windows tecnico do scaffold
atual em execucao manual e publica release quando houver tag `v*`.

A tag atual publicada e `v0.0.1`.

Validado por:

```text
GitHub Actions > Desktop Release
```

Artefatos publicados em `v0.0.1`:

```text
Radar.Escola_0.0.1_x64-setup.exe
Radar.Escola_0.0.1_x64-setup.exe.sha256
```

Validacao local realizada sobre o artefato baixado da release:

- SHA-256 do `.exe` conferido contra o arquivo `.sha256`;
- instalacao silenciosa concluida com codigo `0`;
- executavel instalado abriu sem crash imediato;
- executavel instalado nao abriu prompt atras da janela principal;
- janela principal abriu maximizada;
- UI do Radar Escola renderizou no app instalado;
- menu nativo `Playground > Iniciar playground` acionou o playground;
- tela `Master detalhe` apareceu no executavel instalado.

## Explicitamente Fora de Escopo Agora

Ainda nao foi implementado:

- recuperacao local de acesso;
- hashing forte no runtime nativo;
- equipamentos;
- historico;
- auditoria;
- exportacao/restauracao;
- testes de dominio da V0 funcional;
- Playwright/E2E em Docker;
- build Tauri/Windows em Docker;
- imagem Docker publicada em registry.

## Fronteira Atual da Fonte

O projeto ja saiu da fase de apenas documentacao inicial. A fronteira atual e:

- documentacao V0/V1 consolidada;
- issues V1 cadastradas;
- scaffold executavel validado;
- playground CRUD como referencia tecnica;
- fluxo inicial do Radar como primeira fatia funcional demonstravel;
- persistencia SQLite local da primeira fatia Radar no desktop;
- imagem Docker dev validada;
- release tecnica `v0.0.1` publicada com instalador Windows e checksum;
- instalador Windows tecnico gerado, instalado e validado via CI/smoke.

A proxima etapa e separar melhor casos de uso/repositorios do fluxo principal e
seguir para recuperacao local, auditoria e exportacao/restauracao, mantendo cada
entrega pequena, testavel e rastreavel.

## Proximas Prioridades

1. Separar repositorios e casos de uso definitivos.
2. Endurecer hashing e recuperacao local.
3. Persistir auditoria minima das acoes sensiveis.
4. Evoluir equipamentos e vinculos operacionais.
5. Implementar exportacao/restauracao de seguranca.

## Comandos de Verificacao

Verificacoes locais atualmente usadas:

```text
npm ci
npm test
npm run test:e2e
npm run typecheck
npm run build
docker build -f Dockerfile.dev -t radar-escola-dev:local .
docker run --rm radar-escola-dev:local npm run typecheck
docker run --rm radar-escola-dev:local npm test
docker run --rm radar-escola-dev:local npm run build
```

Limitacao local conhecida:

```text
npm run tauri -- info
```

Esse comando detecta que Rust, Cargo e Visual Studio Build Tools/MSVC nao estao
instalados localmente nesta maquina. Por isso, o build Tauri completo deve ser
validado no GitHub Actions ou em ambiente local com toolchain completo.

Tentativa local adicional:

```text
npm run tauri -- build
```

Resultado observado:

```text
failed to run 'cargo metadata' ... program not found
```

Tambem nao foi localizada instalacao local do Visual Studio Build Tools/MSVC
com suporte a `Microsoft.VisualStudio.Component.VC.Tools.x86.x64`.

O instalador Windows do scaffold atual foi gerado, publicado na release
`v0.0.1` e validado via GitHub Actions porque o runner Windows ja fornece a
toolchain necessaria para compilar Tauri.
