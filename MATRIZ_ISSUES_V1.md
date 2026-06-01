# Matriz de Issues V1

Este documento registra issues minimas e modulares para o MVP do Radar Escola.

As 85 issues principais da V1 ja foram cadastradas no GitHub e estao
referenciadas na linha de corte ao final deste arquivo. Novas iniciativas
transversais, como Docker, devem ser adicionadas somente apos decisao explicita,
sem alterar retroativamente o escopo original da V1.

## Resumo Quantitativo

Total planejado para o ciclo completo da V1: **85 issues**.

Esse total cobre concepcao, validacao documental, modelagem de dominio,
persistencia, infraestrutura executavel, application/controller, interface,
testes, QA de software, release desktop e documentacao de apoio.

Observacao sobre Docker: a dockerizacao do ambiente tecnico esta documentada em
`PROJETO_DOCKERIZACAO_AMBIENTE.md` como iniciativa transversal candidata. Ela
nao altera o total de 85 issues da V1 do MVP. As issues Docker foram
cadastradas depois como uma trilha transversal de engenharia, registrada em
linha de corte propria neste documento.

| Grupo | Foco | Quantidade |
| --- | --- | --- |
| `REQ` | Validacao de requisitos e concepcao | 5 |
| `DOM` | Dominio, regras puras e modelagem | 14 |
| `PER` | Persistencia, schema SQLite, repositorios e CSV | 11 |
| `ENG` | Infraestrutura executavel, hashing, CI e release | 4 |
| `APP` | Casos de uso e orquestracao | 20 |
| `VIEW` | Telas, formularios, estados e mensagens | 14 |
| `QA` | Testes, QA funcional, seguranca, acessibilidade e regressao | 15 |
| `DOC` | Documentacao de apoio para execucao e validacao | 2 |

Observacao: este numero nasceu como base de planejamento e ja foi usado para
cadastrar as issues reais no GitHub. Mudancas futuras devem preservar a
rastreabilidade com as issues abertas ou registrar claramente quando uma issue
for substituida, dividida, agrupada ou encerrada por decisao de produto.

## Convencoes

### Tipos

- `requisitos`: validar comportamento esperado.
- `dominio`: regras puras, entidades e permissoes.
- `persistencia`: SQLite, migrations, repositorios e queries.
- `engineering`: infraestrutura executavel, hashing, CI e release.
- `application`: casos de uso e orquestracao.
- `view`: telas, formularios, estados e mensagens.
- `qa`: validacao manual, automatizada ou checklist.
- `docs`: documentacao de apoio.

### Camadas

- `model`: dominio, entidades, value objects.
- `persistence`: SQLite, repositorios, CSV, filesystem.
- `infrastructure`: Tauri/Rust, bootstrap local, hashing, CI e release.
- `controller`: casos de uso e aplicacao.
- `view`: React/TypeScript, telas e componentes.
- `qa`: testes e validacao.
- `docs`: requisitos e guias.

### Labels candidatas

- `good first issue`;
- `help`;
- `help wanted`;
- `qa`;
- `documentation`;
- `domain`;
- `persistence`;
- `application`;
- `frontend`;
- `tests`;
- `ux`;
- `security`;
- `accessibility`;
- `engineering`;
- `ci`;
- `release`;

## Ordem Recomendada

1. Validar requisitos e dominio.
2. Criar entidades e regras puras.
3. Criar schema SQLite e repositorios.
4. Preparar infraestrutura local critica: hash e bootstrap SQLite.
5. Implementar casos de uso.
6. Implementar telas.
7. Cobrir testes, regressao e QA.
8. Fazer smoke do fluxo minimo e validar release desktop.

## Issues de Validacao Documental

### REQ-001 Validar atores e matriz de permissoes

- Tipo: `requisitos`
- Camada: `docs`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: revisar se direcao, apoio de gestao e usuario comum estao claros.
- Escopo:
  - validar permissoes por ator;
  - verificar excecoes;
  - confirmar limite de apoio de gestao.
- Fora de escopo:
  - implementar permissao.
- Criterios de aceite:
  - matriz de permissoes sem contradicao;
  - regras de direcao e apoio entendiveis por QA junior;
  - lacunas registradas como comentario ou ajuste documental.
- Testes esperados: revisao documental.
- Dependencias: nenhuma.
- Labels: `documentation`, `qa`, `help`, `good first issue`.

### REQ-002 Validar fluxo minimo de valor

- Tipo: `requisitos`
- Camada: `docs`
- Fonte: `FLUXO_E2E_V0.md`, `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: confirmar que o MVP entrega ciclo util completo.
- Escopo:
  - cadastrar pessoa;
  - registrar necessidade;
  - ver no radar;
  - marcar envolvidos;
  - atualizar andamento;
  - marcar como resolvido;
  - consultar historico.
- Fora de escopo:
  - exportacao/restauracao;
  - transferencia de direcao.
- Criterios de aceite:
  - cada etapa tem caso de uso;
  - cada etapa tem criterio de aceite;
  - cada etapa tem pelo menos uma tarefa tecnica planejada.
- Testes esperados: checklist documental.
- Dependencias: REQ-001.
- Labels: `documentation`, `qa`, `help`, `good first issue`.

### REQ-003 Validar fluxos de excecao dos casos de uso

- Tipo: `requisitos`
- Camada: `docs`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: revisar erros, bloqueios e caminhos alternativos.
- Escopo:
  - login invalido;
  - primeiro acesso incompleto;
  - usuario comum tentando resolver;
  - CSV invalido;
  - cargo ausente;
  - sessao bloqueada.
- Fora de escopo:
  - implementar telas de erro.
- Criterios de aceite:
  - fluxos de excecao descritos em linguagem verificavel;
  - mensagens de UX esperadas registradas;
  - guardrails relacionados identificados.
- Testes esperados: revisao documental.
- Dependencias: REQ-002.
- Labels: `documentation`, `qa`, `help`, `good first issue`.

### REQ-004 Validar guardrails de escopo

- Tipo: `requisitos`
- Camada: `docs`
- Fonte: `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`
- Objetivo: confirmar o que fica fora da V1.
- Escopo:
  - e-mail;
  - WhatsApp;
  - mobile;
  - nuvem;
  - dados de estudantes;
  - controle patrimonial completo.
- Fora de escopo:
  - roadmap futuro.
- Criterios de aceite:
  - fora de escopo esta consistente entre documentos;
  - nao ha requisito pedindo funcionalidade proibida.
- Testes esperados: revisao documental.
- Dependencias: nenhuma.
- Labels: `documentation`, `qa`, `help`, `good first issue`.

### REQ-005 Validar linguagem PT-BR da experiencia

- Tipo: `requisitos`
- Camada: `docs`
- Fonte: `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`
- Objetivo: revisar termos permitidos e proibidos.
- Escopo:
  - evitar ticket/chamado/dashboard;
  - priorizar necessidade/Radar de Necessidades;
  - mensagens orientadas a acao.
- Fora de escopo:
  - implementar componentes.
- Criterios de aceite:
  - glossario de UX revisado;
  - termos proibidos documentados;
  - exemplos de botoes e mensagens claros.
- Testes esperados: checklist de linguagem.
- Dependencias: nenhuma.
- Labels: `documentation`, `ux`, `qa`, `help`, `good first issue`.

## Issues de Dominio e Model

### DOM-001 Modelar perfis e permissao basica

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: criar regras puras para direcao, apoio e usuario comum.
- Escopo:
  - `canRegisterPerson`;
  - `canRegisterRoleOrFunction`;
  - `canManageSupport`;
  - `canResolveNeed`;
  - `canCancelOrCorrectNeed`;
  - `canExportSecurityData`;
  - `canRestoreSecurityData`;
  - `canViewAudit`;
  - `canTransferDirectorship`;
  - `canResetPassword`.
- Fora de escopo:
  - UI de permissao.
- Criterios de aceite:
  - direcao passa em acoes exclusivas;
  - apoio passa apenas nas delegadas;
  - usuario comum falha em acoes sensiveis;
  - reset, restauracao, auditoria e transferencia ficam exclusivos da direcao.
- Testes esperados: unitarios positivos e negativos.
- Dependencias: REQ-001.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-002 Modelar escola e direcao atual

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: representar escola local e responsavel principal.
- Escopo:
  - entidade escola;
  - regra de uma escola ativa;
  - regra de direcao atual.
- Fora de escopo:
  - migration SQLite.
- Criterios de aceite:
  - escola exige nome;
  - direcao atual exige pessoa ativa;
  - segunda escola ativa e bloqueada em regra.
- Testes esperados: unitarios.
- Dependencias: DOM-001.
- Labels: `domain`, `good first issue`.

### DOM-003 Modelar pessoa, cargo e conta

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: criar regras de pessoa cadastrada e conta local.
- Escopo:
  - pessoa ativa/inativa;
  - cargo/funcao;
  - usuario unico;
  - estado de primeiro acesso.
- Fora de escopo:
  - hash real de senha.
- Criterios de aceite:
  - nome obrigatorio;
  - cargo obrigatorio;
  - usuario obrigatorio;
  - conta com primeiro acesso bloqueia uso normal.
- Testes esperados: unitarios.
- Dependencias: DOM-002.
- Labels: `domain`, `good first issue`.

### DOM-004 Modelar senha temporaria e salvaguarda

- Tipo: `dominio`
- Camada: `model`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`, `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: representar regras de primeiro acesso e recuperacao local.
- Escopo:
  - senha temporaria `123456`;
  - obrigatoriedade de troca;
  - token exibido uma vez;
  - frase/resposta protegida.
- Fora de escopo:
  - escolha de biblioteca concreta de Argon2id.
- Criterios de aceite:
  - senha final nao pode ser `123456`;
  - salvaguarda e obrigatoria;
  - token e frase/resposta sao configurados;
  - token nao e regeneravel;
  - senhas, tokens e respostas usam hash Argon2id via servico Tauri/Rust.
- Testes esperados: unitarios.
- Dependencias: DOM-003.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-005 Modelar apoio de gestao

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: aplicar delegacao unica limitada a duas pessoas.
- Escopo:
  - limite de dois apoios ativos;
  - revogacao;
  - permissao derivada da delegacao.
- Fora de escopo:
  - tela de selecao.
- Criterios de aceite:
  - primeiro e segundo apoio permitidos;
  - terceiro apoio bloqueado;
  - apoio nao ganha permissao de exportacao/auditoria.
- Testes esperados: unitarios.
- Dependencias: DOM-001, DOM-003.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-006 Modelar necessidade e status

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: representar necessidade, prioridade e transicoes.
- Escopo:
  - campos obrigatorios;
  - prioridades;
  - status ativos/finais;
  - transicoes permitidas.
- Fora de escopo:
  - persistencia.
- Criterios de aceite:
  - necessidade exige titulo, descricao e local;
  - status final nao reabre na V1;
  - usuario comum nao transiciona para resolvida/cancelada.
- Testes esperados: unitarios.
- Dependencias: DOM-001.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-007 Modelar envolvidos

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: vincular pessoas ativas a necessidades ativas.
- Escopo:
  - adicionar envolvido;
  - remover logicamente;
  - evitar duplicidade ativa.
- Fora de escopo:
  - notificacao.
- Criterios de aceite:
  - pessoa inativa nao entra;
  - duplicidade ativa bloqueada;
  - necessidade final nao aceita envolvido.
- Testes esperados: unitarios.
- Dependencias: DOM-003, DOM-006.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-008 Modelar andamento e fechamento tecnico

- Tipo: `dominio`
- Camada: `model`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: registrar atualizacoes sem encerrar por usuario comum.
- Escopo:
  - andamento comum;
  - fechamento tecnico;
  - texto obrigatorio;
  - status apos atualizacao.
- Fora de escopo:
  - editor rico.
- Criterios de aceite:
  - andamento exige descricao;
  - fechamento tecnico nao marca resolvida;
  - necessidade final nao recebe andamento.
- Testes esperados: unitarios.
- Dependencias: DOM-006.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-009 Modelar resolucao e cancelamento

- Tipo: `dominio`
- Camada: `model`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: encerrar necessidade com regras de gestao.
- Escopo:
  - resolver;
  - cancelar;
  - resumo/motivo obrigatorio;
  - autor e data.
- Fora de escopo:
  - reabertura.
- Criterios de aceite:
  - direcao/apoio resolvem;
  - usuario comum bloqueado;
  - cancelamento exige motivo.
- Testes esperados: unitarios.
- Dependencias: DOM-001, DOM-006.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-010 Modelar equipamento basico

- Tipo: `dominio`
- Camada: `model`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: representar equipamento como apoio operacional.
- Escopo:
  - nome;
  - local;
  - identificacao opcional;
  - estado atual;
  - inativacao.
- Fora de escopo:
  - patrimonio completo.
- Criterios de aceite:
  - nome/local obrigatorios;
  - estado atual obrigatorio;
  - identificacao informada e unica;
  - equipamento com historico nao e apagado fisicamente;
  - edicao/inativacao ficam restritas a gestao.
- Testes esperados: unitarios.
- Dependencias: nenhuma.
- Labels: `domain`, `good first issue`.

### DOM-011 Modelar auditoria

- Tipo: `dominio`
- Camada: `model`
- Fonte: `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`
- Objetivo: padronizar eventos sensiveis sem segredos.
- Escopo:
  - tipos de evento;
  - resumo legivel;
  - entidade afetada;
  - proibicao de segredo.
- Fora de escopo:
  - tela.
- Criterios de aceite:
  - evento obrigatorio validado;
  - segredo rejeitado ou omitido;
  - evento imutavel pela regra.
- Testes esperados: unitarios.
- Dependencias: DOM-001.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-012 Modelar plano de acao simples

- Tipo: `dominio`
- Camada: `model`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`, `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: representar proximos passos dentro de uma necessidade sem criar
  gerenciador complexo de tarefas.
- Escopo:
  - descricao obrigatoria;
  - responsavel opcional;
  - conclusao de item;
  - bloqueio de novo item em necessidade final.
- Fora de escopo:
  - prazos;
  - checklist avancado;
  - atribuicao automatica.
- Criterios de aceite:
  - item exige descricao;
  - item concluido preserva autor e data;
  - necessidade resolvida/cancelada nao recebe novo item.
- Testes esperados: unitarios.
- Dependencias: DOM-006.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-013 Modelar sessao local

- Tipo: `dominio`
- Camada: `model`
- Fonte: UC-023, UC-024, BT-002
- Objetivo: representar sessao local, logout e bloqueio por inatividade.
- Escopo:
  - sessao autenticada;
  - calculo de inatividade;
  - estado bloqueado;
  - desbloqueio pelo usuario atual;
  - troca de usuario somente por logout.
- Fora de escopo:
  - sessao multi-computador;
  - biometria;
  - PIN do Windows.
- Criterios de aceite:
  - 30 minutos sem atividade bloqueiam a sessao;
  - senha correta do usuario atual desbloqueia;
  - outro usuario nao assume sessao bloqueada;
  - logout encerra contexto sensivel.
- Testes esperados: unitarios.
- Dependencias: DOM-003.
- Labels: `domain`, `tests`, `good first issue`.

### DOM-014 Modelar pacote de seguranca exportavel/restauravel

- Tipo: `dominio`
- Camada: `model`
- Fonte: D-012, D-013, BT-007
- Objetivo: definir regras puras do pacote de seguranca usado para exportar e
  restaurar dados locais sem transformar CSV em importador generico.
- Escopo:
  - versao do formato;
  - manifesto do pacote;
  - conjunto minimo de entidades exportaveis;
  - proibicao de senhas, tokens e respostas em texto claro;
  - regra de restauracao por substituicao total;
  - bloqueio explicito de mescla.
- Fora de escopo:
  - parsing fisico de arquivos CSV;
  - escolha de diretorio no sistema operacional;
  - migracao entre versoes futuras do formato.
- Criterios de aceite:
  - pacote sem versao valida e rejeitado;
  - pacote incompleto e rejeitado;
  - pacote nunca permite segredo claro;
  - restauracao sempre representa substituicao total, nao mescla.
- Testes esperados: unitarios.
- Dependencias: DOM-004, DOM-011.
- Labels: `domain`, `tests`, `security`, `good first issue`.

## Issues de Persistencia

### PER-001 Criar migrations iniciais SQLite

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: `REGRAS_DE_DOMINIO_V1.md`
- Objetivo: criar schema inicial das tabelas MVP.
- Escopo:
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
- Fora de escopo:
  - geracao, parsing e restauracao de CSV.
- Criterios de aceite:
  - migration roda em banco vazio;
  - constraints basicas existem;
  - tabelas de metadados de seguranca existem;
  - testes de criacao do schema passam.
- Testes esperados: persistencia.
- Dependencias: DOM-002 a DOM-012, DOM-014, BT-001, BT-007.
- Labels: `persistence`, `tests`.

### PER-002 Implementar repositorio de escola

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-001
- Objetivo: persistir e consultar escola configurada.
- Escopo:
  - `isSchoolConfigured`;
  - `getConfiguredSchool`;
  - `createSchool`;
  - `transferDirectorship`.
- Fora de escopo:
  - UI.
- Criterios de aceite:
  - uma escola configurada e retornada;
  - transferencia atualiza diretor atual.
- Testes esperados: persistencia.
- Dependencias: PER-001.
- Labels: `persistence`, `good first issue`.

### PER-003 Implementar repositorios de pessoa, cargo e conta

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-002, D-003, D-004
- Objetivo: suportar cadastro e login.
- Escopo:
  - criar cargo;
  - listar cargos;
  - criar pessoa;
  - criar conta;
  - buscar conta por usuario;
  - listar pessoas ativas.
- Fora de escopo:
  - executar algoritmo de hash dentro do repositorio.
- Criterios de aceite:
  - usuario duplicado falha;
  - pessoa ativa aparece em seletores;
  - conta retorna estado de primeiro acesso.
- Testes esperados: persistencia.
- Dependencias: PER-001.
- Labels: `persistence`.

### PER-004 Implementar repositorio de salvaguarda

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-005
- Objetivo: persistir e validar dados protegidos de recuperacao.
- Escopo:
  - salvar hashes;
  - recuperar salvaguarda ativa por conta;
  - atualizar frase/resposta quando permitido;
  - invalidar salvaguarda anterior no reset administrativo.
- Fora de escopo:
  - UI de recuperacao.
- Criterios de aceite:
  - token claro nao e persistido;
  - resposta clara nao e persistida;
  - token e frase/resposta existem na salvaguarda V1;
  - salvaguarda invalidada nao recupera acesso.
- Testes esperados: persistencia e seguranca.
- Dependencias: PER-003.
- Labels: `persistence`, `tests`.

### PER-005 Implementar repositorio de necessidades

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-007
- Objetivo: persistir necessidade e consultar radar.
- Escopo:
  - criar necessidade;
  - buscar por id;
  - listar ativas;
  - listar paradas;
  - listar resolvidas recentes;
  - atualizar status.
- Fora de escopo:
  - view do radar.
- Criterios de aceite:
  - criacao persiste campos obrigatorios;
  - status final altera listas;
  - parada e calculada como 7 dias corridos sem atualizacao.
- Testes esperados: persistencia.
- Dependencias: PER-001.
- Labels: `persistence`.

### PER-006 Implementar repositorios de envolvidos e andamentos

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-008, D-009
- Objetivo: suportar detalhe e historico da necessidade.
- Escopo:
  - adicionar/remover envolvido;
  - listar envolvidos;
  - criar andamento;
  - listar andamentos.
- Fora de escopo:
  - UI timeline.
- Criterios de aceite:
  - envolvido duplicado ativo bloqueado;
  - andamento preserva autor e data;
  - andamento existente nao e editado, correcao gera novo registro.
- Testes esperados: persistencia.
- Dependencias: PER-003, PER-005.
- Labels: `persistence`, `good first issue`.

### PER-007 Implementar repositorio de equipamento

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-011
- Objetivo: persistir equipamentos e vincular a necessidades.
- Escopo:
  - criar equipamento;
  - listar ativos;
  - buscar por id;
  - inativar apenas quando autorizado;
  - vinculo via necessidade;
  - listar necessidades por equipamento.
- Fora de escopo:
  - patrimonio completo.
- Criterios de aceite:
  - equipamento pode ser selecionado em necessidade;
  - historico de vinculo e preservado;
  - usuario comum nao inativa equipamento.
- Testes esperados: persistencia.
- Dependencias: PER-005.
- Labels: `persistence`, `good first issue`.

### PER-008 Implementar repositorio de auditoria

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-014, BT-001
- Objetivo: gravar e listar eventos sensiveis.
- Escopo:
  - inserir evento;
  - listar por data;
  - filtro simples por tipo;
  - impedir update via repositorio publico.
- Fora de escopo:
  - tela.
- Criterios de aceite:
  - evento gravado;
  - ordenacao correta;
  - sem update/delete publico.
- Testes esperados: persistencia.
- Dependencias: PER-001.
- Labels: `persistence`, `tests`.

### PER-009 Implementar snapshot de exportacao CSV

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-012, BT-007
- Objetivo: consultar dados consistentes para exportacao.
- Escopo:
  - montar snapshot;
  - incluir tabelas essenciais;
  - incluir auditoria historica;
  - preservar vinculos;
  - excluir segredos claros.
- Fora de escopo:
  - UI de escolha de destino.
- Criterios de aceite:
  - snapshot contem dados suficientes;
  - auditoria historica entra no pacote;
  - senhas/tokens claros ausentes.
- Testes esperados: persistencia.
- Dependencias: DOM-014, PER-001 a PER-008.
- Labels: `persistence`, `tests`.

### PER-010 Implementar restauracao de seguranca

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-013, BT-007
- Objetivo: validar pacote exportado e substituir dados locais de forma
  controlada.
- Escopo:
  - validar estrutura do pacote CSV;
  - validar versao do formato;
  - preparar substituicao total dos dados atuais;
  - restaurar auditoria historica do pacote;
  - registrar evento da restauracao atual apos substituir os dados;
  - executar restauracao em transacao ou com copia tecnica;
  - impedir mescla;
  - preservar integridade ou falhar sem alterar dados.
- Fora de escopo:
  - importador generico de planilhas externas;
  - mescla entre banco atual e pacote importado.
- Criterios de aceite:
  - pacote valido restaura dados;
  - pacote invalido nao altera banco;
  - restauracao substitui, nao mescla;
  - auditoria historica importada fica disponivel;
  - evento da restauracao atual fica registrado com snapshot do ator;
  - falha parcial nao deixa banco inconsistente.
- Testes esperados: persistencia/integracao.
- Dependencias: DOM-014, PER-001, PER-009, PER-008.
- Labels: `persistence`, `tests`.

### PER-011 Implementar repositorio de plano de acao

- Tipo: `persistencia`
- Camada: `persistence`
- Fonte: D-010
- Objetivo: persistir proximos passos simples vinculados a necessidades.
- Escopo:
  - criar item de plano;
  - listar itens por necessidade;
  - listar itens abertos;
  - concluir item;
  - preservar autor e data.
- Fora de escopo:
  - delete fisico;
  - prazos e alertas.
- Criterios de aceite:
  - item criado aparece no detalhe;
  - item concluido registra responsavel e data;
  - necessidade final nao recebe novo item.
- Testes esperados: persistencia.
- Dependencias: PER-005.
- Labels: `persistence`, `good first issue`.

## Issues de Engenharia e Infraestrutura Executavel

### ENG-001 Implementar servico Tauri/Rust de hash Argon2id

- Tipo: `engineering`
- Camada: `infrastructure`
- Fonte: BT-003, `src/infrastructure`
- Objetivo: fornecer servico local para gerar e verificar hashes de senha,
  token e resposta de recuperacao sem expor segredos para logs ou UI.
- Escopo:
  - comando/servico Tauri/Rust para gerar hash Argon2id;
  - comando/servico para verificar segredo contra hash;
  - salt aleatorio por segredo;
  - contrato TypeScript para a camada de application;
  - tratamento de erro sem revelar valor informado.
- Fora de escopo:
  - regra de negocio de primeiro acesso;
  - armazenamento dos hashes;
  - recuperacao por e-mail, WhatsApp ou nuvem.
- Criterios de aceite:
  - senha, token e resposta produzem hashes verificaveis;
  - o mesmo segredo nao depende de hash fixo;
  - segredo claro nao e retornado nem logado;
  - testes cobrem sucesso, falha e erro generico.
- Testes esperados: unitarios Rust quando possivel e teste de contrato.
- Dependencias: nenhuma.
- Labels: `security`, `tests`, `engineering`.

### ENG-002 Implementar bootstrap SQLite local

- Tipo: `engineering`
- Camada: `infrastructure`
- Fonte: `docs/architecture.md`, `docs/implementation-plan.md`
- Objetivo: abrir ou criar o banco local no diretorio adequado do app desktop e
  aplicar migrations de forma idempotente.
- Escopo:
  - resolver diretorio local de dados do aplicativo;
  - criar arquivo SQLite quando nao existir;
  - aplicar migrations na abertura;
  - expor contrato de conexao para repositorios;
  - retornar erro claro quando banco nao puder ser aberto.
- Fora de escopo:
  - modelagem de tabelas;
  - sincronizacao em nuvem;
  - multiplo computador.
- Criterios de aceite:
  - app inicia com banco inexistente e cria estrutura minima;
  - reabrir app nao duplica migration;
  - erro de abertura nao mostra stack tecnica para usuario final;
  - testes usam banco temporario controlado.
- Testes esperados: integracao de infraestrutura.
- Dependencias: PER-001.
- Labels: `persistence`, `engineering`, `tests`.

### ENG-003 Evoluir CI para testes automatizados do app

- Tipo: `engineering`
- Camada: `infrastructure`
- Fonte: `docs/ci.md`, BT-010
- Objetivo: garantir que a CI rode o conjunto minimo de qualidade do MVP alem
  de typecheck e build frontend.
- Escopo:
  - rodar testes unitarios;
  - rodar testes de persistencia viaveis no runner;
  - manter `All CI checks` como agregado protegido;
  - incluir checks Rust/Tauri quando houver codigo Rust relevante;
  - preservar permissoes minimas do workflow.
- Fora de escopo:
  - publicar release;
  - exigir servicos pagos;
  - testes manuais.
- Criterios de aceite:
  - PR normal executa typecheck, build e testes minimos;
  - falha de teste quebra `All CI checks`;
  - workflow nao adiciona permissoes amplas desnecessarias;
  - docs de CI refletem os checks ativos.
- Testes esperados: validacao de CI em PR.
- Dependencias: QA-003, QA-004.
- Labels: `ci`, `tests`, `engineering`.

### ENG-004 Validar release desktop Windows baixavel

- Tipo: `engineering`
- Camada: `infrastructure`
- Fonte: `docs/desktop-release.md`, `docs/final-testable-delivery.md`
- Objetivo: transformar a esteira de release em entrega baixavel quando o MVP
  estiver funcional.
- Nota pos-`v0.0.1`: a release tecnica do scaffold ja publica instalador e
  checksum. Esta issue continua existindo para validar a release funcional do
  MVP, com SQLite, login e fluxo real de necessidade.
- Escopo:
  - gerar instalador Windows;
  - publicar artefato em release versionada;
  - gerar checksum SHA-256;
  - executar smoke tecnico do artefato;
  - documentar limitacoes de assinatura quando aplicavel.
- Fora de escopo:
  - loja de aplicativos;
  - assinatura paga obrigatoria;
  - atualizador automatico.
- Criterios de aceite:
  - tag de release gera artefato baixavel;
  - checksum acompanha artefato;
  - smoke tecnico valida que artefato existe e app abre quando viavel;
  - release nao promete funcionalidade ainda ausente.
- Testes esperados: workflow manual/tag e smoke Windows.
- Dependencias: QA-015.
- Labels: `release`, `ci`, `engineering`.

## Issues de Application/Controller

### APP-001 Implementar configuracao inicial da escola

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-001
- Objetivo: orquestrar escola, direcao, conta, salvaguarda e auditoria.
- Escopo:
  - validar dados;
  - criar escola;
  - criar direcao;
  - salvar senha hash;
  - criar salvaguarda;
  - registrar auditoria.
- Fora de escopo:
  - tela.
- Criterios de aceite:
  - operacao transacional;
  - falha parcial nao deixa banco inconsistente.
- Testes esperados: caso de uso.
- Dependencias: PER-002, PER-003, PER-004, PER-008, ENG-001.
- Labels: `application`.

### APP-002 Implementar login

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-002
- Objetivo: autenticar usuario e decidir destino.
- Escopo:
  - validar senha;
  - checar conta ativa;
  - checar primeiro acesso;
  - criar sessao.
- Fora de escopo:
  - tela.
- Criterios de aceite:
  - login valido entra;
  - senha invalida falha;
  - primeiro acesso redireciona.
- Testes esperados: caso de uso.
- Dependencias: PER-003, DOM-004, ENG-001.
- Labels: `application`, `tests`, `good first issue`.

### APP-003 Implementar primeiro acesso

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-003
- Objetivo: trocar senha temporaria e criar salvaguarda.
- Escopo:
  - bloquear `123456`;
  - validar confirmacao;
  - salvar hash;
  - salvar salvaguarda;
  - remover flag de primeiro acesso.
- Fora de escopo:
  - recuperacao posterior.
- Criterios de aceite:
  - usuario nao usa sistema antes de concluir;
  - token e frase/resposta ficam configurados;
  - token exibido uma unica vez.
- Testes esperados: caso de uso.
- Dependencias: APP-002, PER-004, ENG-001.
- Labels: `application`, `tests`.

### APP-004 Implementar cadastro de pessoa

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-006
- Objetivo: cadastrar pessoa com conta temporaria.
- Escopo:
  - validar permissao;
  - criar cargo se necessario por fluxo separado;
  - criar pessoa;
  - criar conta com `123456`;
  - registrar auditoria.
- Fora de escopo:
  - tela.
- Criterios de aceite:
  - direcao/apoio cadastram;
  - usuario comum bloqueado;
  - conta exige primeiro acesso.
- Testes esperados: caso de uso.
- Dependencias: APP-017, PER-003, PER-008, DOM-001.
- Labels: `application`.

### APP-005 Implementar apoio de gestao

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-007
- Objetivo: conceder/revogar apoio respeitando limite.
- Escopo:
  - validar direcao;
  - contar apoios ativos;
  - conceder/revogar;
  - registrar auditoria.
- Fora de escopo:
  - tela de pessoas.
- Criterios de aceite:
  - terceiro apoio bloqueado;
  - auditoria criada.
- Testes esperados: caso de uso.
- Dependencias: DOM-005, PER-008.
- Labels: `application`, `tests`.

### APP-006 Implementar registro de necessidade

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-008
- Objetivo: criar necessidade e historico inicial.
- Escopo:
  - validar campos;
  - criar necessidade;
  - vincular envolvidos iniciais;
  - vincular equipamento opcional;
  - criar andamento inicial.
- Fora de escopo:
  - view.
- Criterios de aceite:
  - necessidade aparece em query do radar;
  - historico inicial existe.
- Testes esperados: caso de uso.
- Dependencias: PER-005, PER-006, PER-007.
- Labels: `application`.

### APP-007 Implementar Radar de Necessidades

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-009
- Objetivo: montar dados da tela principal.
- Escopo:
  - ativas;
  - paradas;
  - resolvidas recentes;
  - estado vazio.
- Fora de escopo:
  - layout visual.
- Criterios de aceite:
  - classifica parada;
  - separa resolvidas;
  - oculta canceladas das ativas.
- Testes esperados: caso de uso.
- Dependencias: PER-005.
- Labels: `application`, `good first issue`.

### APP-008 Implementar envolvidos

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-010
- Objetivo: adicionar/remover envolvidos e registrar historico.
- Escopo:
  - validar necessidade ativa;
  - validar pessoa ativa;
  - evitar duplicidade;
  - registrar andamento de sistema quando relevante.
- Fora de escopo:
  - notificacao.
- Criterios de aceite:
  - envolvidos aparecem no detalhe;
  - alteracao preservada.
- Testes esperados: caso de uso.
- Dependencias: PER-006.
- Labels: `application`.

### APP-009 Implementar andamento e fechamento tecnico

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-011, UC-013
- Objetivo: registrar atualizacoes e solicitacao tecnica.
- Escopo:
  - andamento comum;
  - alteracao de status operacional;
  - fechamento tecnico;
  - atualizar ultima movimentacao.
- Fora de escopo:
  - resolver oficialmente.
- Criterios de aceite:
  - usuario comum registra fechamento tecnico sem resolver.
- Testes esperados: caso de uso.
- Dependencias: PER-006, DOM-008.
- Labels: `application`, `tests`.

### APP-010 Implementar resolucao e cancelamento

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-014, UC-015
- Objetivo: encerrar necessidade com permissao de gestao.
- Escopo:
  - resolver;
  - cancelar;
  - validar resumo/motivo;
  - registrar historico;
  - registrar auditoria.
- Fora de escopo:
  - reabertura.
- Criterios de aceite:
  - usuario comum bloqueado;
  - auditoria criada;
  - status final aplicado.
- Testes esperados: caso de uso.
- Dependencias: PER-005, PER-006, PER-008, DOM-009.
- Labels: `application`, `tests`.

### APP-011 Implementar exportacao de seguranca

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-019
- Objetivo: orquestrar exportacao restauravel local.
- Escopo:
  - validar direcao;
  - gerar snapshot;
  - exportar CSV;
  - orientar destino externo;
  - registrar auditoria.
- Fora de escopo:
  - restauracao de dados;
  - importador generico.
- Criterios de aceite:
  - apoio/usuario comum bloqueados;
  - CSV restauravel gerado;
  - exportacao nao contem senha, token ou resposta em texto claro;
  - auditoria registra exportacao.
- Testes esperados: integracao.
- Dependencias: DOM-014, PER-009, PER-008.
- Labels: `application`, `persistence`, `tests`.

### APP-012 Implementar recuperacao local de acesso

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-004, BT-003
- Objetivo: permitir redefinicao de senha por salvaguarda local sem internet.
- Escopo:
  - receber usuario ou nome;
  - carregar salvaguarda disponivel;
  - validar token ou resposta da frase;
  - permitir nova senha quando salvaguarda for valida;
  - salvar nova senha como hash;
  - registrar evento sensivel quando aplicavel.
- Fora de escopo:
  - recuperacao por e-mail;
  - suporte remoto;
  - exibir token antigo.
- Criterios de aceite:
  - token valido permite nova senha;
  - resposta valida permite nova senha;
  - direcao, apoio de gestao e usuario comum recuperam a propria conta quando
    a salvaguarda e valida;
  - dados invalidos nao revelam se usuario existe;
  - nova senha nao pode ser `123456`;
  - senha redefinida fica armazenada apenas como hash.
- Testes esperados: caso de uso e seguranca.
- Dependencias: PER-003, PER-004, PER-008, DOM-004, ENG-001.
- Labels: `application`, `tests`, `security`.

### APP-013 Implementar plano de acao simples

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-012
- Objetivo: criar e concluir proximos passos dentro de uma necessidade ativa.
- Escopo:
  - validar necessidade ativa;
  - criar item de plano;
  - concluir item;
  - registrar andamento de sistema quando relevante;
  - retornar lista atualizada para detalhe.
- Fora de escopo:
  - notificacao;
  - prazos;
  - calendario.
- Criterios de aceite:
  - todos os perfis autenticados podem criar item em necessidade ativa;
  - item concluido preserva autor/data;
  - necessidade final bloqueia alteracao.
- Testes esperados: caso de uso.
- Dependencias: PER-011, PER-006, DOM-012.
- Labels: `application`, `tests`.

### APP-014 Implementar sessao, logout e bloqueio

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-023, UC-024, BT-002
- Objetivo: controlar sessao local em computador compartilhado.
- Escopo:
  - criar sessao apos login;
  - encerrar sessao por logout;
  - calcular inatividade;
  - bloquear apos 30 minutos;
  - desbloquear com senha do usuario atual;
  - limpar estado sensivel ao sair.
- Fora de escopo:
  - persistencia de sessao entre computadores;
  - bloqueio por tentativas erradas;
  - login externo.
- Criterios de aceite:
  - logout retorna ao login;
  - tela bloqueada nao expõe dados da tela anterior;
  - senha incorreta mantem bloqueado;
  - usuario pode sair a partir da tela bloqueada.
- Testes esperados: caso de uso e interface focada.
- Dependencias: APP-002, DOM-013, PER-003.
- Labels: `application`, `tests`, `ux`.

### APP-015 Implementar consulta de auditoria

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-021, BT-001
- Objetivo: permitir que a direcao consulte eventos sensiveis sem expor
  segredos.
- Escopo:
  - validar direcao;
  - listar eventos recentes;
  - filtrar por tipo;
  - filtrar por periodo simples;
  - omitir qualquer dado sensivel.
- Fora de escopo:
  - dashboard analitico;
  - edicao de eventos;
  - exportacao especifica de auditoria fora do pacote de seguranca.
- Criterios de aceite:
  - direcao consulta eventos;
  - apoio e usuario comum sao bloqueados;
  - eventos aparecem em ordem recente;
  - conteudo nao exibe senha, token, resposta ou hash sensivel.
- Testes esperados: caso de uso e permissao.
- Dependencias: PER-008, DOM-011, DOM-001.
- Labels: `application`, `tests`, `security`.

### APP-016 Implementar transferencia de direcao

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-022, BT-008
- Objetivo: transferir responsabilidade principal da escola para pessoa ativa.
- Escopo:
  - validar direcao atual;
  - listar pessoas candidatas ativas;
  - bloquear transferencia para pessoa inativa;
  - alterar direcao atual;
  - recalcular permissoes exclusivas;
  - registrar auditoria.
- Fora de escopo:
  - multiplas direcoes;
  - procedimento tecnico quando direcao perdeu acesso;
  - permissao automatica por cargo/funcao.
- Criterios de aceite:
  - direcao atual transfere para pessoa ativa;
  - apoio e usuario comum sao bloqueados;
  - nova direcao recebe acoes exclusivas;
  - antiga direcao perde exclusividade, salvo outra delegacao;
  - auditoria registra transferencia.
- Testes esperados: caso de uso e permissao.
- Dependencias: PER-002, PER-003, PER-008, DOM-001.
- Labels: `application`, `tests`, `security`.

### APP-017 Implementar cadastro de cargo ou funcao

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-005
- Objetivo: cadastrar cargo/funcao sem transformar texto de cargo em permissao.
- Escopo:
  - validar permissao de direcao ou apoio;
  - validar nome obrigatorio;
  - validar duplicidade normalizada;
  - criar cargo/funcao ativo;
  - permitir uso no fluxo de cadastro de pessoa.
- Fora de escopo:
  - permissao automatica por cargo;
  - hierarquia complexa;
  - organograma.
- Criterios de aceite:
  - direcao cadastra cargo/funcao;
  - apoio cadastra cargo/funcao;
  - usuario comum e bloqueado;
  - duplicidade normalizada e bloqueada ou orientada.
- Testes esperados: caso de uso.
- Dependencias: PER-003, DOM-003, DOM-001.
- Labels: `application`, `good first issue`.

### APP-018 Implementar equipamento e vinculo operacional

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-017, UC-018, BT-009
- Objetivo: cadastrar equipamento simples e vincular a necessidades sem virar
  controle patrimonial.
- Escopo:
  - cadastrar equipamento simples;
  - listar equipamentos ativos;
  - vincular equipamento a necessidade;
  - remover vinculo marcado por engano;
  - bloquear equipamento inativo;
  - restringir edicao/inativacao a direcao ou apoio.
- Fora de escopo:
  - patrimonio completo;
  - QR Code;
  - nota fiscal;
  - responsavel patrimonial formal.
- Criterios de aceite:
  - usuario autenticado cria equipamento simples quando precisar vincular;
  - usuario comum nao edita nem inativa equipamento;
  - necessidade ativa pode vincular/remover equipamento;
  - necessidade final bloqueia alteracao de vinculo.
- Testes esperados: caso de uso.
- Dependencias: PER-005, PER-007, DOM-010.
- Labels: `application`, `tests`, `good first issue`.

### APP-019 Implementar reset administrativo de senha

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-025, BT-003, D-004
- Objetivo: permitir que a direcao redefina senha de pessoa cadastrada que nao
  seja a direcao atual para senha temporaria `123456`.
- Escopo:
  - validar direcao;
  - bloquear apoio e usuario comum;
  - bloquear reset da propria direcao por este fluxo;
  - salvar hash da senha temporaria;
  - marcar conta como primeiro acesso;
  - invalidar salvaguarda anterior;
  - registrar auditoria `PASSWORD_RESET`.
- Fora de escopo:
  - permitir apoio redefinir senha;
  - exibir senha final;
  - recuperacao tecnica da direcao que perdeu tudo.
- Criterios de aceite:
  - direcao reseta pessoa permitida;
  - conta resetada exige primeiro acesso;
  - senha `123456` nao fica em texto claro;
  - salvaguarda anterior nao recupera mais a conta;
  - auditoria registra acao;
  - usuario comum e apoio sao bloqueados.
- Testes esperados: caso de uso e seguranca.
- Dependencias: PER-003, PER-008, DOM-004, DOM-001, ENG-001.
- Labels: `application`, `tests`, `security`.

### APP-020 Implementar restauracao de seguranca

- Tipo: `application`
- Camada: `controller`
- Fonte: UC-020
- Objetivo: orquestrar restauracao restauravel local substituindo os dados
  atuais.
- Escopo:
  - validar direcao;
  - validar pacote exportado pelo Radar Escola;
  - exigir confirmacao forte;
  - restaurar substituindo dados;
  - impedir mescla;
  - registrar auditoria com snapshot do ator.
- Fora de escopo:
  - exportacao de dados;
  - importador generico;
  - mescla de registros.
- Criterios de aceite:
  - apoio/usuario comum bloqueados;
  - pacote valido restaura substituindo;
  - pacote invalido nao altera banco;
  - auditoria registra restauracao.
- Testes esperados: integracao e seguranca.
- Dependencias: DOM-014, PER-010, PER-008.
- Labels: `application`, `persistence`, `tests`, `security`.

## Issues de View

### VIEW-001 Criar tela de primeiro uso

- Tipo: `view`
- Camada: `view`
- Fonte: UC-001
- Objetivo: permitir configuracao inicial com linguagem simples.
- Escopo:
  - formulario de escola/direcao;
  - senha;
  - salvaguarda;
  - alerta de perda de acesso.
- Fora de escopo:
  - estilos finais sofisticados.
- Criterios de aceite:
  - campos obrigatorios claros;
  - token destacado;
  - proximo passo evidente.
- Testes esperados: interface.
- Dependencias: APP-001.
- Labels: `frontend`, `ux`.

### VIEW-002 Criar tela de login e primeiro acesso

- Tipo: `view`
- Camada: `view`
- Fonte: UC-002, UC-003
- Objetivo: autenticar e conduzir troca obrigatoria.
- Escopo:
  - login;
  - erro generico;
  - tela de primeiro acesso;
  - aviso de privacidade.
- Fora de escopo:
  - recuperacao visual completa.
- Criterios de aceite:
  - primeiro acesso nao pode ser pulado;
  - mensagens em PT-BR.
- Testes esperados: interface.
- Dependencias: APP-002, APP-003.
- Labels: `frontend`, `ux`, `tests`.

### VIEW-003 Criar cadastro de pessoas e cargos

- Tipo: `view`
- Camada: `view`
- Fonte: UC-005, UC-006
- Objetivo: cadastrar pessoa com cargo e senha temporaria.
- Escopo:
  - formulario pessoa;
  - seletor de cargo;
  - criar cargo no fluxo;
  - aviso senha `123456`.
- Fora de escopo:
  - gestao avancada de perfis.
- Criterios de aceite:
  - cargo ausente nao bloqueia fluxo;
  - aviso de primeiro acesso aparece.
- Testes esperados: interface.
- Dependencias: APP-004, APP-017.
- Labels: `frontend`, `good first issue`.

### VIEW-004 Criar Radar de Necessidades

- Tipo: `view`
- Camada: `view`
- Fonte: UC-009
- Objetivo: mostrar necessidades em andamento, paradas e resolvidas recentes.
- Escopo:
  - lista/cards;
  - estado vazio;
  - acao "Tenho algo para resolver";
  - destaque de paradas.
- Fora de escopo:
  - graficos.
- Criterios de aceite:
  - usuario entende proximo passo;
  - status nao depende so de cor.
- Testes esperados: interface.
- Dependencias: APP-007.
- Labels: `frontend`, `ux`.

### VIEW-005 Criar formulario de necessidade

- Tipo: `view`
- Camada: `view`
- Fonte: UC-008
- Objetivo: registrar necessidade operacional.
- Escopo:
  - titulo;
  - descricao;
  - local;
  - prioridade;
  - envolvidos;
  - equipamento opcional;
  - acesso ao cadastro simples de equipamento quando necessario.
- Fora de escopo:
  - anexos/fotos.
- Criterios de aceite:
  - campos obrigatorios validados;
  - orientacao para nao identificar estudantes.
- Testes esperados: interface.
- Dependencias: APP-006, APP-018.
- Labels: `frontend`, `ux`.

### VIEW-006 Criar detalhe da necessidade

- Tipo: `view`
- Camada: `view`
- Fonte: UC-010 a UC-016
- Objetivo: centralizar envolvidos, andamento, plano e historico.
- Escopo:
  - resumo;
  - envolvidos;
  - plano de acao simples;
  - historico;
  - registrar andamento;
  - solicitar fechamento tecnico;
  - resolver/cancelar para gestao.
- Fora de escopo:
  - comentarios ricos.
- Criterios de aceite:
  - usuario comum nao ve acao de resolver como permitida;
  - plano de acao aparece no detalhe;
  - historico claro.
- Testes esperados: interface.
- Dependencias: APP-008, APP-009, APP-010, APP-013.
- Labels: `frontend`, `tests`.

### VIEW-007 Criar fluxo de exportacao/restauracao

- Tipo: `view`
- Camada: `view`
- Fonte: UC-019, UC-020
- Objetivo: permitir seguranca local para direcao.
- Escopo:
  - exportar;
  - orientacao de pendrive/outra maquina;
  - restaurar;
  - confirmacao forte.
- Fora de escopo:
  - importador de planilha externa.
- Criterios de aceite:
  - apoio/usuario comum nao acessam;
  - restauracao avisa substituicao.
- Testes esperados: interface/QA.
- Dependencias: APP-011, APP-020.
- Labels: `frontend`, `qa`.

### VIEW-008 Criar tela de recuperacao de acesso

- Tipo: `view`
- Camada: `view`
- Fonte: UC-004
- Objetivo: permitir recuperacao local com linguagem simples e segura.
- Escopo:
  - entrada de usuario ou nome;
  - escolha entre token ou frase quando disponivel;
  - campo de nova senha;
  - mensagens genericas para falha;
  - orientacao para procurar direcao quando usuario comum perder salvaguarda.
- Fora de escopo:
  - e-mail;
  - WhatsApp;
  - exibicao de token antigo.
- Criterios de aceite:
  - mensagens nao revelam existencia de conta;
  - usuario entende proximo passo quando falha;
  - nova senha segue regras do primeiro acesso.
- Testes esperados: interface.
- Dependencias: APP-012.
- Labels: `frontend`, `ux`, `tests`.

### VIEW-009 Criar logout e tela bloqueada

- Tipo: `view`
- Camada: `view`
- Fonte: UC-023, UC-024
- Objetivo: permitir sair da conta e desbloquear sessao sem expor dados.
- Escopo:
  - botao visivel de sair;
  - tela de sessao bloqueada;
  - campo de senha do usuario atual;
  - acao para sair e trocar usuario;
  - mensagens simples de senha incorreta.
- Fora de escopo:
  - personalizacao visual avancada;
  - PIN, biometria ou login externo.
- Criterios de aceite:
  - todos os perfis conseguem sair;
  - bloqueio nao mostra conteudo sensivel anterior;
  - senha correta desbloqueia;
  - sair na tela bloqueada volta ao login.
- Testes esperados: interface.
- Dependencias: APP-014.
- Labels: `frontend`, `ux`, `tests`.

### VIEW-010 Criar tela simples de auditoria

- Tipo: `view`
- Camada: `view`
- Fonte: UC-021, BT-001
- Objetivo: exibir registro de acoes sensiveis apenas para direcao.
- Escopo:
  - lista de eventos recentes;
  - estado vazio;
  - filtros simples por tipo e periodo;
  - bloqueio visual para perfis sem permissao;
  - linguagem de gestao, nao tecnica.
- Fora de escopo:
  - graficos;
  - exportacao propria;
  - edicao ou remocao de evento.
- Criterios de aceite:
  - direcao entende o que aconteceu;
  - apoio/usuario comum nao acessam;
  - segredos nao aparecem na tela.
- Testes esperados: interface.
- Dependencias: APP-015.
- Labels: `frontend`, `qa`, `security`.

### VIEW-011 Criar fluxo de transferencia de direcao

- Tipo: `view`
- Camada: `view`
- Fonte: UC-022, BT-008
- Objetivo: permitir transferencia segura da responsabilidade principal.
- Escopo:
  - lista de pessoas ativas;
  - explicacao de impacto;
  - confirmacao forte;
  - mensagem para revisar apoios de gestao;
  - bloqueio para perfis sem permissao.
- Fora de escopo:
  - criacao de multiplas direcoes;
  - fluxo tecnico de recuperacao da direcao perdida.
- Criterios de aceite:
  - direcao entende que a responsabilidade sera transferida;
  - apoio/usuario comum nao acessam o fluxo;
  - confirmacao forte aparece antes de aplicar.
- Testes esperados: interface/QA.
- Dependencias: APP-016.
- Labels: `frontend`, `ux`, `security`.

### VIEW-012 Criar cadastro e seletor de equipamento

- Tipo: `view`
- Camada: `view`
- Fonte: UC-017, UC-018
- Objetivo: permitir cadastro simples e vinculo de equipamento sem linguagem de
  patrimonio.
- Escopo:
  - formulario simples de equipamento;
  - seletor de equipamento ativo;
  - acao de criar equipamento durante registro de necessidade;
  - acao de vincular/remover no detalhe;
  - bloqueio visual de edicao/inativacao para usuario comum.
- Fora de escopo:
  - inventario avancado;
  - anexos;
  - QR Code.
- Criterios de aceite:
  - equipamento criado aparece para selecao;
  - usuario comum nao ve acao permitida de inativar;
  - necessidade resolvida/cancelada nao permite alterar vinculo.
- Testes esperados: interface.
- Dependencias: APP-018.
- Labels: `frontend`, `ux`, `good first issue`.

### VIEW-013 Criar acao de reset administrativo de senha

- Tipo: `view`
- Camada: `view`
- Fonte: UC-025, BT-003
- Objetivo: permitir que direcao redefina senha de pessoa cadastrada permitida
  com alerta de primeiro acesso privado.
- Escopo:
  - acao em lista/detalhe de pessoa;
  - confirmacao forte;
  - mensagem de senha temporaria `123456`;
  - aviso de que a salvaguarda anterior deixara de valer;
  - aviso de primeiro acesso privado;
  - bloqueio visual para apoio e usuario comum.
- Fora de escopo:
  - mostrar senha final;
  - recuperar direcao sem salvaguarda.
- Criterios de aceite:
  - direcao entende que a pessoa precisara trocar senha;
  - apoio/usuario comum nao veem acao permitida;
  - mensagem nao incentiva compartilhar senha final.
- Testes esperados: interface.
- Dependencias: APP-019.
- Labels: `frontend`, `ux`, `security`.

### VIEW-014 Criar controle de apoio de gestao

- Tipo: `view`
- Camada: `view`
- Fonte: UC-007, BT-001
- Objetivo: permitir que a direcao defina ou remova ate duas pessoas como apoio
  de gestao sem transformar cargo em permissao automatica.
- Escopo:
  - lista de apoios atuais;
  - busca de pessoa ativa;
  - explicacao das permissoes delegadas;
  - bloqueio visual ao atingir limite de dois apoios;
  - acao de remover apoio existente;
  - bloqueio visual para apoio e usuario comum.
- Fora de escopo:
  - hierarquia complexa;
  - permissao automatica por cargo/funcao;
  - mais de duas pessoas delegadas.
- Criterios de aceite:
  - direcao entende o limite de dois apoios;
  - terceiro apoio fica bloqueado;
  - apoio/usuario comum nao veem acao permitida para delegar;
  - tela explica que apoio nao acessa seguranca, restauracao ou auditoria.
- Testes esperados: interface/QA.
- Dependencias: APP-005.
- Labels: `frontend`, `ux`, `security`.

## Issues de QA e Testes

### QA-001 Criar roteiro QA do fluxo minimo

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-026
- Objetivo: validar narrativa completa do MVP.
- Escopo:
  - primeiro uso;
  - cadastro pessoa;
  - necessidade;
  - envolvidos;
  - andamento;
  - resolucao;
  - historico.
- Fora de escopo:
  - teste automatizado completo.
- Criterios de aceite:
  - roteiro executavel por QA junior;
  - dados ficticios definidos;
  - resultado esperado por passo.
- Testes esperados: manual guiado.
- Dependencias: REQ-002.
- Labels: `qa`, `documentation`, `good first issue`.

### QA-002 Criar matriz de testes de permissao

- Tipo: `qa`
- Camada: `qa`
- Fonte: `DETALHAMENTO_REQUISITOS_V1.md`
- Objetivo: garantir que cada perfil pode ou nao pode executar acoes criticas.
- Escopo:
  - direcao;
  - apoio;
  - usuario comum.
- Fora de escopo:
  - automacao inicial.
- Criterios de aceite:
  - pelo menos um caso positivo/negativo por acao sensivel.
- Testes esperados: checklist.
- Dependencias: DOM-001.
- Labels: `qa`, `tests`.

### QA-003 Criar testes unitarios de dominio critico

- Tipo: `qa`
- Camada: `qa`
- Fonte: DOM-001 a DOM-014
- Objetivo: proteger regras puras.
- Escopo:
  - permissao;
  - primeiro acesso;
  - apoio;
  - status de necessidade;
  - resolucao/cancelamento;
  - pacote de seguranca exportavel/restauravel.
- Fora de escopo:
  - UI.
- Criterios de aceite:
  - testes rodam localmente;
  - cobrem positivos e negativos.
- Testes esperados: unitarios.
- Dependencias: DOM-001 a DOM-014.
- Labels: `tests`, `domain`.

### QA-004 Criar testes de persistencia SQLite

- Tipo: `qa`
- Camada: `qa`
- Fonte: PER-001 a PER-011
- Objetivo: validar schema, repositorios e integridade.
- Escopo:
  - banco temporario;
  - migrations;
  - inserts;
  - queries;
  - constraints.
- Fora de escopo:
  - UI.
- Criterios de aceite:
  - testes nao dependem de dados reais;
  - banco temporario limpo.
- Testes esperados: integracao.
- Dependencias: PER-001 a PER-011, ENG-002.
- Labels: `tests`, `persistence`.

### QA-005 Criar checklist de linguagem e acessibilidade

- Tipo: `qa`
- Camada: `qa`
- Fonte: BT-005, BT-006
- Objetivo: validar PT-BR, termos proibidos e uso basico por teclado.
- Escopo:
  - telas principais;
  - mensagens de erro;
  - foco;
  - labels;
  - status com texto.
- Fora de escopo:
  - auditoria WCAG completa.
- Criterios de aceite:
  - checklist aplicavel por QA junior;
  - termos proibidos rastreados.
- Testes esperados: manual.
- Dependencias: VIEW-001 a VIEW-014.
- Labels: `qa`, `ux`, `accessibility`.

### QA-006 Criar teste de exportacao/restauracao

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-019, UC-020
- Objetivo: validar backup restauravel.
- Escopo:
  - exportar dados ficticios;
  - validar ausencia de senha clara;
  - validar presenca de auditoria historica no pacote;
  - restaurar em banco controlado;
  - confirmar substituicao.
- Fora de escopo:
  - importacao de CSV externo.
- Criterios de aceite:
  - restauracao preserva vinculos;
  - restauracao preserva auditoria historica;
  - arquivo invalido falha sem alterar dados.
- Testes esperados: integracao/manual.
- Dependencias: APP-011, APP-020.
- Labels: `qa`, `tests`, `persistence`.

### QA-007 Criar testes de recuperacao local de acesso

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-004, APP-012, VIEW-008
- Objetivo: validar recuperacao sem internet e sem vazamento de informacao.
- Escopo:
  - recuperacao por token;
  - recuperacao por resposta da frase;
  - usuario inexistente;
  - salvaguarda invalida;
  - nova senha invalida;
  - ausencia de senha clara no banco.
- Fora de escopo:
  - recuperacao por e-mail;
  - procedimento tecnico para direcao que perdeu tudo.
- Criterios de aceite:
  - cenarios positivos redefinem senha;
  - cenarios negativos nao revelam dados sensiveis;
  - testes usam dados ficticios.
- Testes esperados: caso de uso, interface e persistencia focada.
- Dependencias: APP-012, VIEW-008, PER-004.
- Labels: `qa`, `tests`, `security`.

### QA-008 Criar testes de plano de acao simples

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-012, APP-013, VIEW-006
- Objetivo: validar proximos passos dentro do detalhe da necessidade.
- Escopo:
  - criar item;
  - concluir item;
  - listar itens abertos;
  - bloquear alteracao em necessidade final;
  - validar exibicao no detalhe.
- Fora de escopo:
  - prazos;
  - alertas.
- Criterios de aceite:
  - item criado aparece no detalhe;
  - conclusao preserva autor/data;
  - necessidade resolvida/cancelada bloqueia novo item.
- Testes esperados: caso de uso, persistencia e interface focada.
- Dependencias: APP-013, PER-011, VIEW-006.
- Labels: `qa`, `tests`, `good first issue`.

### QA-009 Criar testes de sessao e bloqueio

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-023, UC-024, BT-002
- Objetivo: validar seguranca basica em computador compartilhado.
- Escopo:
  - logout por perfil;
  - bloqueio por inatividade;
  - desbloqueio com senha correta;
  - bloqueio mantido com senha incorreta;
  - sair a partir da tela bloqueada;
  - ausencia de dados sensiveis visiveis.
- Fora de escopo:
  - teste de sessao multi-computador;
  - bloqueio por tentativas.
- Criterios de aceite:
  - timer pode ser testado de forma controlada;
  - dados anteriores nao ficam visiveis sem login;
  - outro usuario precisa fazer logout/login proprio.
- Testes esperados: unitario, interface e QA manual.
- Dependencias: APP-014, VIEW-009, DOM-013.
- Labels: `qa`, `tests`, `security`.

### QA-010 Criar testes de consulta de auditoria

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-021, APP-015, VIEW-010
- Objetivo: validar acesso exclusivo da direcao ao registro de acoes sensiveis.
- Escopo:
  - consulta como direcao;
  - bloqueio como apoio de gestao;
  - bloqueio como usuario comum;
  - ordenacao por data;
  - filtro por tipo;
  - ausencia de segredos na resposta e na tela.
- Fora de escopo:
  - auditoria WCAG completa;
  - relatorio analitico.
- Criterios de aceite:
  - somente direcao consulta auditoria;
  - eventos obrigatorios aparecem;
  - nenhum segredo ou hash sensivel aparece em resumo.
- Testes esperados: caso de uso, interface e checklist de conteudo.
- Dependencias: APP-015, VIEW-010, PER-008.
- Labels: `qa`, `tests`, `security`.

### QA-011 Criar testes de transferencia de direcao

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-022, APP-016, VIEW-011
- Objetivo: validar continuidade administrativa apos troca de direcao.
- Escopo:
  - transferencia valida;
  - bloqueio para apoio;
  - bloqueio para usuario comum;
  - candidato inativo;
  - permissoes da nova direcao;
  - permissoes da antiga direcao;
  - auditoria registrada.
- Fora de escopo:
  - recuperacao tecnica quando direcao perdeu tudo;
  - multiplas direcoes.
- Criterios de aceite:
  - apenas direcao atual transfere;
  - permissoes mudam imediatamente;
  - auditoria mostra antes/depois sem segredo.
- Testes esperados: caso de uso, persistencia e interface.
- Dependencias: APP-016, VIEW-011, PER-002.
- Labels: `qa`, `tests`, `security`.

### QA-012 Criar testes de equipamento e vinculo

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-017, UC-018, APP-018, VIEW-012
- Objetivo: validar equipamento como apoio operacional sem escopo patrimonial.
- Escopo:
  - cadastro simples;
  - campos obrigatorios;
  - vinculo com necessidade ativa;
  - remocao de vinculo marcada por engano;
  - bloqueio de equipamento inativo;
  - bloqueio de edicao/inativacao para usuario comum.
- Fora de escopo:
  - inventario patrimonial;
  - QR Code;
  - nota fiscal.
- Criterios de aceite:
  - equipamento aparece no seletor;
  - historico de vinculo e preservado;
  - usuario comum nao inativa equipamento;
  - necessidade final nao altera vinculo.
- Testes esperados: caso de uso, interface e persistencia focada.
- Dependencias: APP-018, VIEW-012, PER-007.
- Labels: `qa`, `tests`, `good first issue`.

### QA-013 Criar testes de reset administrativo de senha

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-025, APP-019, VIEW-013, BT-003
- Objetivo: validar reset para `123456` sem expor senha clara e com primeiro
  acesso obrigatorio.
- Escopo:
  - reset pela direcao;
  - bloqueio para apoio;
  - bloqueio para usuario comum;
  - hash da senha temporaria;
  - flag de primeiro acesso;
  - salvaguarda anterior invalidada;
  - auditoria `PASSWORD_RESET`.
- Fora de escopo:
  - recuperacao tecnica da direcao perdida;
  - envio por e-mail.
- Criterios de aceite:
  - conta resetada nao entra no Radar antes de trocar senha;
  - senha temporaria nao aparece em texto claro;
  - salvaguarda anterior nao recupera a conta;
  - evento sensivel e registrado.
- Testes esperados: caso de uso, persistencia e interface focada.
- Dependencias: APP-019, VIEW-013, PER-003, PER-008.
- Labels: `qa`, `tests`, `security`.

### QA-014 Criar matriz de regressao do MVP

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-026, BT-010
- Objetivo: consolidar cenarios que devem ser reexecutados quando regras
  criticas mudarem.
- Escopo:
  - acesso e primeiro acesso;
  - permissoes por perfil;
  - necessidades, envolvidos e andamento;
  - resolucao e cancelamento;
  - auditoria;
  - exportacao/restauracao;
  - sessao e bloqueio;
  - equipamento operacional.
- Fora de escopo:
  - porcentagem artificial de cobertura;
  - testes de carga;
  - compatibilidade multi-computador.
- Criterios de aceite:
  - cada area critica tem pelo menos um cenario de regressao;
  - cada cenario aponta para requisito ou issue de origem;
  - matriz indica se a validacao e automatizada, manual ou pendente;
  - regressao prioriza riscos reais do MVP.
- Testes esperados: checklist de regressao.
- Dependencias: QA-001 a QA-013.
- Labels: `qa`, `tests`, `documentation`.

### QA-015 Criar smoke E2E do fluxo minimo

- Tipo: `qa`
- Camada: `qa`
- Fonte: UC-026, `docs/final-testable-delivery.md`
- Objetivo: validar o caminho principal do MVP em ambiente limpo antes de
  considerar release testavel.
- Escopo:
  - configurar escola;
  - cadastrar cargo e pessoa;
  - executar primeiro acesso;
  - registrar necessidade;
  - marcar envolvido;
  - registrar andamento;
  - marcar como resolvida por gestao;
  - consultar historico;
  - exportar e restaurar em ambiente controlado.
- Fora de escopo:
  - automacao visual completa se ainda nao houver ferramenta definida;
  - teste de instalador assinado;
  - dados reais de escola.
- Criterios de aceite:
  - fluxo completo passa com dados ficticios;
  - falha indica etapa e requisito associado;
  - smoke pode rodar manualmente no inicio e migrar para automacao depois;
  - resultado fica documentado para release.
- Testes esperados: smoke manual ou automatizado conforme maturidade.
- Dependencias: VIEW-001 a VIEW-014, QA-014, ENG-002.
- Labels: `qa`, `tests`, `release`.

## Issues de Documentacao de Apoio

### DOC-001 Criar guia de execucao local do MVP

- Tipo: `docs`
- Camada: `docs`
- Fonte: arquitetura e CI
- Objetivo: explicar como rodar localmente.
- Escopo:
  - instalar dependencias;
  - rodar app;
  - rodar testes;
  - validar fluxo minimo.
- Fora de escopo:
  - instalador final.
- Criterios de aceite:
  - dev junior consegue rodar sem inferir comando.
- Testes esperados: seguir guia em ambiente limpo.
- Dependencias: ENG-002, ENG-003, QA-015.
- Labels: `documentation`, `help`, `good first issue`.

### DOC-002 Criar guia de validacao QA do MVP

- Tipo: `docs`
- Camada: `docs`
- Fonte: QA-001
- Objetivo: consolidar roteiro manual do MVP.
- Escopo:
  - dados ficticios;
  - passos;
  - resultado esperado;
  - criterios de aprovado/reprovado.
- Fora de escopo:
  - automacao.
- Criterios de aceite:
  - QA junior executa roteiro.
- Testes esperados: execucao manual.
- Dependencias: QA-001, QA-014, QA-015.
- Labels: `documentation`, `qa`, `help`, `good first issue`.

## Dependencias Macro

```text
REQ -> DOM -> PER -> ENG(base) -> APP -> VIEW -> QA -> ENG(release)
```

Algumas issues podem andar em paralelo:

- validacao documental pode ocorrer antes da implementacao;
- UI pode prototipar estados vazios enquanto application amadurece;
- QA pode criar roteiros antes da tela final;
- dominio pode ser implementado antes de SQLite;
- infraestrutura de hash e bootstrap precisa existir antes dos fluxos de acesso;
- release funcional do MVP so deve avancar depois do smoke do fluxo minimo.

Nota pos-`v0.0.1`: a esteira desktop tecnica ja avancou para validar scaffold,
instalador, checksum, janela sem prompt, abertura maximizada e Playground. Isso
nao substitui a release funcional planejada para o MVP.

## Regra Para Criar Issues Reais

Antes de abrir no GitHub:

- revisar esta matriz;
- remover duplicidades;
- confirmar labels;
- confirmar tamanho de cada issue;
- confirmar dependencias;
- confirmar que criterio de aceite e testavel.

Se uma entrada ainda exigir decisao de produto, ela deve virar issue de
validacao documental, nao de implementacao.

## Linha De Corte: Issues Cadastradas

As issues abaixo foram cadastradas no GitHub a partir desta matriz.

| ID | Issue GitHub |
| --- | --- |
| REQ-001 | https://github.com/OpenEduOps/radar-escola/issues/4 |
| REQ-002 | https://github.com/OpenEduOps/radar-escola/issues/5 |
| REQ-003 | https://github.com/OpenEduOps/radar-escola/issues/6 |
| REQ-004 | https://github.com/OpenEduOps/radar-escola/issues/7 |
| REQ-005 | https://github.com/OpenEduOps/radar-escola/issues/8 |
| DOM-001 | https://github.com/OpenEduOps/radar-escola/issues/9 |
| DOM-002 | https://github.com/OpenEduOps/radar-escola/issues/10 |
| DOM-003 | https://github.com/OpenEduOps/radar-escola/issues/11 |
| DOM-004 | https://github.com/OpenEduOps/radar-escola/issues/12 |
| DOM-005 | https://github.com/OpenEduOps/radar-escola/issues/13 |
| DOM-006 | https://github.com/OpenEduOps/radar-escola/issues/14 |
| DOM-007 | https://github.com/OpenEduOps/radar-escola/issues/15 |
| DOM-008 | https://github.com/OpenEduOps/radar-escola/issues/16 |
| DOM-009 | https://github.com/OpenEduOps/radar-escola/issues/17 |
| DOM-010 | https://github.com/OpenEduOps/radar-escola/issues/18 |
| DOM-011 | https://github.com/OpenEduOps/radar-escola/issues/19 |
| DOM-012 | https://github.com/OpenEduOps/radar-escola/issues/20 |
| DOM-013 | https://github.com/OpenEduOps/radar-escola/issues/21 |
| DOM-014 | https://github.com/OpenEduOps/radar-escola/issues/22 |
| PER-001 | https://github.com/OpenEduOps/radar-escola/issues/23 |
| PER-002 | https://github.com/OpenEduOps/radar-escola/issues/24 |
| PER-003 | https://github.com/OpenEduOps/radar-escola/issues/25 |
| PER-004 | https://github.com/OpenEduOps/radar-escola/issues/26 |
| PER-005 | https://github.com/OpenEduOps/radar-escola/issues/27 |
| PER-006 | https://github.com/OpenEduOps/radar-escola/issues/28 |
| PER-007 | https://github.com/OpenEduOps/radar-escola/issues/29 |
| PER-008 | https://github.com/OpenEduOps/radar-escola/issues/30 |
| PER-009 | https://github.com/OpenEduOps/radar-escola/issues/31 |
| PER-010 | https://github.com/OpenEduOps/radar-escola/issues/32 |
| PER-011 | https://github.com/OpenEduOps/radar-escola/issues/33 |
| ENG-001 | https://github.com/OpenEduOps/radar-escola/issues/34 |
| ENG-002 | https://github.com/OpenEduOps/radar-escola/issues/35 |
| ENG-003 | https://github.com/OpenEduOps/radar-escola/issues/36 |
| ENG-004 | https://github.com/OpenEduOps/radar-escola/issues/37 |
| APP-001 | https://github.com/OpenEduOps/radar-escola/issues/38 |
| APP-002 | https://github.com/OpenEduOps/radar-escola/issues/39 |
| APP-003 | https://github.com/OpenEduOps/radar-escola/issues/40 |
| APP-004 | https://github.com/OpenEduOps/radar-escola/issues/41 |
| APP-005 | https://github.com/OpenEduOps/radar-escola/issues/42 |
| APP-006 | https://github.com/OpenEduOps/radar-escola/issues/43 |
| APP-007 | https://github.com/OpenEduOps/radar-escola/issues/44 |
| APP-008 | https://github.com/OpenEduOps/radar-escola/issues/45 |
| APP-009 | https://github.com/OpenEduOps/radar-escola/issues/46 |
| APP-010 | https://github.com/OpenEduOps/radar-escola/issues/47 |
| APP-011 | https://github.com/OpenEduOps/radar-escola/issues/48 |
| APP-012 | https://github.com/OpenEduOps/radar-escola/issues/49 |
| APP-013 | https://github.com/OpenEduOps/radar-escola/issues/50 |
| APP-014 | https://github.com/OpenEduOps/radar-escola/issues/51 |
| APP-015 | https://github.com/OpenEduOps/radar-escola/issues/52 |
| APP-016 | https://github.com/OpenEduOps/radar-escola/issues/53 |
| APP-017 | https://github.com/OpenEduOps/radar-escola/issues/54 |
| APP-018 | https://github.com/OpenEduOps/radar-escola/issues/55 |
| APP-019 | https://github.com/OpenEduOps/radar-escola/issues/56 |
| APP-020 | https://github.com/OpenEduOps/radar-escola/issues/57 |
| VIEW-001 | https://github.com/OpenEduOps/radar-escola/issues/58 |
| VIEW-002 | https://github.com/OpenEduOps/radar-escola/issues/59 |
| VIEW-003 | https://github.com/OpenEduOps/radar-escola/issues/60 |
| VIEW-004 | https://github.com/OpenEduOps/radar-escola/issues/61 |
| VIEW-005 | https://github.com/OpenEduOps/radar-escola/issues/62 |
| VIEW-006 | https://github.com/OpenEduOps/radar-escola/issues/63 |
| VIEW-007 | https://github.com/OpenEduOps/radar-escola/issues/64 |
| VIEW-008 | https://github.com/OpenEduOps/radar-escola/issues/65 |
| VIEW-009 | https://github.com/OpenEduOps/radar-escola/issues/66 |
| VIEW-010 | https://github.com/OpenEduOps/radar-escola/issues/67 |
| VIEW-011 | https://github.com/OpenEduOps/radar-escola/issues/68 |
| VIEW-012 | https://github.com/OpenEduOps/radar-escola/issues/69 |
| VIEW-013 | https://github.com/OpenEduOps/radar-escola/issues/70 |
| VIEW-014 | https://github.com/OpenEduOps/radar-escola/issues/71 |
| QA-001 | https://github.com/OpenEduOps/radar-escola/issues/72 |
| QA-002 | https://github.com/OpenEduOps/radar-escola/issues/73 |
| QA-003 | https://github.com/OpenEduOps/radar-escola/issues/74 |
| QA-004 | https://github.com/OpenEduOps/radar-escola/issues/75 |
| QA-005 | https://github.com/OpenEduOps/radar-escola/issues/76 |
| QA-006 | https://github.com/OpenEduOps/radar-escola/issues/77 |
| QA-007 | https://github.com/OpenEduOps/radar-escola/issues/78 |
| QA-008 | https://github.com/OpenEduOps/radar-escola/issues/79 |
| QA-009 | https://github.com/OpenEduOps/radar-escola/issues/80 |
| QA-010 | https://github.com/OpenEduOps/radar-escola/issues/81 |
| QA-011 | https://github.com/OpenEduOps/radar-escola/issues/82 |
| QA-012 | https://github.com/OpenEduOps/radar-escola/issues/83 |
| QA-013 | https://github.com/OpenEduOps/radar-escola/issues/84 |
| QA-014 | https://github.com/OpenEduOps/radar-escola/issues/85 |
| QA-015 | https://github.com/OpenEduOps/radar-escola/issues/86 |
| DOC-001 | https://github.com/OpenEduOps/radar-escola/issues/87 |
| DOC-002 | https://github.com/OpenEduOps/radar-escola/issues/88 |

## Linha De Corte: Issues Docker Concluidas

As issues abaixo foram cadastradas e concluidas como trilha transversal de
dockerizacao do ambiente tecnico. Elas nao alteram o total original de 85 issues
do MVP.
`DOCKER-009` foi tratada como gate final: ela avancou depois que `DOCKER-001` a
`DOCKER-008` foram resolvidas.

| ID | Issue GitHub | Status |
| --- | --- | --- |
| DOCKER-001 | https://github.com/OpenEduOps/radar-escola/issues/89 | Concluida |
| DOCKER-002 | https://github.com/OpenEduOps/radar-escola/issues/90 | Concluida |
| DOCKER-003 | https://github.com/OpenEduOps/radar-escola/issues/91 | Concluida |
| DOCKER-004 | https://github.com/OpenEduOps/radar-escola/issues/92 | Concluida |
| DOCKER-005 | https://github.com/OpenEduOps/radar-escola/issues/93 | Concluida |
| DOCKER-006 | https://github.com/OpenEduOps/radar-escola/issues/94 | Concluida |
| DOCKER-007 | https://github.com/OpenEduOps/radar-escola/issues/95 | Concluida |
| DOCKER-008 | https://github.com/OpenEduOps/radar-escola/issues/96 | Concluida |
| DOCKER-009 | https://github.com/OpenEduOps/radar-escola/issues/97 | Concluida |

Validacao de fechamento:

- commit final da trilha: `64f631b6efae7cbaed429f75f808e951b60409b6`;
- CI: https://github.com/OpenEduOps/radar-escola/actions/runs/26777533097;
- `Docker dev validation` confere `.dockerignore`, constroi a imagem dev e roda
  typecheck, testes unitarios e build frontend no container;
- `Docker dev validation`, `All CI checks` e `Security` concluiram com sucesso.
