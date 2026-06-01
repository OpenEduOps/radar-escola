# Regras de Dominio V1

Este documento normaliza os dominios, tabelas relacionais, operacoes de dados e
regras de integridade do MVP do Radar Escola.

Ele e referencia para:

- requisitos;
- modelo relacional SQLite;
- entidades de dominio;
- repositorios;
- casos de uso;
- testes de persistencia;
- matriz de issues.

Este documento nao e migration SQL final. Ele e o contrato de dominio para guiar
a implementacao.

## Principios

- SQLite e a persistencia local principal.
- Modelo relacional e adequado para a arquitetura atual.
- Regras de negocio nao devem ficar espalhadas na UI.
- UI chama casos de uso.
- Casos de uso aplicam permissoes e orquestram repositorios.
- Repositorios persistem e consultam dados.
- Deletes fisicos devem ser excecao.
- Historico e auditoria devem preservar memoria operacional.

## Perfis de permissao

| Perfil | Identificador sugerido | Descricao |
| --- | --- | --- |
| Direcao | `director` | Responsavel principal da escola |
| Apoio de gestao | `management_support` | Delegacao operacional limitada |
| Usuario comum | `user` | Pessoa cadastrada para acompanhar necessidades |

O perfil `director` nao deve ser apenas texto em cargo/funcao. Deve ser derivado
da escola ou de uma relacao explicita de responsabilidade principal.

O perfil `management_support` deve ser derivado da tabela de delegacao, nao do
nome do cargo.

## Convencoes de tabela

- `id`: identificador textual ou inteiro, decisao tecnica futura.
- `created_at`: data/hora de criacao.
- `updated_at`: data/hora da ultima atualizacao.
- `inactive_at`: quando aplicavel, marca inativacao.
- `cancelled_at`: quando aplicavel, marca cancelamento.
- `metadata_json`: usado apenas quando necessario, sem segredos.

## Dominios e tabelas

### D-001 Escola

Tabela: `schools`

Responsabilidade:

- representar a escola local configurada no app;
- apontar a direcao atual;
- manter metadados de configuracao.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `name` | TEXT | Sim | Nome visivel da escola |
| `current_director_person_id` | TEXT | Sim | Pessoa que e direcao atual |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |

Constraints:

- deve existir apenas uma escola ativa na V1;
- `name` nao pode ser vazio;
- `current_director_person_id` deve apontar para pessoa ativa.

Operacoes:

- Insert: criar escola no primeiro uso.
- Update: alterar nome da escola; transferir direcao.
- Delete: proibido na V1.

Queries:

- `getConfiguredSchool()`;
- `getCurrentDirector()`;
- `isSchoolConfigured()`.

Eventos de auditoria:

- `SCHOOL_CONFIGURED`;
- `DIRECTORSHIP_TRANSFERRED`.

### D-002 Pessoa

Tabela: `people`

Responsabilidade:

- representar pessoa da equipe escolar que usa ou acompanha o sistema.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `name` | TEXT | Sim | Nome da pessoa |
| `role_id` | TEXT | Sim | Cargo/funcao |
| `active` | INTEGER | Sim | 1 ativo, 0 inativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |
| `inactive_at` | TEXT | Nao | Quando inativada |

Constraints:

- `name` nao pode ser vazio;
- `role_id` deve existir;
- pessoa com necessidade/historico nao deve ser apagada fisicamente.

Operacoes:

- Insert: cadastrar pessoa.
- Update: corrigir nome, cargo/funcao, ativo/inativo.
- Delete: proibido; usar inativacao.

Queries:

- `listActivePeople()`;
- `getPersonById(id)`;
- `listPeopleForInvolvement()`;
- `listPeopleForDirectorshipTransfer()`.

Eventos de auditoria:

- `USER_CREATED`, quando pessoa recebe conta;
- futuro `PERSON_INACTIVATED`, se inativacao entrar.

### D-003 Cargo ou funcao

Tabela: `roles`

Responsabilidade:

- organizar pessoas por funcao declarativa;
- nao controlar permissao complexa.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `name` | TEXT | Sim | Nome unico normalizado |
| `active` | INTEGER | Sim | 1 ativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |

Constraints:

- `name` nao pode ser vazio;
- `name` deve ser unico por normalizacao simples;
- cargo nao concede permissao automaticamente.

Operacoes:

- Insert: cadastrar cargo/funcao.
- Update: renomear ou inativar.
- Delete: proibido se usado por pessoa; preferir inativar.

Queries:

- `listActiveRoles()`;
- `findRoleByName(name)`.

Eventos de auditoria:

- nao obrigatorio na V1, salvo se criado junto a usuario como parte de
  auditoria de cadastro.

### D-004 Conta de usuario

Tabela: `user_accounts`

Responsabilidade:

- controlar login, senha, estado de primeiro acesso e vinculo com pessoa.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `person_id` | TEXT | Sim | Pessoa vinculada |
| `username` | TEXT | Sim | Unico |
| `password_hash` | TEXT | Sim | Nunca senha clara |
| `must_change_password` | INTEGER | Sim | 1 quando senha temporaria |
| `active` | INTEGER | Sim | 1 ativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |
| `last_login_at` | TEXT | Nao | Ultimo login |

Constraints:

- `username` unico;
- `password_hash` obrigatorio;
- senha clara nunca deve ser persistida;
- `must_change_password = 1` impede uso normal.

Operacoes:

- Insert: criar conta com senha temporaria ou direcao inicial.
- Update: trocar senha; resetar senha para temporaria; ativar/inativar.
- Delete: proibido; inativar.

Queries:

- `findAccountByUsername(username)`;
- `getAccountWithPerson(accountId)`;
- `listActiveAccounts()`;
- `accountRequiresPasswordChange(accountId)`.

Eventos de auditoria:

- `USER_CREATED`;
- `PASSWORD_RESET`.

### D-005 Salvaguarda de acesso

Tabela: `access_recovery`

Responsabilidade:

- guardar dados protegidos de recuperacao local.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `account_id` | TEXT | Sim | Conta vinculada |
| `token_hash` | TEXT | Nao | Token protegido |
| `recovery_question` | TEXT | Nao | Frase/pergunta visivel ao dono |
| `recovery_answer_hash` | TEXT | Nao | Resposta protegida |
| `token_was_shown` | INTEGER | Sim | Deve ficar 1 apos exibicao |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |

Constraints:

- deve haver token ou frase/resposta valida;
- token nao deve ser armazenado em claro;
- resposta nao deve ser armazenada em claro;
- token nao deve ser regenerado.

Operacoes:

- Insert: criar salvaguarda no primeiro uso/primeiro acesso.
- Update: atualizar frase/resposta apos fluxo autenticado, se permitido.
- Delete: proibido na V1.

Queries:

- `getRecoveryByAccount(accountId)`;
- `validateRecoveryToken(accountId, token)`;
- `validateRecoveryAnswer(accountId, answer)`.

Eventos de auditoria:

- nao registrar segredo;
- `PASSWORD_RESET` quando recuperacao resultar em troca administrativa ou
  redefinicao.

### D-006 Apoio de gestao

Tabela: `management_support`

Responsabilidade:

- registrar delegacao operacional limitada feita pela direcao.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `person_id` | TEXT | Sim | Pessoa delegada |
| `granted_by_person_id` | TEXT | Sim | Direcao que concedeu |
| `active` | INTEGER | Sim | 1 ativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `revoked_at` | TEXT | Nao | Data de remocao |

Constraints:

- maximo duas delegacoes ativas;
- pessoa precisa estar ativa;
- direcao atual nao precisa ser cadastrada aqui para ter poder de direcao.

Operacoes:

- Insert: conceder apoio.
- Update: revogar apoio.
- Delete: proibido; revogar.

Queries:

- `listActiveManagementSupport()`;
- `isManagementSupport(personId)`;
- `countActiveManagementSupport()`.

Eventos de auditoria:

- `MANAGEMENT_SUPPORT_GRANTED`;
- `MANAGEMENT_SUPPORT_REVOKED`.

### D-007 Necessidade

Tabela: `needs`

Responsabilidade:

- representar o item central do produto.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `title` | TEXT | Sim | Curto e claro |
| `description` | TEXT | Sim | Problema operacional |
| `location` | TEXT | Sim | Onde acontece |
| `priority` | TEXT | Sim | `baixa`, `normal`, `alta`, `urgente` |
| `status` | TEXT | Sim | Ver lista de status |
| `created_by_person_id` | TEXT | Sim | Autor |
| `equipment_id` | TEXT | Nao | Opcional |
| `technical_closure_requested` | INTEGER | Sim | 0/1 |
| `resolved_by_person_id` | TEXT | Nao | Direcao/apoio |
| `resolved_at` | TEXT | Nao | Data resolucao |
| `resolution_summary` | TEXT | Nao | Solucao |
| `cancelled_by_person_id` | TEXT | Nao | Direcao/apoio |
| `cancelled_at` | TEXT | Nao | Data cancelamento |
| `cancellation_reason` | TEXT | Nao | Motivo |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |

Status permitidos:

- `nova`;
- `em_analise`;
- `em_execucao`;
- `aguardando_material`;
- `aguardando_autorizacao`;
- `pausada`;
- `resolvida`;
- `cancelada`.

Constraints:

- titulo, descricao e local obrigatorios;
- status deve ser permitido;
- resolvida exige `resolved_by_person_id`, `resolved_at` e resumo;
- cancelada exige `cancelled_by_person_id`, `cancelled_at` e motivo;
- usuario comum nao pode mudar status para `resolvida` ou `cancelada`.

Operacoes:

- Insert: registrar necessidade.
- Update: corrigir campos permitidos; alterar status operacional; solicitar
  fechamento tecnico; resolver; cancelar.
- Delete: proibido na V1.

Queries:

- `getNeedById(id)`;
- `listActiveNeeds()`;
- `listStoppedNeeds(referenceDate)`;
- `listRecentlyResolvedNeeds(limitOrDateRange)`;
- `getNeedDetail(id)`;
- `listNeedsByEquipment(equipmentId)`.

Eventos de auditoria:

- `NEED_RESOLVED`;
- `NEED_CANCELLED`.

### D-008 Envolvidos

Tabela: `need_involved_people`

Responsabilidade:

- vincular pessoas cadastradas a necessidades.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `need_id` | TEXT | Sim | Necessidade |
| `person_id` | TEXT | Sim | Pessoa envolvida |
| `added_by_person_id` | TEXT | Sim | Quem adicionou |
| `active` | INTEGER | Sim | 1 ativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `removed_at` | TEXT | Nao | Quando removido |

Constraints:

- pessoa envolvida deve estar ativa no momento de inclusao;
- evitar duplicidade ativa para mesmo `need_id` + `person_id`;
- necessidade resolvida/cancelada nao recebe novo envolvido.

Operacoes:

- Insert: adicionar envolvido.
- Update: remover logicamente.
- Delete: proibido; usar `active = 0`.

Queries:

- `listInvolvedPeople(needId)`;
- `isPersonInvolved(needId, personId)`.

Eventos:

- historico da necessidade deve registrar alteracao relevante;
- auditoria administrativa nao obrigatoria.

### D-009 Andamentos

Tabela: `need_updates`

Responsabilidade:

- registrar evolucao textual da necessidade.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `need_id` | TEXT | Sim | Necessidade |
| `author_person_id` | TEXT | Sim | Autor |
| `update_type` | TEXT | Sim | `andamento`, `fechamento_tecnico`, `sistema` |
| `description` | TEXT | Sim | Texto do andamento |
| `status_after` | TEXT | Nao | Status apos atualizacao |
| `created_at` | TEXT | Sim | ISO datetime |

Constraints:

- descricao obrigatoria;
- necessidade resolvida/cancelada nao recebe novo andamento na V1;
- `fechamento_tecnico` nao muda status para `resolvida`.

Operacoes:

- Insert: registrar andamento.
- Update: proibido na V1, salvo correcao futura explicita.
- Delete: proibido.

Queries:

- `listNeedUpdates(needId)`;
- `getLatestNeedUpdate(needId)`.

Eventos:

- historico da necessidade usa esta tabela;
- auditoria nao obrigatoria para andamento comum.

### D-010 Plano de acao simples

Tabela: `need_action_plan_items`

Responsabilidade:

- registrar proximos passos simples dentro de uma necessidade.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `need_id` | TEXT | Sim | Necessidade |
| `description` | TEXT | Sim | Proximo passo |
| `responsible_person_id` | TEXT | Nao | Pessoa responsavel |
| `completed` | INTEGER | Sim | 0/1 |
| `completed_by_person_id` | TEXT | Nao | Quem concluiu |
| `completed_at` | TEXT | Nao | Data conclusao |
| `created_by_person_id` | TEXT | Sim | Autor |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |

Constraints:

- descricao obrigatoria;
- item concluido exige `completed_by_person_id` e `completed_at`;
- necessidade resolvida/cancelada nao recebe novo item.

Operacoes:

- Insert: criar item.
- Update: concluir item; editar descricao se ainda ativo.
- Delete: evitar; preferir marcar como cancelado em evolucao futura.

Queries:

- `listActionPlanItems(needId)`;
- `listOpenActionPlanItems(needId)`.

### D-011 Equipamento

Tabela: `equipment`

Responsabilidade:

- permitir vinculo operacional basico com necessidades.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `name` | TEXT | Sim | Nome visivel |
| `location` | TEXT | Sim | Local |
| `asset_identifier` | TEXT | Nao | Patrimonio/identificacao |
| `current_state` | TEXT | Sim | Estado atual simples |
| `notes` | TEXT | Nao | Observacoes |
| `active` | INTEGER | Sim | 1 ativo |
| `created_at` | TEXT | Sim | ISO datetime |
| `updated_at` | TEXT | Sim | ISO datetime |
| `inactive_at` | TEXT | Nao | Quando inativado |

Constraints:

- nome obrigatorio;
- local obrigatorio;
- identificador pode ser unico quando informado, decisao a validar;
- equipamento vinculado a necessidade nao deve ser apagado fisicamente.

Operacoes:

- Insert: cadastrar equipamento.
- Update: editar dados simples; inativar.
- Delete: proibido quando houver historico; evitar na V1.

Queries:

- `listActiveEquipment()`;
- `getEquipmentById(id)`;
- `findEquipmentByIdentifier(identifier)`;
- `listNeedsByEquipment(equipmentId)`.

### D-012 Exportacao de seguranca

Tabela: `security_exports`

Responsabilidade:

- registrar metadados de exportacao feita pela direcao.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `created_by_person_id` | TEXT | Sim | Direcao |
| `export_version` | TEXT | Sim | Versao do formato |
| `destination_hint` | TEXT | Nao | Caminho/resumo sem segredo |
| `created_at` | TEXT | Sim | ISO datetime |

Operacoes:

- Insert: registrar exportacao concluida.
- Update: proibido.
- Delete: proibido.

Eventos de auditoria:

- `SECURITY_EXPORT_CREATED`.

### D-013 Restauracao de seguranca

Tabela: `security_imports`

Responsabilidade:

- registrar metadados de restauracao realizada.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | Chave primaria |
| `created_by_person_id` | TEXT | Sim | Direcao |
| `import_version` | TEXT | Sim | Versao importada |
| `source_hint` | TEXT | Nao | Origem sem segredo |
| `created_at` | TEXT | Sim | ISO datetime |

Operacoes:

- Insert: registrar restauracao concluida.
- Update: proibido.
- Delete: proibido.

Eventos de auditoria:

- `SECURITY_IMPORT_RESTORED`.

Observacao:

- Como restauracao substitui dados, a estrategia final deve decidir se o evento
  de restauracao fica dentro do banco restaurado, em log local separado ou em
  ambos. Para V1, a regra de produto e registrar quando tecnicamente possivel.

### D-014 Auditoria

Tabela: `audit_events`

Responsabilidade:

- registrar eventos sensiveis para consulta exclusiva da direcao;
- preservar rastreabilidade operacional sem expor senhas, tokens, respostas de
  recuperacao ou dados pessoais desnecessarios.

Campos propostos:

| Campo | Tipo SQLite | Obrigatorio | Regra |
| --- | --- | --- | --- |
| `id` | TEXT | Sim | UUID |
| `event_type` | TEXT | Sim | Tipo controlado |
| `actor_user_id` | TEXT | Sim | Usuario logado |
| `actor_person_id` | TEXT | Sim | Pessoa vinculada ao usuario |
| `entity_type` | TEXT | Sim | Dominio afetado |
| `entity_id` | TEXT | Nao | ID afetado quando existir |
| `summary` | TEXT | Sim | Texto curto sem segredo |
| `metadata_json` | TEXT | Nao | Dados tecnicos sem segredo |
| `created_at` | TEXT | Sim | ISO datetime |

Constraints:

- evento deve ter ator identificado;
- `summary` e `metadata_json` nunca devem conter senha, token claro ou resposta
  clara de recuperacao;
- evento de auditoria nao deve ser alterado pela interface;
- exclusao fisica de evento de auditoria fica proibida na V1.

Operacoes:

- Insert: registrar evento sensivel.
- Update: proibido para fluxo de produto.
- Delete: proibido para fluxo de produto.

Queries:

- `listAuditEvents(filters)`;
- `listAuditEventsByType(eventType)`;
- `listAuditEventsByEntity(entityType, entityId)`.

Eventos de auditoria:

- Esta tabela registra eventos; ela nao depende de registrar eventos sobre si
  mesma na V1.

## Matriz CRUD por perfil

| Dominio | Direcao | Apoio de gestao | Usuario comum |
| --- | --- | --- | --- |
| Escola | R/U direcao | R | R |
| Pessoa | C/R/U | C/R/U limitado | R |
| Cargo/funcao | C/R/U | C/R/U | R |
| Conta | C/R/U/reset | C/R limitado | R propria |
| Salvaguarda | C/R propria | C/R propria | C/R propria |
| Apoio de gestao | C/R/U | R | R limitado |
| Necessidade | C/R/U cancelar/resolver | C/R/U cancelar/resolver | C/R/U andamento |
| Envolvidos | C/R/U | C/R/U | C/R/U |
| Andamentos | C/R | C/R | C/R |
| Plano de acao | C/R/U | C/R/U | C/R/U |
| Equipamento | C/R/U | C/R/U | C/R/U |
| Auditoria | R | Nao | Nao |
| Exportacao | C/R | Nao | Nao |
| Restauracao | C | Nao | Nao |

Legenda:

- C: criar;
- R: consultar;
- U: atualizar;
- reset: redefinir senha de usuario comum para `123456`.

## Regras de status de necessidade

Transicoes permitidas:

| De | Para | Quem pode |
| --- | --- | --- |
| `nova` | `em_analise` | Todos autenticados |
| `nova` | `em_execucao` | Todos autenticados |
| `em_analise` | `em_execucao` | Todos autenticados |
| `em_execucao` | `aguardando_material` | Todos autenticados |
| `em_execucao` | `aguardando_autorizacao` | Todos autenticados |
| Qualquer ativa | `pausada` | Todos autenticados |
| Qualquer ativa | `resolvida` | Direcao, apoio |
| Qualquer ativa | `cancelada` | Direcao, apoio |

Status ativos:

- `nova`;
- `em_analise`;
- `em_execucao`;
- `aguardando_material`;
- `aguardando_autorizacao`;
- `pausada`.

Status finais:

- `resolvida`;
- `cancelada`.

Regras:

- status final nao deve voltar para ativo na V1;
- reabertura fica fora da V1;
- solicitacao de fechamento tecnico nao e status final.

## Regras de necessidades paradas

Definicao inicial:

- necessidade ativa sem andamento recente por periodo configuravel no codigo;
- sugestao inicial: 7 dias sem atualizacao.

Query candidata:

- `listStoppedNeeds(referenceDate)`:
  - status em ativos;
  - `updated_at` menor que limite;
  - ordenar por mais antiga primeiro.

Guardrail:

- "Parada" e classificacao de visualizacao, nao status persistido obrigatorio.

## Consultas nomeadas essenciais

### Radar

- `getNeedsRadar()`:
  - entradas:
    - data de referencia;
    - limite de resolvidas recentes;
  - saidas:
    - `activeNeeds`;
    - `stoppedNeeds`;
    - `recentlyResolvedNeeds`.

### Detalhe da necessidade

- `getNeedDetail(needId)`:
  - necessidade;
  - envolvidos;
  - equipamento;
  - andamentos;
  - plano de acao.

### Pessoas para selecao

- `listActivePeopleForSelection()`:
  - pessoas ativas;
  - cargo/funcao;
  - indicador de apoio de gestao.

### Auditoria

- `listAuditEvents(filters)`:
  - apenas direcao;
  - filtros futuros simples: tipo e periodo.

### Exportacao

- `getSecurityExportSnapshot()`:
  - retorna dados consistentes para CSV;
  - deve rodar em leitura consistente ou transacao quando possivel.

## Regras de insert

Todo insert deve:

- validar obrigatorios;
- definir `created_at`;
- definir `updated_at` quando houver;
- usar ids novos;
- respeitar permissao antes de persistir;
- registrar historico/auditoria quando aplicavel.

Inserts proibidos:

- criar segunda escola ativa;
- criar terceiro apoio ativo;
- criar envolvido duplicado ativo;
- criar necessidade sem titulo/descricao/local;
- criar andamento vazio;
- criar senha clara.

## Regras de update

Todo update deve:

- validar permissao;
- preservar historico quando relevante;
- atualizar `updated_at`;
- nao apagar vinculos sem motivo;
- registrar auditoria para acao sensivel.

Updates proibidos:

- usuario comum marcar necessidade como resolvida;
- apoio consultar/exportar/restaurar seguranca;
- regenerar token;
- alterar evento de auditoria pela UI;
- transformar cargo/funcao em permissao automatica.

## Regras de delete

Delete fisico proibido na V1 para:

- escola;
- pessoa;
- conta;
- necessidade;
- andamento;
- auditoria;
- apoio de gestao;
- equipamento com historico.

Alternativas:

- inativar;
- revogar;
- cancelar;
- preservar historico.

Delete fisico pode existir apenas para:

- dados temporarios tecnicos de exportacao/importacao, se houver;
- registros ainda nao confirmados em memoria antes de persistir.

## Integridade e transacoes

Operacoes que devem ser transacionais:

- primeiro uso completo;
- cadastro de pessoa + conta;
- troca de senha + salvaguarda no primeiro acesso;
- marcar como resolvida + andamento/historico + auditoria;
- cancelar necessidade + historico + auditoria;
- exportacao de snapshot;
- restauracao de seguranca;
- transferencia de direcao + auditoria;
- definir apoio + auditoria.

Se uma parte critica falhar, a operacao deve falhar inteira quando possivel.

## Exportacao restauravel

Formato final sera detalhado em implementacao, mas o pacote deve conter:

- versao do formato;
- dados da escola;
- pessoas;
- cargos/funcoes;
- contas com hash;
- salvaguardas protegidas;
- apoios de gestao;
- necessidades;
- envolvidos;
- andamentos;
- plano de acao;
- equipamentos;
- auditoria, se a estrategia final incluir;
- metadados de exportacao.

Regras:

- nunca exportar senha clara;
- nunca exportar token claro;
- nunca exportar resposta clara;
- restauracao substitui tudo;
- nao mesclar.

## Mapeamento para arquitetura

### `src/domain`

Deve conter:

- tipos e entidades;
- regras puras;
- validacoes;
- permissoes;
- transicoes de status.

### `src/application`

Deve conter:

- casos de uso;
- orquestracao;
- chamadas a repositorios;
- registro de auditoria;
- erros de negocio.

### `src/infrastructure`

Deve conter:

- SQLite;
- migrations;
- repositorios;
- hashing;
- CSV;
- filesystem via Tauri.

### `src/features`

Deve conter:

- telas;
- formularios;
- listas;
- estados vazios;
- confirmacoes.

## Testes esperados por dominio

| Dominio | Unitario | Persistencia | Interface/QA |
| --- | --- | --- | --- |
| Escola | Sim | Sim | Primeiro uso |
| Pessoa/conta | Sim | Sim | Cadastro e login |
| Salvaguarda | Sim | Sim | Primeiro acesso/recuperacao |
| Apoio | Sim | Sim | Limite de dois |
| Necessidade | Sim | Sim | Registro e radar |
| Envolvidos | Sim | Sim | Selecao/remocao |
| Andamento | Sim | Sim | Timeline |
| Resolucao | Sim | Sim | Confirmacao |
| Cancelamento | Sim | Sim | Confirmacao |
| Equipamento | Sim | Sim | Vinculo |
| Auditoria | Sim | Sim | Consulta direcao |
| Exportacao | Sim | Sim | Arquivo gerado |
| Restauracao | Sim | Sim | Substituicao |

## Lacunas para revisao

Antes de implementar, revisar:

- periodo exato de "necessidade parada";
- se equipamento pode ser cadastrado por usuario comum ou apenas gestao;
- formato exato do pacote CSV;
- estrategia de auditoria durante restauracao;
- estrategia concreta de hash no ambiente Tauri;
- se reabertura de necessidade resolvida fica totalmente fora da V1;
- se edicao de andamento existente deve ser proibida ou permitida com historico.

## Criterio de pronto do dominio

O dominio esta pronto para virar issue de implementacao quando:

- tabela esta nomeada;
- campos estao definidos;
- constraints estao claras;
- inserts permitidos estao claros;
- updates permitidos estao claros;
- delete fisico ou logico esta decidido;
- queries principais estao nomeadas;
- permissoes estao mapeadas;
- testes esperados estao descritos.
