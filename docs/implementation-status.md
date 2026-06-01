# Status de Implementacao

Este documento registra o estado atual do Radar Escola apos a adocao do
`template-pre-projeto`.

## Estado Atual

O projeto esta em fase de scaffold tecnico e consolidacao documental.

Existe um app minimo Tauri + React + TypeScript para validar build frontend,
configuracao desktop e a esteira de CI/CD. Esse app ainda nao representa a V0
funcional.

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
- `Thank contributor`;
- `Dependabot Updates`.

## Pacotes / Modulos Implementados

Frontend:

- `src/app/App.tsx`;
- `src/app/app.css`;
- `src/main.tsx`;
- `index.html`;
- `vite.config.ts`;
- `tsconfig.json`.

Desktop/Tauri:

- `src-tauri/Cargo.toml`;
- `src-tauri/build.rs`;
- `src-tauri/capabilities/default.json`;
- `src-tauri/icons/icon.ico`;
- `src-tauri/src/main.rs`;
- `src-tauri/tauri.conf.json`.

Automacao:

- `.github/workflows/ci.yml`;
- `.github/workflows/security.yml`;
- `.github/workflows/desktop-release.yml`;
- `scripts/smoke-windows.ps1`.

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

O playground implementa, em estado local:

- cadastro de status em `status_playground`;
- cadastro de registros em `playground`;
- listagem master-detail;
- selecao de registro;
- edicao de `nome`, `descricao` e `codigo_status`;
- exclusao de registros;
- relacao logica `playground.codigo_status -> status_playground.codigo_status`.

As regras puras ficam em:

```text
src/features/playground/playgroundCrud.ts
```

Os testes ficam em:

```text
tests/playgroundCrud.test.mjs
e2e/playground-crud.spec.mjs
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

- qualidade basica de Markdown;
- documentos centrais;
- links internos;
- higiene do repositorio;
- testes unitarios;
- teste E2E Playwright do playground;
- frontend build.

### Release Desktop

O workflow `Desktop Release` gera um instalador Windows tecnico do scaffold
atual em execucao manual e publica release quando houver tag `v*`.

Validado por:

```text
GitHub Actions > Desktop Release
```

Validacao local realizada sobre o artefato baixado do workflow:

- SHA-256 do `.exe` conferido contra o arquivo `.sha256`;
- instalacao silenciosa concluida com codigo `0`;
- executavel instalado abriu sem crash imediato;
- UI do Radar Escola renderizou no app instalado;
- menu nativo `Playground > Iniciar playground` acionou o playground;
- tela `Master detalhe` apareceu no executavel instalado.

## Explicitamente Fora de Escopo Agora

Ainda nao foi implementado:

- SQLite;
- autenticacao;
- usuarios;
- cargos;
- apoio de gestao;
- necessidades;
- envolvidos;
- equipamentos;
- historico;
- auditoria;
- exportacao/restauracao;
- testes de dominio da V0 funcional.

## Fronteira Atual da Fonte

O projeto comeca em documentacao e scaffold local.

O detalhamento de requisitos por issue ainda nao foi feito. A proxima etapa e
transformar o plano de implementacao em issues pequenas, testaveis e nao
ambigua.

## Proximas Prioridades

1. Detalhar requisitos por fase.
2. Criar issues de implementacao e testes.
3. Implementar persistencia SQLite.
4. Implementar primeiro uso e direcao.
5. Implementar login e pessoas/usuarios.
6. Implementar fluxo de necessidades.

## Comandos de Verificacao

Verificacoes locais atualmente usadas:

```text
npm ci
npm test
npm run test:e2e
npm run typecheck
npm run build
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

O instalador Windows do scaffold atual foi gerado e validado via GitHub Actions
porque o runner Windows ja fornece a toolchain necessaria para compilar Tauri.
