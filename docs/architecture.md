# Arquitetura Inicial

Este documento define a organizacao inicial do codigo do Radar Escola.

O objetivo nao e criar arquitetura pesada antes da hora. O objetivo e impedir
que o scaffold cresca de forma acidental e vire um bloco dificil de manter.

## Estado Atual

A arquitetura ja possui um scaffold executavel Tauri + React + TypeScript,
release tecnica `v0.0.1`, playground CRUD persistente de referencia e uma
primeira fatia funcional do Radar. Esse estado valida casca desktop,
empacotamento Windows, menu nativo, teste E2E, separacao inicial de pastas,
SQLite local no playground e fluxo principal demonstravel.

A arquitetura alvo do MVP ainda precisa levar a persistencia SQLite ao fluxo
principal do Radar, implementar repositorios definitivos, recuperacao local,
auditoria persistida, exportacao/restauracao e guardrails de seguranca finais.

## Principios

- UX da escola primeiro.
- Separacao clara de responsabilidades.
- Regras de negocio testaveis fora da interface.
- Infraestrutura isolada de dominio.
- Tauri/Rust como casca desktop e ponte nativa minima.
- React/TypeScript como camada principal de experiencia e aplicacao.
- SQLite isolado atras de contratos de repositorio.
- Incrementos pequenos, revisaveis e com criterios de aceite.

## Camadas

```text
src/app
  composicao raiz da aplicacao

src/features
  telas e fluxos de usuario

src/features/radar
  primeira fatia funcional do Radar de Necessidades

src/application
  casos de uso e orquestracao

src/domain
  entidades, value objects e regras puras

src/domain/radar
  dominio inicial demonstravel do fluxo principal

src/domain/school
  escola, direcao e responsabilidade principal

src/domain/people
  pessoas, usuarios, cargos e apoio de gestao

src/domain/needs
  necessidades, envolvidos, andamento e resolucao

src/domain/equipment
  equipamentos e vinculos operacionais

src/domain/audit
  auditoria minima de acoes sensiveis

src/infrastructure
  SQLite, Tauri, filesystem, hashing, CSV e pontes locais temporarias

src/shared
  UI e utilitarios reutilizaveis

src/testing
  fixtures e helpers de teste

src-tauri/src
  runtime nativo minimo do aplicativo desktop
```

## Ambiente Tecnico

Docker foi adotado como apoio ao ambiente de desenvolvimento e QA tecnico,
conforme [`PROJETO_DOCKERIZACAO_AMBIENTE.md`](../PROJETO_DOCKERIZACAO_AMBIENTE.md)
e [`docs/development-docker.md`](development-docker.md).

Ele nao faz parte da arquitetura de runtime do produto.

Regras:

- Docker nao substitui Tauri;
- Docker nao substitui SQLite local;
- Docker nao substitui instalador Windows;
- Docker nao deve ser dependencia da pessoa usuaria final;
- codigo de produto nao deve assumir que roda dentro de container.

## Direcao Das Dependencias

Dependencias devem apontar para dentro:

```text
features -> application -> domain
infrastructure -> domain
app -> features/application/shared
```

Regras:

- `domain` nao importa React, Tauri, SQLite ou filesystem.
- `application` nao conhece componentes visuais.
- `features` nao acessam banco diretamente.
- `infrastructure` implementa detalhes concretos.
- `shared` nao deve depender de dominios especificos.

## Dominio Inicial

Subdominios planejados:

- `src/domain/radar`: fatia inicial integrada para validar o fluxo principal;
- `src/domain/school`: escola, direcao e transferencia de responsabilidade;
- `src/domain/people`: pessoas, usuarios, cargos e apoio de gestao;
- `src/domain/needs`: necessidades, envolvidos, andamento e resolucao;
- `src/domain/equipment`: equipamentos;
- `src/domain/audit`: auditoria minima.

O modulo `src/domain/radar` e uma etapa de consolidacao do primeiro fluxo. A
tendencia e extrair ou alinhar seus comportamentos aos subdominios finais quando
SQLite, repositorios e casos de uso forem implementados.

## Tauri/Rust

Rust deve permanecer pequeno na V0.

Responsabilidades esperadas:

- inicializar janela desktop;
- expor comandos nativos quando necessario;
- apoiar acesso seguro a filesystem;
- apoiar empacotamento desktop.

Rust nao deve receber regra de negocio do produto sem necessidade clara.

## Testes

Direcao inicial:

- testes unitarios para `domain`;
- testes de casos de uso em `application`;
- testes de componentes/fluxos em `features`;
- testes de persistencia em `infrastructure`;
- smoke test desktop no pipeline de release.

## O Que Evitar

- regras de negocio dentro de componentes React;
- SQL espalhado em telas;
- funcoes utilitarias sem dono em `shared`;
- permissoes complexas antes da V0 precisar;
- abstracoes criadas antes de haver duplicacao real;
- mover comportamento para Rust por preferencia tecnica.
