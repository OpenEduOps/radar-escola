# Detalhamento dos Blocos Transversais V1

Este documento detalha regras que atravessam varios casos de uso do Radar
Escola. Ele complementa `DETALHAMENTO_REQUISITOS_V1.md` e deve ser usado por
devs, QA e revisores antes de abrir issues reais.

Blocos transversais nao devem virar funcionalidades grandes por si mesmos. Eles
existem para proteger o fluxo minimo de valor:

```text
cadastrar pessoa
-> registrar necessidade
-> ver no radar
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido
-> consultar historico
```

## Como Ler

Cada bloco tem:

- objetivo;
- riscos que evita;
- regras obrigatorias;
- fluxos de excecao;
- guardrails;
- criterios de aceite;
- testes minimos;
- tarefas minimas e modulares candidatas.

## BT-001 Auditoria minima

### Objetivo

Registrar acoes sensiveis para que a direcao consiga reconstruir eventos
importantes sem depender de memoria, conversa informal ou suporte tecnico.

### Riscos que evita

- Ninguem saber quem marcou uma necessidade como resolvida.
- Redefinicao de senha sem rastreio.
- Exportacao/restauracao sem registro.
- Transferencia de direcao sem memoria operacional.
- Apoio de gestao recebendo permissao sem registro.

### Regras obrigatorias

- Auditoria e local.
- Auditoria e automatica.
- Auditoria nao depende de internet.
- Auditoria e consultavel somente pela direcao.
- Apoio de gestao nao consulta auditoria.
- Usuario comum nao consulta auditoria.
- Evento de auditoria nao deve ser editado pela interface.
- Evento de auditoria nao deve expor segredo.

### Eventos obrigatorios

| Evento | Quando registrar | Quem pode gerar |
| --- | --- | --- |
| `SCHOOL_CONFIGURED` | Primeiro uso concluido | Direcao |
| `USER_CREATED` | Pessoa/usuario criado | Direcao, apoio |
| `PASSWORD_RESET` | Senha redefinida para `123456` | Direcao |
| `MANAGEMENT_SUPPORT_GRANTED` | Apoio definido | Direcao |
| `MANAGEMENT_SUPPORT_REVOKED` | Apoio removido | Direcao |
| `NEED_RESOLVED` | Necessidade marcada como resolvida | Direcao, apoio |
| `NEED_CANCELLED` | Necessidade cancelada | Direcao, apoio |
| `SECURITY_EXPORT_CREATED` | Exportacao feita | Direcao |
| `SECURITY_IMPORT_RESTORED` | Restauracao concluida | Direcao |
| `DIRECTORSHIP_TRANSFERRED` | Direcao transferida | Direcao |

### Campos minimos do evento

- `id`;
- `event_type`;
- `actor_user_id`;
- `actor_person_id`;
- `entity_type`;
- `entity_id`;
- `summary`;
- `created_at`;
- `metadata_json`, opcional e sem segredo.

### Fluxos de excecao

- Falha ao gravar auditoria em acao sensivel:
  - se a acao ainda nao foi concluida, abortar acao;
  - se a acao ja foi concluida, mostrar erro operacional e registrar pendencia
    tecnica futura quando houver mecanismo.
- Usuario sem permissao tenta consultar auditoria:
  - bloquear;
  - mostrar mensagem clara;
  - nao revelar existencia de eventos.

### Guardrails

- Auditoria nao e historico da necessidade.
- Historico da necessidade e visivel a usuarios autenticados.
- Auditoria administrativa e exclusiva da direcao.
- Nao incluir senha, token, resposta de recuperacao nem hash sensivel em resumo.

### Criterios de aceite

- Cada evento obrigatorio e persistido.
- Direcao consulta eventos.
- Apoio e usuario comum sao bloqueados.
- Eventos aparecem em ordem decrescente de data.
- Segredos nao aparecem na auditoria.

### Testes minimos

- Unitario: cada acao sensivel chama criacao de evento.
- Persistencia: inserir e listar eventos.
- Permissao: direcao acessa; apoio/usuario comum nao acessam.
- Conteudo: evento nao contem senha, token ou resposta.

### Tarefas modulares candidatas

- Especificar eventos de auditoria.
- Criar tabela `audit_events`.
- Implementar repositorio de auditoria.
- Implementar caso de uso de registrar auditoria.
- Criar tela simples de auditoria.
- Criar testes de permissao da auditoria.

## BT-002 Sessao, logout e bloqueio por inatividade

### Objetivo

Reduzir risco de uso indevido em computador compartilhado mantendo a experiencia
simples.

### Riscos que evita

- Pessoa sair da frente do computador com sessao aberta.
- Outro usuario agir com conta errada.
- Dados ficarem visiveis apos logout.
- Troca informal de usuario sem login.

### Regras obrigatorias

- Deve existir botao visivel de sair.
- Sessao bloqueia apos 30 minutos sem atividade.
- Desbloqueio exige senha do usuario atual.
- Trocar de usuario exige logout.
- Tela bloqueada nao deve expor detalhes sensiveis da tela anterior.
- Ao desbloquear, preservar contexto quando possivel.
- Se contexto nao puder ser preservado, voltar ao Radar.

### Atividades que reiniciam timer

- Clique;
- digitacao;
- navegacao;
- envio de formulario;
- foco em campo;
- acao de menu.

### Fluxos de excecao

- Senha incorreta no desbloqueio:
  - manter bloqueado;
  - mostrar erro generico.
- Conta inativada durante sessao:
  - encerrar sessao;
  - voltar ao login.
- Banco indisponivel no desbloqueio:
  - manter bloqueado;
  - mostrar erro operacional.

### Guardrails

- V1 nao tera bloqueio por tentativas erradas.
- V1 nao tera sessao multi-computador.
- V1 nao tera biometria, PIN do Windows ou login externo.

### Criterios de aceite

- Logout funciona para todos os perfis.
- Sessao bloqueia apos 30 minutos.
- Senha correta desbloqueia.
- Senha incorreta nao desbloqueia.
- Outro usuario nao assume sessao bloqueada.

### Testes minimos

- Unitario: calculo de inatividade.
- Interface: logout.
- Interface: bloqueio por timer controlado.
- Interface: senha incorreta.
- Interface: sair a partir da tela bloqueada.

### Tarefas modulares candidatas

- Definir modelo de sessao local.
- Implementar timer de inatividade.
- Criar tela de bloqueio.
- Criar acao de logout.
- Criar testes de sessao.

## BT-003 Seguranca local de acesso

### Objetivo

Proteger acesso com usuario, senha e salvaguarda local, sem internet e sem
provedor externo.

### Riscos que evita

- Senha salva em texto claro.
- Token exposto depois do primeiro acesso.
- Direcao vendo segredo de usuario comum.
- Perda total de acesso sem aviso.

### Regras obrigatorias

- Senha sempre como hash adequado para senha.
- Resposta de frase de recuperacao tambem protegida.
- Token exibido apenas no momento da configuracao.
- Token nao deve ser regenerado.
- Senha temporaria `123456` so pode existir para primeiro acesso ou reset
  administrativo.
- Primeiro acesso deve ser privado.
- Reset administrativo recoloca conta em primeiro acesso.

### Fluxos de excecao

- Usuario tenta manter `123456` como senha final:
  - bloquear;
  - explicar que e senha temporaria.
- Usuario perde senha e salvaguarda:
  - usuario comum deve procurar direcao;
  - direcao pode perder acesso se tambem perder salvaguarda.
- Direcao tenta ver token de pessoa cadastrada:
  - bloquear; o sistema nunca deve ter tela para isso.

### Guardrails

- Sem recuperacao por e-mail na V1.
- Sem WhatsApp.
- Sem login social.
- Sem sincronizacao em nuvem.
- Nao prometer recuperacao impossivel quando direcao perde tudo.

### Criterios de aceite

- Banco nao contem senha clara.
- Primeiro acesso obriga troca.
- Reset administrativo exige nova troca.
- Token nao reaparece.
- UX alerta sobre perda de acesso.

### Testes minimos

- Hash de senha.
- Hash/protecao da resposta.
- Bloqueio de `123456` como senha final.
- Reset administrativo.
- Token exibido uma unica vez.

### Tarefas modulares candidatas

- Escolher estrategia de hash na arquitetura.
- Modelar salvaguarda.
- Implementar troca obrigatoria.
- Implementar reset administrativo.
- Testar ausencia de segredo em persistencia e exportacao.

## BT-004 Privacidade e LGPD operacional

### Objetivo

Evitar coleta desnecessaria de dados pessoais, especialmente de estudantes, e
manter o produto focado em operacao escolar.

### Riscos que evita

- Registrar nome de estudante em necessidade operacional.
- Transformar produto em sistema pedagogico sem preparo.
- Aumentar risco LGPD sem necessidade.
- Exportar dados pessoais excessivos.

### Regras obrigatorias

- Nao coletar nome, documento, matricula ou e-mail de estudante.
- Necessidade deve descrever problema operacional.
- Pessoas cadastradas sao equipe operacional da escola.
- Dados ficam no computador da instituicao.
- Sem telemetria por padrao.
- Exportacao e local e manual.

### Fluxos de excecao

- Usuario digita dado de estudante em campo livre:
  - V1 pode orientar por texto preventivo;
  - V1 nao precisa implementar detector automatico.
- QA encontra requisito pedindo dados de estudante:
  - marcar como fora da V1.

### Guardrails

- Radar Escola nao e diario de classe.
- Radar Escola nao e prontuario pedagogico.
- Radar Escola nao e cadastro academico.

### Criterios de aceite

- Formularios nao pedem dados de estudante.
- Textos orientam evitar identificacao de estudante.
- Exportacao nao tem campos projetados para estudante.

### Testes minimos

- Revisao documental dos campos.
- Teste de UI confirmando ausencia de campos de estudante.
- Checklist de exportacao sem campos de estudante.

### Tarefas modulares candidatas

- Revisar campos do MVP.
- Criar checklist LGPD operacional.
- Criar mensagens preventivas em formularios.

## BT-005 Linguagem PT-BR e UX final user first

### Objetivo

Garantir que a interface seja compreensivel por pessoas nao tecnicas da escola.

### Riscos que evita

- Produto parecer ferramenta de TI.
- Usuario final nao entender proximo passo.
- Termos tecnicos afastarem professoras, secretaria ou direcao.

### Regras obrigatorias

- Interface em Portugues Brasileiro.
- Usar "necessidade", nao ticket ou chamado.
- Usar "Radar de Necessidades", nao dashboard.
- Botoes devem dizer a acao real.
- Estados vazios devem orientar proximo passo.
- Erros devem explicar como corrigir.

### Termos a evitar na UI principal

- ticket;
- chamado;
- service desk;
- incidente;
- workflow;
- dashboard;
- banco de dados;
- servidor;
- localhost;
- Docker;
- Tauri;
- SQLite.

### Linguagem preferida

- "Tenho algo para resolver."
- "Quero ver o que esta parado."
- "Quero acompanhar uma necessidade."
- "Quero envolver outras pessoas."
- "Quero registrar uma atualizacao."
- "Quero marcar como resolvido."

### Fluxos de excecao

- Se erro tecnico ocorrer:
  - mostrar mensagem simples;
  - nao despejar stack trace;
  - registrar detalhe tecnico apenas em log futuro se existir.

### Guardrails

- Nao transformar primeira tela em landing page.
- Nao explicar tecnologia para usuario final.
- Nao usar linguagem de suporte tecnico corporativo.

### Criterios de aceite

- QA consegue entender o proximo passo em cada tela sem documentacao externa.
- Campos obrigatorios possuem rotulos claros.
- Mensagens criticas estao em PT-BR simples.

### Testes minimos

- Revisao textual de telas centrais.
- Teste de UI para labels essenciais.
- QA manual com checklist de termos proibidos.

### Tarefas modulares candidatas

- Criar glossario de UI.
- Revisar textos de formularios.
- Criar checklist de linguagem.

## BT-006 Acessibilidade basica

### Objetivo

Permitir uso razoavel por teclado e leitura clara em computadores comuns de
escola.

### Riscos que evita

- Fluxo principal preso ao mouse.
- Foco invisivel.
- Status dependente apenas de cor.
- Texto pequeno ou confuso.

### Regras obrigatorias

- Campos com labels.
- Botoes com nomes claros.
- Ordem de tabulacao coerente.
- Foco visivel.
- Contraste suficiente.
- Status com texto, nao apenas cor.
- Confirmacoes acessiveis por teclado.

### Fluxos de excecao

- Modal de confirmacao:
  - foco deve ir para modal;
  - teclado deve permitir confirmar/cancelar;
  - fechar modal deve devolver foco para acao original quando possivel.

### Guardrails

- V1 nao precisa cumprir auditoria WCAG completa.
- V1 precisa nao bloquear fluxos principais por acessibilidade basica ruim.

### Criterios de aceite

- Login, cadastro de pessoa, registro de necessidade e resolucao funcionam por
  teclado.
- Erros aparecem associados aos campos.
- Status de necessidade tem texto visivel.

### Testes minimos

- Navegacao por teclado nos fluxos principais.
- Teste de foco em modal.
- Checklist visual de contraste.

### Tarefas modulares candidatas

- Definir padrao de formulario.
- Definir padrao de botao/confirmacao.
- Criar checklist de acessibilidade.

## BT-007 Exportacao e restauracao

### Objetivo

Proteger dados locais contra perda de computador, troca de maquina ou problema
no equipamento.

### Riscos que evita

- Escola achar que banco local sozinho e backup.
- Perda total de historico.
- Restauracao parcial baguncar dados.
- Usuario comum exportar dados sensiveis.

### Regras obrigatorias

- Exportacao e exclusiva da direcao.
- Restauracao e exclusiva da direcao.
- Apoio de gestao nao exporta nem restaura.
- Exportacao deve orientar salvar fora do computador principal.
- Restauracao substitui os dados atuais.
- V1 nao mescla dados.
- CSV deve incluir o suficiente para restaurar.
- Senhas exportadas somente como hash.

### Conjunto minimo exportavel

- escola;
- pessoas;
- cargos/funcoes;
- contas de usuario;
- salvaguardas protegidas;
- apoio de gestao;
- necessidades;
- envolvidos;
- andamentos;
- itens de plano;
- equipamentos;
- auditoria, se definido como restauravel;
- metadados de versao do export.

### Fluxos de excecao

- Arquivo incompleto:
  - bloquear restauracao.
- Versao incompatavel:
  - bloquear ou exigir migracao futura fora da V1.
- Erro durante restauracao:
  - nao deixar banco em estado parcial quando possivel.

### Guardrails

- CSV restauravel nao e importador generico.
- Nao prometer importacao de planilha externa.
- Nao pedir ao usuario para entender tabelas.

### Criterios de aceite

- Exportacao gera arquivos esperados.
- Restauracao valida substitui banco.
- Restauracao invalida nao altera dados.
- Confirmacao forte aparece antes de restaurar.

### Testes minimos

- Exportacao feliz.
- Restauracao feliz.
- CSV invalido.
- CSV sem senha clara.
- Bloqueio por perfil.

### Tarefas modulares candidatas

- Definir pacote CSV.
- Implementar exportador.
- Implementar validador.
- Implementar restauracao transacional.
- Criar roteiro QA de backup/restauracao.

## BT-008 Transferencia de direcao

### Objetivo

Evitar que mudanca de gestao da escola quebre continuidade do app.

### Riscos que evita

- Responsavel sair da escola e ninguem conseguir administrar.
- Apoio de gestao assumir poder demais por improviso.
- Exportacao/auditoria ficarem com pessoa errada.

### Regras obrigatorias

- Apenas direcao atual transfere.
- Nova direcao precisa ser pessoa ativa.
- So existe uma direcao principal.
- Transferencia gera auditoria.
- Nova direcao herda acoes exclusivas.
- Antiga direcao perde exclusividade.
- Apoios devem ser revisados depois.

### Fluxos de excecao

- Direcao tenta transferir para pessoa inativa:
  - bloquear.
- Apoio tenta transferir:
  - bloquear.
- Usuario comum tenta transferir:
  - bloquear.
- Direcao perdeu acesso:
  - procedimento tecnico futuro, fora da V1 funcional.

### Guardrails

- Nao criar multiplas direcoes na V1.
- Nao usar cargo/função como permissao automatica de direcao.

### Criterios de aceite

- Transferencia valida muda permissoes.
- Acoes exclusivas passam para nova direcao.
- Auditoria registra antes/depois.

### Testes minimos

- Transferencia feliz.
- Bloqueio por perfil.
- Permissoes depois da transferencia.
- Auditoria.

### Tarefas modulares candidatas

- Modelar direcao atual.
- Implementar transferencia.
- Criar confirmacao forte.
- Criar testes de permissao.

## BT-009 Equipamentos como apoio operacional

### Objetivo

Permitir historico por equipamento sem transformar V1 em controle patrimonial.

### Riscos que evita

- Inflar MVP com patrimonio completo.
- Nao conseguir ver recorrencia basica de problema.
- Apagar equipamento vinculado a historico.

### Regras obrigatorias

- Equipamento e cadastro simples.
- Vinculo com necessidade e opcional.
- Uma necessidade pode ter zero ou um equipamento na V1.
- Um equipamento pode aparecer em varias necessidades.
- Equipamento vinculado nao deve ser apagado fisicamente.

### Guardrails

- Sem depreciação.
- Sem nota fiscal.
- Sem QR Code.
- Sem inventario avancado.
- Sem responsavel patrimonial formal.

### Criterios de aceite

- Equipamento cadastrado aparece na lista.
- Necessidade pode vincular equipamento.
- Historico mostra equipamento associado.

### Testes minimos

- CRUD basico sem delete fisico.
- Vinculo com necessidade.
- Bloqueio de exclusao fisica com historico.

### Tarefas modulares candidatas

- Definir campos de equipamento.
- Criar tabela de equipamento.
- Criar seletor em necessidade.
- Criar testes de recorrencia basica.

## BT-010 Testes automatizados e QA

### Objetivo

Garantir que regras criticas fiquem protegidas desde o inicio sem perseguir
porcentagem artificial de cobertura.

### Riscos que evita

- Regressao em permissao.
- Senha clara por acidente.
- Resolucao por usuario comum.
- Exportacao quebrada sem perceber.
- Fluxo principal incompleto.

### Regras obrigatorias

- Mudanca em regra critica exige teste.
- Ausencia de teste em area critica precisa justificativa no PR.
- Testes devem rodar localmente.
- CI deve rodar o conjunto minimo.
- Bug corrigido deve receber regressao quando possivel.

### Areas criticas

- autenticacao;
- primeiro acesso;
- recuperacao;
- pessoas e cargos;
- apoio de gestao;
- necessidades;
- envolvidos;
- andamento;
- resolucao;
- cancelamento;
- auditoria;
- exportacao/restauracao;
- transferencia de direcao;
- sessao/bloqueio;
- persistencia SQLite.

### Piramide sugerida

- Unitarios: dominio e permissoes.
- Integracao: SQLite e repositorios.
- Interface: fluxos principais.
- Smoke: app desktop quando Tauri estiver pronto.

### Criterios de aceite

- Fluxo minimo tem teste de ponta a ponta ou roteiro QA enquanto E2E automatizado
  nao existir.
- Permissoes criticas tem teste negativo.
- Exportacao/restauracao tem teste com dados ficticios.

### Tarefas modulares candidatas

- Criar estrategia de testes.
- Configurar teste unitario.
- Configurar teste de persistencia.
- Criar fixtures.
- Criar roteiro QA do MVP.

## BT-011 Criterios globais de aceite

### MVP pode ser considerado validavel quando

- App abre localmente.
- Primeiro uso configura escola.
- Direcao entra.
- Direcao cadastra pessoa.
- Pessoa faz primeiro acesso privado.
- Pessoa registra ou acompanha necessidade.
- Necessidade aparece no Radar.
- Envolvidos podem ser marcados.
- Andamento pode ser registrado.
- Usuario comum pode solicitar fechamento tecnico.
- Direcao/apoio marca como resolvido.
- Historico preserva o que aconteceu.
- Auditoria registra acoes sensiveis.
- Exportacao/restauracao funcionam para direcao.
- Sessao bloqueia por inatividade.
- Linguagem esta em PT-BR simples.
- Testes minimos passam.

### MVP nao pode ser considerado validavel se

- Usuario comum consegue marcar resolvido.
- Senha aparece em texto claro.
- Exportacao tem senha clara.
- Necessidade nao aparece no Radar.
- Historico se perde ao resolver.
- Dados atuais sao mesclados na restauracao.
- Direcao nao consegue proteger/exportar dados.
- Fluxo principal depende de internet.

## BT-012 Guardrails de escopo

### Fora da V1

- E-mail automatico.
- WhatsApp.
- Push notification.
- Mobile.
- Nuvem.
- Multi-computador.
- Sincronizacao.
- Dashboard analitico.
- Relatorio avancado.
- Anexos.
- Fotos.
- SLA.
- Calendario.
- Controle patrimonial completo.
- Dados de estudantes.
- IA.

### Regra de decisao

Antes de incluir algo, perguntar:

> Isso ajuda diretamente a escola a registrar, acompanhar, envolver, atualizar,
> resolver e preservar historico de uma necessidade?

Se nao ajudar, fica fora da V1 ou vira backlog futuro.

## Como Este Documento Vira Issues

Cada bloco transversal deve gerar issues pequenas:

- uma issue de validacao documental;
- uma issue de regra de dominio;
- uma issue de persistencia quando houver tabela;
- uma issue de aplicacao quando houver caso de uso;
- uma issue de view quando houver tela;
- uma issue de QA/testes.

Exemplo:

- `QA: validar que usuario comum nao acessa auditoria`;
- `Domain: registrar evento NEED_RESOLVED sem expor segredo`;
- `Persistence: criar tabela audit_events`;
- `View: criar tela simples de auditoria para direcao`.
