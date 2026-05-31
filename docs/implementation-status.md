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

- `src/main.tsx`;
- `src/styles.css`;
- `index.html`;
- `vite.config.ts`;
- `tsconfig.json`.

Desktop/Tauri:

- `src-tauri/Cargo.toml`;
- `src-tauri/build.rs`;
- `src-tauri/src/main.rs`;
- `src-tauri/tauri.conf.json`.

Automacao:

- `.github/workflows/ci.yml`;
- `.github/workflows/security.yml`;
- `.github/workflows/desktop-release.yml`;
- `scripts/smoke-windows.ps1`.

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
npm run typecheck
npm run build
```

### CI Documental e Frontend

A CI valida:

- qualidade basica de Markdown;
- documentos centrais;
- links internos;
- higiene do repositorio;
- frontend build.

### Release Desktop

O workflow `Desktop Release` existe como contrato tecnico para gerar instalador
Windows e publicar release quando houver tag `v*`.

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
- instalador validado em release real;
- testes de dominio.

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
