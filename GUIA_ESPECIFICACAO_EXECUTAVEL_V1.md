# Guia da Especificacao Executavel V1

Este documento e o ponto de entrada para a proxima etapa de detalhamento do
Radar Escola.

Ele explica como transformar a documentacao conceitual da V0 em uma
especificacao executavel da V1: detalhada o suficiente para um dev junior
implementar, para um QA junior validar e para o projeto abrir issues pequenas,
revisaveis e distribuidas por camadas.

## Objetivo

Criar uma ponte entre:

- requisitos de produto;
- modelo de dominio;
- modelo relacional SQLite;
- casos de uso;
- arquitetura de implementacao;
- testes;
- issues de implementacao e validacao.

A meta nao e escrever codigo ainda. A meta e reduzir ambiguidade antes da
implementacao.

## Por Que V1

A V0 definiu a direcao:

- Windows-first;
- local-first;
- Tauri + React + TypeScript + SQLite;
- usuario final antes da tecnologia;
- fluxo minimo de valor para registrar, acompanhar e resolver necessidades.

A V1 deve transformar essa direcao em especificacao operacional:

- atores;
- permissoes;
- campos;
- validacoes;
- fluxos principais;
- fluxos alternativos;
- fluxos de excecao;
- guardrails;
- tabelas relacionais;
- consultas;
- inserts;
- updates;
- deletes ou cancelamentos;
- criterios de aceite;
- testes.

## Guardrail Nao E Fluxo de Excecao

Guardrail e fluxo de excecao se relacionam, mas nao sao a mesma coisa.

### Guardrail

Um guardrail e uma regra de protecao do produto, da UX, da privacidade, da
seguranca ou do escopo.

Exemplos:

- nao coletar nome de estudante na V0;
- nao permitir que usuario comum marque necessidade como resolvida;
- nao expor senha, token ou resposta de recuperacao;
- nao depender de internet;
- nao transformar equipamento em controle patrimonial completo.

Guardrail define a cerca.

### Fluxo de Excecao

Um fluxo de excecao descreve o que acontece quando uma regra, validacao ou
condicao impede o caminho normal.

Exemplos:

- usuario comum tenta marcar necessidade como resolvida;
- pessoa tenta entrar com senha temporaria sem trocar a senha;
- direcao tenta restaurar CSV invalido;
- usuario tenta cadastrar pessoa sem cargo ou funcao existente;
- sessao bloqueia por inatividade.

Fluxo de excecao mostra o comportamento quando alguem encosta na cerca.

## Documentos Gerados ou Planejados

### 1. `DETALHAMENTO_REQUISITOS_V1.md`

Documento de casos de uso em estilo RUP simplificado.

Deve conter:

- visao geral;
- atores;
- premissas;
- glossario;
- matriz de permissoes;
- template padrao de caso de uso;
- casos de uso do MVP;
- fluxos principais;
- fluxos alternativos;
- fluxos de excecao;
- regras de negocio;
- mensagens esperadas;
- criterios de aceite;
- testes recomendados;
- sugestao de issues por caso de uso.

Casos de uso candidatos:

- UC-001: Configurar escola no primeiro uso.
- UC-002: Criar direcao ou responsavel principal.
- UC-003: Entrar com usuario e senha.
- UC-004: Fazer primeiro acesso com senha temporaria.
- UC-005: Recuperar acesso por salvaguarda local.
- UC-006: Cadastrar cargo ou funcao.
- UC-007: Cadastrar pessoa ou usuario.
- UC-008: Definir apoio de gestao.
- UC-009: Registrar necessidade.
- UC-010: Ver Radar de Necessidades.
- UC-011: Marcar envolvidos.
- UC-012: Atualizar andamento.
- UC-013: Registrar plano de acao simples.
- UC-014: Solicitar fechamento tecnico.
- UC-015: Marcar necessidade como resolvida.
- UC-016: Cancelar ou corrigir necessidade.
- UC-017: Consultar historico.
- UC-018: Cadastrar equipamento.
- UC-019: Vincular equipamento a necessidade.
- UC-020: Exportar dados de seguranca.
- UC-021: Restaurar dados de seguranca.
- UC-022: Consultar auditoria.
- UC-023: Transferir direcao.
- UC-024: Sair da conta.
- UC-025: Bloquear e desbloquear sessao por inatividade.

### 2. `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`

Documento para regras que atravessam o produto inteiro.

Deve conter:

- auditoria minima;
- sessao e bloqueio;
- seguranca local;
- privacidade e LGPD;
- acessibilidade;
- linguagem PT-BR;
- exportacao e restauracao;
- transferencia de direcao;
- testes automatizados;
- criterios globais de aceite;
- guardrails de escopo.

Cada bloco deve ter:

- objetivo;
- riscos que evita;
- regras obrigatorias;
- fluxos de excecao relacionados;
- mensagens de UX;
- criterios de aceite;
- testes minimos;
- fora de escopo.

### 3. `REGRAS_DE_DOMINIO_V1.md`

Documento normalizado de dominio e persistencia relacional.

Esse sera o arquivo de referencia para modelo relacional, regras de dominio e
operacoes de dados.

Deve conter:

- dominios;
- entidades;
- tabelas relacionais;
- campos;
- tipos;
- obrigatoriedade;
- constraints;
- relacionamentos;
- inserts permitidos;
- updates permitidos;
- deletes proibidos, logicos ou restritos;
- consultas principais;
- eventos de auditoria;
- matriz CRUD por perfil;
- regras de integridade;
- impacto em testes.

### 4. `MATRIZ_ISSUES_V1.md`

Documento de planejamento para quebrar a especificacao em tarefas pequenas.

Deve conter:

- issues de validacao de requisitos;
- issues de regras de dominio;
- issues de persistencia SQLite;
- issues de application/controller;
- issues de view;
- issues de QA;
- dependencias;
- criterios de aceite;
- testes esperados;
- labels candidatas.

## Modelo Relacional na Arquitetura Atual

Sim, o modelo relacional encaixa na arquitetura atual.

A stack definida e:

- React + TypeScript para interface, formularios, estado e experiencia;
- camada de aplicacao para casos de uso;
- dominio para regras puras;
- infraestrutura para SQLite, Tauri, filesystem, hashing e CSV;
- Tauri/Rust como casca desktop e ponte nativa minima.

SQLite e relacional. Portanto, faz sentido modelar tabelas, chaves, vinculos e
consultas desde a especificacao.

O cuidado principal e nao jogar regra de negocio diretamente na UI nem espalhar
SQL por telas. As regras devem ficar em dominio/aplicacao; a infraestrutura deve
persistir e consultar.

## Dominios Candidatos

Estes dominios devem ser validados e refinados durante a V1:

- escola;
- pessoa;
- cargo ou funcao;
- conta de usuario;
- salvaguarda de acesso;
- apoio de gestao;
- necessidade;
- envolvido;
- andamento;
- plano de acao;
- equipamento;
- historico;
- auditoria;
- exportacao e restauracao;
- sessao local.

## Tabelas Candidatas

Estas tabelas sao candidatas iniciais para o modelo relacional:

- `schools`;
- `people`;
- `roles`;
- `user_accounts`;
- `access_recovery`;
- `management_support`;
- `needs`;
- `need_involved_people`;
- `need_updates`;
- `need_action_plan_items`;
- `equipment`;
- `audit_events`;
- `security_exports`;
- `security_imports`.

O documento `REGRAS_DE_DOMINIO_V1.md` devera confirmar, renomear, dividir ou
remover essas tabelas.

## Operacoes de Dominio

Cada dominio deve explicitar as operacoes permitidas.

### Inserts

Criacao inicial de registros, por exemplo:

- criar escola;
- criar direcao;
- criar pessoa;
- criar cargo ou funcao;
- criar necessidade;
- criar andamento;
- criar equipamento;
- criar evento de auditoria.

### Updates

Alteracoes controladas, por exemplo:

- trocar senha temporaria;
- redefinir senha de usuario comum;
- atualizar dados simples de pessoa;
- alterar status de necessidade;
- marcar necessidade como resolvida;
- cancelar necessidade;
- transferir direcao;
- atualizar equipamento.

### Deletes

Na V1, delete fisico deve ser excecao.

Preferencia:

- cancelar;
- inativar;
- preservar historico;
- registrar auditoria.

Delete fisico so deve existir quando houver motivo claro, baixo risco e regra
explicita.

### Queries

Consultas precisam ser nomeadas para facilitar implementacao e testes.

Exemplos:

- buscar radar de necessidades;
- listar necessidades em andamento;
- listar necessidades paradas;
- listar resolvidas recentemente;
- buscar detalhe da necessidade;
- listar envolvidos de uma necessidade;
- listar historico de uma necessidade;
- listar pessoas ativas;
- listar equipamentos;
- consultar auditoria para direcao.

## Quebra de Issues por Camada

Cada bloco minimo e modular de tarefa deve poder virar issue.

Uma mesma funcionalidade pode gerar issues separadas por camada.

### Requisitos

Issues de validacao de requisito:

- revisar caso de uso;
- revisar fluxo de excecao;
- revisar mensagens de UX;
- revisar criterio de aceite;
- confirmar fora de escopo.

### Dominio e Model

Issues de modelo:

- criar entidade;
- criar value objects ou tipos;
- criar validacoes puras;
- criar regras de permissao;
- criar transicoes de status;
- criar testes unitarios.

### Persistencia

Issues de SQLite:

- criar migration;
- criar repositorio;
- implementar insert;
- implementar update;
- implementar query;
- implementar soft delete ou cancelamento;
- criar testes de persistencia.

### Application ou Controller

Issues de aplicacao:

- implementar caso de uso;
- orquestrar dominio e repositorio;
- validar permissao;
- registrar auditoria;
- retornar erros de negocio;
- criar testes de caso de uso.

### View

Issues de interface:

- criar tela;
- criar formulario;
- criar listagem;
- criar estado vazio;
- criar mensagem de erro;
- criar confirmacao;
- criar navegacao;
- criar teste de interface.

### QA

Issues de qualidade:

- validar fluxo principal;
- validar fluxos alternativos;
- validar fluxos de excecao;
- validar acessibilidade basica;
- validar linguagem PT-BR;
- validar persistencia;
- validar regressao.

## Modelo de Issue

Cada issue deve ter:

- contexto;
- objetivo;
- escopo;
- fora de escopo;
- camada afetada;
- regra relacionada;
- criterios de aceite;
- testes esperados;
- arquivos provaveis;
- dependencia, se houver;
- risco principal.

## Ordem Recomendada

1. Gerar `DETALHAMENTO_REQUISITOS_V1.md`.
2. Gerar `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`.
3. Gerar `REGRAS_DE_DOMINIO_V1.md`.
4. Revisar consistencia entre requisitos, dominios e arquitetura.
5. Criar matriz de issues.
6. Abrir issues de validacao documental.
7. Abrir issues de dominio/model.
8. Abrir issues de persistencia.
9. Abrir issues de aplicacao.
10. Abrir issues de view.
11. Abrir issues de QA/testes.

## Definicao de Pronto Para Implementar

Uma funcionalidade esta pronta para implementacao quando tiver:

- caso de uso definido;
- atores definidos;
- permissao definida;
- fluxo principal definido;
- fluxos de excecao definidos;
- campos definidos;
- regras de dominio definidas;
- tabelas ou persistencia definidas;
- criterios de aceite definidos;
- testes esperados definidos.

## Definicao de Pronto Para Validar

Uma funcionalidade esta pronta para QA quando tiver:

- fluxo testavel;
- dados de exemplo;
- resultado esperado;
- mensagens esperadas;
- regras de permissao;
- cenarios positivos;
- cenarios negativos;
- criterio claro de aprovado ou reprovado.

## Guardrail de Escopo

A V1 nao deve abrir escopo novo sem necessidade.

O foco continua sendo provar o fluxo minimo:

```text
cadastrar pessoa
-> registrar necessidade
-> ver no radar
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido
-> consultar historico
```

Tudo que nao ajuda esse fluxo deve ser tratado como backlog futuro, mesmo que
seja uma ideia boa.
