# Arquitetura Inicial

Este documento define a organizacao inicial do codigo do Radar Escola.

O objetivo nao e criar arquitetura pesada antes da hora. O objetivo e impedir
que o scaffold cresca de forma acidental e vire um bloco dificil de manter.

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

src/application
  casos de uso e orquestracao

src/domain
  entidades, value objects e regras puras

src/infrastructure
  SQLite, Tauri, filesystem, hashing e CSV

src/shared
  UI e utilitarios reutilizaveis

src/testing
  fixtures e helpers de teste
```

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

- `school`: escola, direcao e transferencia de responsabilidade;
- `people`: pessoas, usuarios, cargos e apoio de gestao;
- `needs`: necessidades, envolvidos, andamento e resolucao;
- `equipment`: equipamentos;
- `audit`: auditoria minima.

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
