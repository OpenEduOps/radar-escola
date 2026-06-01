# Visao Prototipal V1

Este documento registra rascunhos de tela em ASCII para a V1 do Radar Escola.

Ele nao define design visual final, componentes React, cores, icones ou
implementacao. O objetivo e validar a experiencia esperada, a ordem das acoes,
os estados de tela, as permissoes e os guardrails visiveis para a pessoa usuaria
final antes de abrir issues de interface e QA.

Esta visao deve ser lida junto com:

- `GUIA_ESPECIFICACAO_EXECUTAVEL_V1.md`;
- `DETALHAMENTO_REQUISITOS_V1.md`;
- `DETALHAMENTO_BLOCOS_TRANSVERSAIS_V1.md`;
- `REGRAS_DE_DOMINIO_V1.md`;
- `MATRIZ_ISSUES_V1.md`.

## Produto

Nome do produto:

> Radar Escola

Tela principal/conceito operacional:

> Radar de Necessidades

Frase de valor:

> Veja o que sua escola precisa resolver.

Principio do produto:

> Acao conjunta para cuidar das necessidades da escola.

## Objetivo Da V1

A V1 deve tornar visivel a experiencia minima do MVP:

```text
+----------------------+     +----------------------+     +------------------+
| cadastrar pessoa    | --> | registrar necessidade| --> | ver no radar     |
+----------------------+     +----------------------+     +------------------+
                                                            |
                                                            v
+----------------------+     +----------------------+     +------------------+
| consultar historico | <-- | marcar como resolvido| <-- | atualizar caso   |
+----------------------+     +----------------------+     +------------------+
```

O caminho completo de uso esperado e:

```text
primeiro uso
-> login
-> radar
-> registrar necessidade
-> marcar envolvidos
-> registrar andamento
-> combinar plano de acao
-> solicitar fechamento tecnico, quando fizer sentido
-> direcao/apoio marca como resolvido
-> consultar historico
```

## Como Ler Os Rascunhos

Legenda de permissao usada no documento:

```text
[D] Direcao/responsavel principal
[A] Apoio de gestao
[U] Usuario comum
[S] Sistema
```

Padroes de tela:

- texto de interface em Portugues Brasileiro simples;
- acoes principais no topo ou no fim do formulario;
- mensagens curtas, orientadas a acao;
- campos com rotulo visivel;
- confirmacoes fortes para acoes sensiveis;
- estados bloqueados explicitos para quem nao tem permissao;
- nenhuma tela deve citar Tauri, React, SQLite, Rust, Docker, localhost ou banco
  de dados para a pessoa usuaria final.

## Principios De UX

- O app deve parecer um software desktop local de escola.
- A primeira tela util deve ajudar a escola a agir, nao vender o produto.
- O usuario final nao precisa saber que existe banco local.
- A linguagem deve evitar `ticket`, `chamado`, `dashboard`, `workflow`,
  `incidente`, `service desk` e termos tecnicos.
- A necessidade e operacional; nao pedir nome, documento, matricula ou e-mail de
  estudante.
- O produto deve funcionar sem internet obrigatoria.
- Nao ha e-mail automatico, WhatsApp, notificacao push, nuvem ou PWA na V1.

## Mapa De Navegacao

```text
                     primeira abertura
                            |
                            v
                  configurar escola/direcao
                            |
                            v
                         login
                            |
        +-------------------+-------------------+
        |                                       |
        v                                       v
 primeiro acesso                         recuperacao local
        |                                       |
        +-------------------+-------------------+
                            |
                            v
                  Radar de Necessidades
                            |
      +---------------------+----------------------+
      |                     |                      |
      v                     v                      v
registrar necessidade   pessoas/gestao        seguranca/admin
      |                     |                      |
      v                     v                      v
detalhe da necessidade  cargos/pessoas         exportar/restaurar
      |                 apoio/reset            auditoria/direcao
      v
envolvidos/andamento/plano/equipamento
      |
      v
fechamento tecnico ou resolucao por gestao
      |
      v
historico
```

## Menu Principal De Intencoes

Estas frases continuam orientando a experiencia. Elas podem aparecer como acoes,
atalhos ou estados da tela principal:

```text
Tenho algo para resolver
Preciso pedir ajuda
Quero ver o que esta acontecendo
Quero ver o que esta parado
Quero acompanhar uma necessidade
Quero envolver outras pessoas
Quero combinar os proximos passos
Quero registrar uma atualizacao
Quero dizer que foi resolvido
Quero ver o historico
Quero cadastrar um equipamento
Quero fazer uma copia de seguranca
```

## Guardrails Visiveis

- [U] nao marca necessidade como resolvida.
- [U] pode solicitar fechamento tecnico.
- [D] e [A] podem marcar como resolvido.
- [D] e [A] podem cancelar/corrigir necessidade.
- [D] pode exportar/restaurar dados de seguranca.
- [A] e [U] nao exportam nem restauram dados.
- [D] consulta auditoria.
- [A] e [U] nao consultam auditoria.
- [D] pode transferir direcao.
- [A] e [U] nao transferem direcao.
- [D] pode redefinir senha de usuario comum para `123456`.
- [A] e [U] nao redefinem senha de terceiros.
- Equipamento e apoio operacional, nao patrimonio completo.
- Equipamento precisa ter nome, local e estado atual simples.
- Recuperacao local nao usa e-mail, WhatsApp ou internet.

## Criterio De Pronto Desta Visao

Esta visao prototipal esta pronta para virar issues de interface e QA quando:

- cada tela critica tiver objetivo claro;
- cada acao sensivel mostrar quem pode executar;
- cada bloqueio importante estiver visivel;
- cada fluxo principal da V1 tiver caminho de entrada e saida;
- os rascunhos nao criarem funcionalidades fora da V1.

## Rastreabilidade Para Issues De View

Esta tabela amarra os rascunhos deste documento com a `MATRIZ_ISSUES_V1.md`.
Ela nao cria issues reais; serve para evitar que uma tela especificada fique
sem tarefa revisavel.

| Issue candidata | Origem | Telas neste documento |
| --- | --- | --- |
| VIEW-001 | UC-001 | Primeira abertura e configuracao da escola |
| VIEW-002 | UC-002, UC-003 | Login; Primeiro acesso |
| VIEW-003 | UC-005, UC-006 | Cadastrar cargo ou funcao; Cadastrar pessoa |
| VIEW-004 | UC-009 | Radar de Necessidades |
| VIEW-005 | UC-008 | Registrar necessidade |
| VIEW-006 | UC-010 a UC-016 | Detalhe da necessidade; envolvidos; andamento; plano; fechamento; resolucao; cancelamento; historico |
| VIEW-007 | UC-019, UC-020 | Exportacao de seguranca; Restauracao de seguranca |
| VIEW-008 | UC-004 | Recuperacao local de acesso |
| VIEW-009 | UC-023, UC-024 | Sair da conta; Sessao bloqueada por inatividade |
| VIEW-010 | UC-021 | Auditoria |
| VIEW-011 | UC-022 | Transferir direcao |
| VIEW-012 | UC-017, UC-018 | Cadastrar equipamento; Vincular equipamento; Equipamentos |
| VIEW-013 | BT-003, APP-019 | Redefinir senha de usuario comum |
| VIEW-014 | UC-007 | Definir apoio de gestao |

## Acesso Local

### Primeira Abertura E Configuracao Da Escola

Objetivo: criar a escola local, a direcao inicial e a salvaguarda da direcao.

Permissao:

- [D] configura na primeira abertura.
- [S] detecta que ainda nao existe escola configurada.

```text
+------------------------------------------------------------+
| Radar Escola                                               |
| Veja o que sua escola precisa resolver.                    |
+------------------------------------------------------------+
|                                                            |
| Vamos preparar o uso nesta escola.                         |
|                                                            |
| Nome da escola                                             |
| [ Escola Municipal ____________________________________ ]   |
|                                                            |
| Responsavel principal                                      |
| [ Maria Silva ________________________________________ ]   |
|                                                            |
| Usuario de acesso                                          |
| [ direcao.maria ______________________________________ ]   |
|                                                            |
| Senha                                                      |
| [ ____________________________________________________ ]   |
|                                                            |
| Salvaguarda local                                          |
| Token gerado: RE-48291                                     |
| O token sera exibido apenas agora.                         |
| Frase de recuperacao                                       |
| [ Bairro onde cresci _________________________________ ]   |
| Resposta                                                   |
| [ ____________________________________________________ ]   |
|                                                            |
| Atencao                                                    |
| Guarde usuario, senha e salvaguarda em local seguro.       |
| Se essas informacoes forem perdidas, o acesso              |
| administrativo pode ser perdido.                           |
|                                                            |
| [ Comecar a usar ]                                         |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Campo obrigatorio vazio: manter na tela e explicar o que falta.
- Usuario ja reservado: pedir outro usuario.
- Token deve aparecer no momento de configuracao e nao reaparecer em consulta
  normal.
- Conclusao gera auditoria `SCHOOL_CONFIGURED`.
- Erro ao salvar localmente: informar erro operacional e permitir tentar de
  novo.

### Login

Objetivo: permitir entrada por usuario e senha.

Permissao:

- [D], [A] e [U] entram com usuario e senha.
- [S] redireciona para primeiro acesso quando a senha for temporaria.

```text
+------------------------------------------------------------+
| Radar Escola                                               |
| Veja o que sua escola precisa resolver.                    |
+------------------------------------------------------------+
|                                                            |
| Usuario                                                    |
| [ maria.silva ________________________________________ ]   |
|                                                            |
| Senha                                                      |
| [ ____________________________________________________ ]   |
|                                                            |
| [ Entrar ]                                                 |
|                                                            |
| Esqueci meu acesso                                         |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Usuario ou senha invalido: mostrar mensagem generica.
- Conta inativa: bloquear acesso.
- Primeiro acesso pendente: abrir tela de primeiro acesso.

### Primeiro Acesso

Objetivo: trocar senha temporaria `123456` e configurar salvaguarda privada.

Permissao:

- [A] e [U] fazem quando cadastrados pela direcao/apoio.
- [D] tambem usa esse padrao se sua conta for resetada em evolucao futura.
- [S] bloqueia uso normal ate concluir.

```text
+------------------------------------------------------------+
| Primeiro acesso                                    [Sair]   |
+------------------------------------------------------------+
| Sua senha inicial e temporaria.                            |
| Crie uma senha propria e salve sua salvaguarda.             |
| Faca isso em privacidade.                                  |
+------------------------------------------------------------+
|                                                            |
| Usuario                                                    |
| joao.tecnico                                               |
|                                                            |
| Senha atual                                                |
| [ 123456 ____________________________________________ ]    |
|                                                            |
| Nova senha                                                 |
| [ ____________________________________________________ ]   |
|                                                            |
| Confirmar nova senha                                       |
| [ ____________________________________________________ ]   |
|                                                            |
| Salvaguarda                                                |
| Token: RE-73924                                            |
| Frase de recuperacao                                       |
| [ Bairro onde cresci _________________________________ ]   |
| Resposta                                                   |
| [ ____________________________________________________ ]   |
|                                                            |
| Anote o token em local seguro. Se tirar foto para anotar    |
| depois, apague a foto. O token nao sera gerado novamente.  |
|                                                            |
| [ ] Entendo que preciso guardar minha salvaguarda.         |
|                                                            |
| [ Salvar e entrar ]                                        |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nova senha igual a `123456`: bloquear.
- Confirmacao diferente: bloquear.
- Salvaguarda incompleta: bloquear.
- Confirmacao de guarda da salvaguarda vazia: bloquear.
- Pessoa tenta pular: voltar para esta tela.

### Recuperacao Local De Acesso

Objetivo: recuperar acesso sem e-mail, WhatsApp ou internet.

Permissao:

- [D], [A] e [U] podem tentar recuperar a propria conta.
- [U] sem salvaguarda deve procurar a direcao para reset administrativo.
- [D] sem senha e sem salvaguarda pode perder acesso administrativo ate existir
  procedimento tecnico futuro.

```text
+------------------------------------------------------------+
| Recuperar acesso                                   [Voltar] |
+------------------------------------------------------------+
| Use sua salvaguarda local.                                 |
| Esta recuperacao nao usa e-mail nem internet.               |
+------------------------------------------------------------+
|                                                            |
| Usuario ou nome                                            |
| [ joao.tecnico _______________________________________ ]   |
|                                                            |
| Escolha uma forma de recuperacao                           |
| ( ) Token de recuperacao                                   |
| ( ) Resposta da frase                                      |
|                                                            |
| Token                                                      |
| [ RE-73924 ___________________________________________ ]   |
|                                                            |
| Frase cadastrada                                           |
| Bairro onde cresci                                         |
|                                                            |
| Resposta                                                   |
| [ ____________________________________________________ ]   |
|                                                            |
| Nova senha                                                 |
| [ ____________________________________________________ ]   |
|                                                            |
| Confirmar nova senha                                       |
| [ ____________________________________________________ ]   |
|                                                            |
| [ Recuperar acesso ]                                       |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Usuario nao encontrado: mensagem generica.
- Salvaguarda invalida: mensagem generica.
- Nova senha invalida: explicar regra.
- Nova senha igual a `123456`: bloquear.
- Perdeu tudo: orientar procurar direcao, quando nao for a propria direcao.

### Sair Da Conta

Objetivo: encerrar sessao em computador compartilhado.

Permissao:

- [D], [A] e [U] podem sair da propria conta.

```text
+------------------------------------------------------------+
| Sair da conta                                              |
+------------------------------------------------------------+
|                                                            |
| Voce esta usando a conta:                                  |
| Maria Silva                                                |
|                                                            |
| Ao sair, as informacoes da tela deixam de ficar visiveis.   |
|                                                            |
| [ Cancelar ]                         [ Sair da conta ]     |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Formulario com dado nao salvo: pedir confirmacao antes de sair.
- Erro ao limpar estado: voltar ao login e nao exibir dados sensiveis.

### Sessao Bloqueada Por Inatividade

Objetivo: reduzir risco de computador compartilhado com sessao aberta.

Permissao:

- [S] bloqueia apos 30 minutos sem atividade.
- [D], [A] e [U] desbloqueiam com a propria senha.
- Outro usuario precisa sair e entrar com a propria conta.

```text
+------------------------------------------------------------+
| Sessao bloqueada                                           |
+------------------------------------------------------------+
| A sessao ficou 30 minutos sem uso.                         |
| Digite sua senha para continuar.                           |
+------------------------------------------------------------+
|                                                            |
| Usuario                                                    |
| Maria Silva                                                |
|                                                            |
| Senha                                                      |
| [ ____________________________________________________ ]   |
|                                                            |
| [ Desbloquear ]                  [ Sair e trocar usuario ] |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Senha incorreta: manter bloqueado.
- Conta inativada durante sessao: encerrar e voltar ao login.
- Contexto nao pode ser preservado: desbloquear voltando ao Radar.

## Radar E Necessidades

### Radar De Necessidades

Objetivo: mostrar o que esta acontecendo, o que esta parado e o que foi
resolvido recentemente.

Permissao:

- [D], [A] e [U] consultam o Radar.
- [D] ve entrada para seguranca e auditoria.
- [A] ve gestao operacional delegada, mas nao seguranca/auditoria.
- [U] ve acoes operacionais comuns.

```text
+------------------------------------------------------------+
| Radar Escola                              Maria Silva [Sair]|
| Veja o que sua escola precisa resolver.                    |
+------------------------------------------------------------+
| [ Tenho algo para resolver ]  [ Ver paradas ] [ Historico ] |
+------------------------------------------------------------+
|                                                            |
| Em andamento                                               |
| ---------------------------------------------------------- |
| #12 Projetor da sala 8 nao liga        Urgente             |
| Sala 8 | Em execucao | Envolvidos: Ana, Joao, Coordenacao  |
| [ Ver necessidade ]                                        |
|                                                            |
| #11 Impressora da secretaria falhando  Aguardando material |
| Secretaria | Marta | 2 atualizacoes                       |
| [ Ver necessidade ]                                        |
|                                                            |
| Paradas                                                    |
| ---------------------------------------------------------- |
| #08 Computador 12 sem internet        7 dias sem andamento |
| Laboratorio | Em analise                                   |
| [ Ver caso ] [ Registrar atualizacao ]                     |
|                                                            |
| Resolvidas recentemente                                    |
| ---------------------------------------------------------- |
| #07 Troca de mouse no laboratorio      Resolvida           |
| [ Ver historico ]                                          |
|                                                            |
+------------------------------------------------------------+
| Acoes da direcao: [Pessoas] [Seguranca] [Auditoria]        |
+------------------------------------------------------------+
```

Estados:

- Sem necessidades: mostrar estado vazio com acao "Tenho algo para resolver".
- Necessidade parada: destacar por texto, nao apenas por cor.
- [U] nao ve atalhos de auditoria, seguranca ou transferencia de direcao.

### Registrar Necessidade

Objetivo: registrar algo operacional que a escola precisa resolver.

Permissao:

- [D], [A] e [U] registram necessidade.
- [S] orienta evitar dados de estudantes.

```text
+------------------------------------------------------------+
| Registrar necessidade                              [Voltar] |
+------------------------------------------------------------+
| Descreva uma necessidade operacional da escola.             |
| Evite informar nomes de estudantes.                         |
+------------------------------------------------------------+
|                                                            |
| O que precisa ser resolvido?                               |
| [ Projetor da sala 8 nao liga _________________________ ]  |
|                                                            |
| Onde acontece?                                             |
| [ Sala 8 ______________________________________________ ]  |
|                                                            |
| Descreva com suas palavras                                 |
| [ O projetor nao ligou durante a aula de ontem... ____ ]   |
| [ ____________________________________________________ ]   |
|                                                            |
| Prioridade                                                 |
| ( ) Baixa   ( ) Normal   ( ) Alta   ( ) Urgente            |
|                                                            |
| Quem precisa acompanhar?                                   |
| [ Selecionar pessoas ]                                     |
|                                                            |
| Equipamento envolvido                                      |
| [ Selecionar equipamento ] [ Cadastrar equipamento ]       |
|                                                            |
| [ Registrar necessidade ]                                  |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Titulo vazio: bloquear.
- Descricao vazia: bloquear.
- Local vazio: bloquear.
- Ao salvar, sistema cria status inicial `nova` e andamento inicial.
- Equipamento nao e obrigatorio.
- Envolvidos podem ser adicionados depois.

### Detalhe Da Necessidade

Objetivo: centralizar tudo que mantem a necessidade "quente" ate resolver.

Permissao:

- [D], [A] e [U] consultam.
- [D] e [A] veem acoes de resolver/cancelar.
- [U] ve solicitacao de fechamento tecnico.

```text
+------------------------------------------------------------+
| Necessidade #12                                  [Voltar]   |
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
| Status: Em execucao             Prioridade: Urgente        |
| Local: Sala 8                   Criado por: Ana            |
| Equipamento: Projetor Epson X100                           |
+------------------------------------------------------------+
| Envolvidos                                                 |
| Ana | Joao Tecnico | Coordenacao                           |
| [ Marcar envolvidos ]                                      |
+------------------------------------------------------------+
| Plano de acao                                              |
| [x] Verificar tomada e cabo             Joao Tecnico       |
| [ ] Testar outro cabo HDMI              Joao Tecnico       |
| [ ] Avaliar troca da lampada            Coordenacao        |
| [ Combinar proximos passos ]                               |
+------------------------------------------------------------+
| Andamentos                                                 |
| Joao: Verifiquei tomada e cabo. A tomada funciona.         |
| Ana: A turma ainda precisa usar o projetor amanha.         |
| Sistema: Coordenacao foi marcada como envolvida.           |
+------------------------------------------------------------+
| [ Registrar atualizacao ] [ Solicitar fechamento tecnico ] |
| [ Marcar como resolvido ] [ Cancelar ou corrigir ]         |
+------------------------------------------------------------+
```

Estados:

- [U] nao ve "Marcar como resolvido" como acao permitida.
- Necessidade resolvida/cancelada nao recebe novo andamento.
- Historico fica sempre preservado.

### Marcar Envolvidos

Objetivo: selecionar pessoas cadastradas que devem acompanhar a necessidade.

Permissao:

- [D], [A] e [U] podem marcar envolvidos em necessidade ativa.

```text
+------------------------------------------------------------+
| Marcar envolvidos na necessidade #12               [Voltar] |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
|                                                            |
| Buscar pessoa cadastrada                                   |
| [ nome, cargo ou funcao _______________________________ ]  |
|                                                            |
| Sugestoes                                                  |
| [ ] Maria Silva - Direcao                                  |
| [ ] Joao Pereira - Tecnico                                 |
| [ ] Marta Souza - Secretaria                               |
| [ ] Coordenacao Pedagogica                                 |
|                                                            |
| Envolvidos atuais                                          |
| ---------------------------------------------------------- |
| Ana                  Solicitante                           |
| Joao Pereira         Tecnico                               |
| Coordenacao          Acompanhamento                        |
|                                                            |
| [ Salvar envolvidos ]                                      |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Pessoa inativa nao aparece para selecao.
- Pessoa ja envolvida nao deve duplicar.
- Necessidade final bloqueia alteracao.
- Nao ha aviso externo automatico; envolvidos consultam o Radar Escola neste
  computador.

### Registrar Andamento

Objetivo: registrar uma atualizacao clara sobre o que aconteceu.

Permissao:

- [D], [A] e [U] registram andamento em necessidade ativa.

```text
+------------------------------------------------------------+
| Registrar atualizacao                              [Voltar] |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
|                                                            |
| Status depois desta atualizacao                            |
| ( ) Nova                                                   |
| ( ) Em analise                                             |
| ( ) Em execucao                                            |
| ( ) Aguardando material                                    |
| ( ) Aguardando autorizacao                                 |
| ( ) Pausada                                                |
|                                                            |
| O que mudou?                                               |
| [ Testamos outro cabo HDMI e o problema continua. ____ ]   |
| [ ____________________________________________________ ]   |
|                                                            |
| [ Salvar atualizacao ]                                     |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Texto vazio: bloquear.
- [U] nao consegue mudar para resolvida ou cancelada por esta tela.
- Status final nao volta para ativo na V1.

### Plano De Acao Simples

Objetivo: combinar proximos passos sem virar gerenciador complexo de tarefas.

Permissao:

- [D], [A] e [U] criam/concluem itens em necessidade ativa.

```text
+------------------------------------------------------------+
| Plano de acao                                      [Voltar] |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
| Proximos passos                                            |
| ---------------------------------------------------------- |
| [x] Verificar tomada e cabo                                |
|     Responsavel: Joao Pereira                              |
|                                                            |
| [ ] Testar outro cabo HDMI                                 |
|     Responsavel: Joao Pereira                              |
|                                                            |
| [ ] Avaliar troca da lampada                               |
|     Responsavel: Coordenacao                               |
|                                                            |
| Novo passo                                                 |
| [ ____________________________________________________ ]   |
|                                                            |
| Responsavel                                                |
| [ Selecionar pessoa cadastrada _______________________ ]   |
|                                                            |
| [ Adicionar passo ]                         [ Salvar ]     |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Passo vazio: bloquear.
- Responsavel e opcional.
- Necessidade resolvida/cancelada bloqueia novo item.

### Solicitar Fechamento Tecnico

Objetivo: permitir que uma pessoa diga que parece resolvido sem encerrar
oficialmente.

Permissao:

- [D], [A] e [U] podem solicitar fechamento tecnico.
- [S] nao muda status para resolvida.

```text
+------------------------------------------------------------+
| Solicitar fechamento tecnico                       [Voltar] |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
|                                                            |
| Voce acha que esta necessidade ja foi atendida?             |
|                                                            |
| Explique o que foi feito                                   |
| [ O projetor voltou a ligar apos troca do cabo. ______ ]   |
| [ ____________________________________________________ ]   |
|                                                            |
| Esta acao nao marca como resolvido.                        |
| A direcao ou apoio de gestao ainda precisa confirmar.      |
|                                                            |
| [ Enviar para verificacao ]                                |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Texto vazio: bloquear.
- Necessidade final: bloquear.
- Historico registra solicitacao de fechamento tecnico.
- Necessidade fica destacada para revisao da gestao.
- [D] e [A] podem resolver direto se fizer sentido.

### Marcar Como Resolvido

Objetivo: encerrar necessidade com olhar da gestao.

Permissao:

- [D] e [A] marcam como resolvido.
- [U] e bloqueado e pode apenas solicitar fechamento tecnico.

```text
+------------------------------------------------------------+
| Marcar como resolvido                              [Voltar] |
+------------------------------------------------------------+
| Acao disponivel para direcao ou apoio de gestao.            |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
|                                                            |
| O que resolveu esta necessidade?                           |
| [ O cabo HDMI foi substituido e o projetor voltou... __ ]  |
| [ ____________________________________________________ ]   |
|                                                            |
| Confirmacao                                                |
| [ ] Entendo que esta necessidade saira das ativas.         |
|                                                            |
| [ Registrar como resolvido ]                               |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- [U] tenta acessar: mostrar bloqueio e oferecer "Solicitar fechamento tecnico".
- Resumo vazio: bloquear.
- Necessidade ja resolvida: informar estado atual.
- Se havia fechamento tecnico solicitado, mostrar essa informacao antes da
  confirmacao.
- Resolucao gera historico e auditoria `NEED_RESOLVED`.

### Cancelar Ou Corrigir

Objetivo: corrigir erro de cadastro ou cancelar necessidade registrada por
engano, preservando memoria operacional.

Permissao:

- [D] e [A] cancelam/corrigem diretamente.
- [U] solicita correcao por andamento.

```text
+------------------------------------------------------------+
| Cancelar ou corrigir necessidade                   [Voltar] |
+------------------------------------------------------------+
| Projetor da sala 8 nao liga                                |
+------------------------------------------------------------+
|                                                            |
| O que precisa acontecer?                                   |
| ( ) Corrigir texto, local, prioridade ou equipamento        |
| ( ) Cancelar porque foi registrado por engano              |
| ( ) Cancelar porque existe outro registro igual            |
|                                                            |
| Explique o motivo                                          |
| [ Registrei na sala errada. O correto e sala 9. _____ ]   |
| [ ____________________________________________________ ]   |
|                                                            |
| [ Salvar correcao ]       [ Cancelar necessidade ]         |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- [U] ve uma versao como solicitacao, sem botao de cancelar direto.
- Motivo vazio para cancelamento: bloquear.
- Necessidade resolvida: cancelamento fica fora da V1.
- Correcao relevante fica rastreada no historico.
- Cancelamento gera historico e auditoria `NEED_CANCELLED`.

### Historico

Objetivo: consultar o que aconteceu com necessidades anteriores ou finalizadas.

Permissao:

- [D], [A] e [U] consultam historico de necessidades.
- Auditoria administrativa nao aparece aqui.

```text
+------------------------------------------------------------+
| Historico                                          [Voltar] |
+------------------------------------------------------------+
| Buscar no historico                                        |
| [ sala, pessoa, equipamento, texto... ________________ ]   |
|                                                            |
| Filtros                                                    |
| [Todas] [Resolvidas] [Canceladas] [Por equipamento]        |
|                                                            |
| ---------------------------------------------------------- |
| #07 Troca de mouse no laboratorio           Resolvida      |
| Resolvido por Joao Pereira em 12/05/2026                  |
| [ Ver detalhes ]                                           |
|                                                            |
| #04 Cabo de rede rompido na secretaria      Resolvida      |
| Resolvido por Marta Souza em 08/05/2026                   |
| [ Ver detalhes ]                                           |
|                                                            |
| #02 Projetor sem imagem na sala 3           Cancelada      |
| Cancelada por Coordenacao em 01/05/2026                   |
| [ Ver detalhes ]                                           |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Sem resultado: mostrar estado vazio e limpar filtro.
- Usuario comum consulta historico, mas nao consulta auditoria administrativa.
- Historico nao mostra senha, token, resposta ou hash.

## Gestao De Pessoas

### Cadastrar Cargo Ou Funcao

Objetivo: permitir que direcao ou apoio organize pessoas por papel operacional
sem transformar cargo em permissao automatica.

Permissao:

- [D] e [A] cadastram cargo ou funcao.
- [U] nao cadastra cargo ou funcao.
- [S] cargo/função nao concede permissao por si so.

```text
+------------------------------------------------------------+
| Cargos e funcoes                                   [Voltar] |
+------------------------------------------------------------+
| Use cargos para organizar pessoas.                         |
| Permissoes especiais dependem de direcao ou apoio.         |
+------------------------------------------------------------+
|                                                            |
| Novo cargo ou funcao                                       |
| [ Coordenacao pedagogica _____________________________ ]   |
|                                                            |
| [ Cadastrar ]                                              |
|                                                            |
| Cargos ativos                                              |
| ---------------------------------------------------------- |
| Direcao                                                    |
| Coordenacao pedagogica                                     |
| Secretaria                                                 |
| Professor(a)                                               |
| Tecnico(a)                                                 |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nome vazio: bloquear.
- Nome duplicado: bloquear.
- Cargo usado por pessoa nao deve ser apagado fisicamente na V1.
- Cadastro dentro do fluxo de pessoa deve voltar com cargo selecionado.

### Cadastrar Pessoa

Objetivo: cadastrar pessoas que poderao entrar no sistema, acompanhar
necessidades e serem marcadas como envolvidas.

Permissao:

- [D] e [A] cadastram pessoas.
- [U] nao cadastra pessoas.
- [S] senha inicial sempre temporaria: `123456`.

```text
+------------------------------------------------------------+
| Cadastrar pessoa                                   [Voltar] |
+------------------------------------------------------------+
| A pessoa usara a senha inicial 123456 apenas uma vez.      |
| No primeiro acesso ela deve trocar senha e criar salvaguarda.|
| Esse primeiro acesso deve ser feito em privacidade.        |
+------------------------------------------------------------+
|                                                            |
| Nome                                                       |
| [ Joao Pereira _______________________________________ ]   |
|                                                            |
| Cargo ou funcao                                            |
| [ Tecnico(a) _____________________________ ] [ Novo cargo ]|
|                                                            |
| Usuario de entrada                                         |
| [ joao.pereira _______________________________________ ]   |
|                                                            |
| Observacao operacional opcional                            |
| [ Atua no laboratorio e manutencao simples ___________ ]   |
|                                                            |
| [ Criar pessoa com senha inicial 123456 ]                  |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nome vazio: bloquear.
- Cargo vazio: orientar cadastrar cargo ou selecionar existente.
- Usuario vazio ou duplicado: bloquear.
- Pessoa criada fica com troca obrigatoria de senha no primeiro acesso.
- Direcao/apoio nao define senha final, token, frase nem resposta da pessoa.
- Cadastro de pessoa gera auditoria `USER_CREATED`.

### Definir Apoio De Gestao

Objetivo: permitir que a direcao delegue parte da rotina operacional para ate
duas pessoas de confianca.

Permissao:

- [D] define ou remove apoio de gestao.
- [A] nao define outro apoio.
- [U] nao define apoio.
- [S] apoio nao exporta, nao restaura, nao consulta auditoria e nao transfere
  direcao.

```text
+------------------------------------------------------------+
| Apoio de gestao                                    [Voltar] |
+------------------------------------------------------------+
| A direcao pode escolher ate 2 pessoas como apoio.           |
| Apoio ajuda a cadastrar pessoas, corrigir e resolver casos. |
+------------------------------------------------------------+
|                                                            |
| Apoios atuais                                              |
| ---------------------------------------------------------- |
| 1. Marta Souza - Coordenacao pedagogica       [ Remover ]  |
| 2. Joao Pereira - Tecnico(a)                  [ Remover ]  |
|                                                            |
| Limite atingido: 2 de 2                                    |
|                                                            |
| Buscar pessoa para delegar                                 |
| [ nome, usuario, cargo ou funcao _____________________ ]   |
|                                                            |
| Resultado                                                  |
| Ana Costa - Secretaria                        [ Bloqueado ]|
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Menos de 2 apoios: permitir adicionar pessoa ativa.
- Ja existem 2 apoios: bloquear novo apoio ate remover um atual.
- Apoio tenta acessar: bloquear com mensagem simples.
- Pessoa inativa nao pode virar apoio.
- Definir ou remover apoio gera auditoria `MANAGEMENT_SUPPORT_GRANTED` ou
  `MANAGEMENT_SUPPORT_REVOKED`.

### Redefinir Senha De Usuario Comum

Objetivo: permitir que direcao ajude quando usuario comum perdeu senha e
salvaguarda, sem expor segredos pessoais.

Permissao:

- [D] redefine senha de usuario comum para `123456`.
- [A] nao redefine senha.
- [U] nao redefine senha.
- [S] reset nao mostra senha antiga, token, frase, resposta nem hash.

```text
+------------------------------------------------------------+
| Redefinir senha                                    [Voltar] |
+------------------------------------------------------------+
| Use apenas quando a pessoa perdeu senha e salvaguarda.      |
| A senha voltara para 123456 e exigira novo primeiro acesso. |
| O proximo acesso da pessoa deve ser feito em privacidade.  |
+------------------------------------------------------------+
|                                                            |
| Pessoa                                                     |
| Joao Pereira - Tecnico(a)                                  |
| Usuario: joao.pereira                                      |
|                                                            |
| Confirmacao                                                |
| [ ] Entendo que a pessoa tera de entrar novamente com      |
|     123456 e criar nova senha e salvaguarda.               |
|                                                            |
| [ Redefinir para 123456 ]                                  |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Sem confirmacao: bloquear.
- Diretor atual nao deve resetar a propria senha por este fluxo.
- Usuario redefinido fica obrigado a trocar senha antes de usar o Radar.
- Reset gera auditoria `PASSWORD_RESET` sem expor conteudo sensivel.

## Equipamentos

### Cadastrar Equipamento

Objetivo: cadastrar um equipamento simples para facilitar vinculo com
necessidades e consultas futuras.

Permissao:

- [D] e [A] cadastram, editam e inativam equipamentos.
- [U] cadastra equipamento simples apenas quando precisar vincular a uma
  necessidade.
- [S] equipamento nao e controle patrimonial completo na V1.

```text
+------------------------------------------------------------+
| Cadastrar equipamento                              [Voltar] |
+------------------------------------------------------------+
| Cadastre apenas informacoes uteis para resolver necessidades.|
| Isto nao substitui controle patrimonial da escola.          |
+------------------------------------------------------------+
|                                                            |
| Nome do equipamento                                        |
| [ Projetor Epson X100 ________________________________ ]   |
|                                                            |
| Local comum                                                |
| [ Sala 8 ______________________________________________ ]  |
|                                                            |
| Estado atual                                               |
| ( ) Em uso   ( ) Com problema   ( ) Fora de uso            |
|                                                            |
| Identificacao ou patrimonio, se houver                     |
| [ PATR-000123 ________________________________________ ]   |
|                                                            |
| Observacao operacional                                     |
| [ Controle remoto fica na secretaria. ________________ ]   |
|                                                            |
| [ Salvar equipamento ]                                     |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nome vazio: bloquear.
- Local vazio: bloquear.
- Estado atual vazio: bloquear.
- Identificacao/patrimonio e opcional.
- Identificacao duplicada: alertar e bloquear ou pedir confirmacao conforme
  regra final.
- [U] volta ao registro da necessidade com equipamento selecionado.
- [U] nao ve opcoes de editar ou inativar depois do cadastro simples.

### Selecionar Ou Vincular Equipamento

Objetivo: relacionar uma necessidade ativa a zero ou um equipamento.

Permissao:

- [D], [A] e [U] vinculam equipamento a necessidade ativa.
- [D] e [A] podem remover vinculo registrado por engano.
- [U] pode remover vinculo enquanto necessidade estiver ativa, quando foi ele
  quem marcou errado.

```text
+------------------------------------------------------------+
| Vincular equipamento                               [Voltar] |
+------------------------------------------------------------+
| Necessidade #12 - Projetor da sala 8 nao liga              |
+------------------------------------------------------------+
| Equipamento atual                                          |
| Nenhum equipamento vinculado.                              |
|                                                            |
| Buscar equipamento                                         |
| [ projetor, sala, patrimonio... ______________________ ]   |
|                                                            |
| Resultados                                                 |
| ---------------------------------------------------------- |
| Projetor Epson X100 | Sala 8 | PATR-000123    [ Vincular ]|
| Projetor BenQ       | Sala 3 | sem patrimonio [ Vincular ]|
|                                                            |
| Nao encontrou?                                             |
| [ Cadastrar equipamento simples ]                          |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Necessidade pode ficar sem equipamento.
- Necessidade final bloqueia novo vinculo.
- Uma necessidade tem zero ou um equipamento na V1.
- Equipamento inativo nao aparece como opcao padrao.
- Vinculo ou remocao de vinculo fica registrado no historico da necessidade.

### Equipamentos

Objetivo: consultar equipamentos cadastrados e perceber necessidades
recorrentes por equipamento.

Permissao:

- [D], [A] e [U] consultam equipamentos.
- [D] e [A] editam ou inativam.
- [U] consulta e vincula em necessidades, mas nao edita cadastro.

```text
+------------------------------------------------------------+
| Equipamentos                                       [Voltar] |
+------------------------------------------------------------+
| Buscar                                                     |
| [ nome, local, identificacao... ______________________ ]   |
|                                                            |
| [ Cadastrar equipamento ]                                  |
+------------------------------------------------------------+
| Projetor Epson X100                                        |
| Sala 8 | PATR-000123 | 3 necessidades registradas          |
| [ Ver historico ] [ Editar ] [ Inativar ]                  |
|                                                            |
| Impressora HP Laser                                        |
| Secretaria | sem patrimonio | 1 necessidade registrada     |
| [ Ver historico ] [ Editar ] [ Inativar ]                  |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- [U] nao ve "Editar" nem "Inativar".
- Equipamento com historico nao deve ser apagado fisicamente.
- Inativar remove da selecao padrao, mas preserva historico.
- Historico por equipamento usa necessidades vinculadas.

## Seguranca E Administracao

### Exportacao De Seguranca

Objetivo: permitir que a direcao gere uma copia restauravel dos dados locais e
guarde fora do computador principal.

Permissao:

- [D] exporta dados de seguranca.
- [A] e [U] nao exportam.
- [S] exportacao inclui hashes, nunca senhas, tokens ou respostas em texto claro.

```text
+------------------------------------------------------------+
| Seguranca > Exportar dados                         [Voltar] |
+------------------------------------------------------------+
| Esta copia ajuda em caso de perda ou problema no computador.|
| Salve tambem em pendrive, pasta de rede ou outra maquina.  |
+------------------------------------------------------------+
| A exportacao inclui:                                      |
| - escola, pessoas, cargos e apoios                         |
| - necessidades, envolvidos, planos e historico             |
| - equipamentos                                             |
| - auditoria historica                                      |
| - senhas protegidas por hash                               |
|                                                            |
| A exportacao nao inclui senha clara, token claro ou        |
| resposta clara de recuperacao.                             |
|                                                            |
| [ Gerar exportacao de seguranca ]                          |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- [A] ou [U] tenta acessar: bloquear.
- Falha ao gerar arquivo: explicar e nao registrar sucesso.
- Exportacao concluida gera auditoria `SECURITY_EXPORT_CREATED`.
- Interface deve recomendar salvar copia fora do computador principal.

### Restauracao De Seguranca

Objetivo: restaurar dados exportados pelo proprio Radar Escola, substituindo os
dados atuais.

Permissao:

- [D] restaura dados de seguranca.
- [A] e [U] nao restauram.
- [S] restauracao sempre substitui; nao existe mescla na V1.

```text
+------------------------------------------------------------+
| Seguranca > Restaurar dados                        [Voltar] |
+------------------------------------------------------------+
| Atencao: restaurar substitui todos os dados atuais.         |
| Nao e importacao parcial, nem mescla de registros.          |
+------------------------------------------------------------+
| Arquivo de restauracao                                     |
| [ Selecionar arquivo exportado pelo Radar Escola ]         |
|                                                            |
| O que acontecera                                           |
| - dados atuais serao substituidos                          |
| - usuarios e hashes de senha virao da exportacao           |
| - auditoria historica do pacote sera restaurada            |
| - evento da restauracao atual sera registrado se possivel  |
|                                                            |
| Confirmacao forte                                          |
| Digite RESTAURAR para continuar                            |
| [ RESTAURAR __________________________________________ ]   |
|                                                            |
| [ Restaurar e substituir dados atuais ]                    |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Arquivo invalido: bloquear.
- Confirmacao diferente de `RESTAURAR`: bloquear.
- Falha durante restauracao: preservar estado anterior quando tecnicamente
  possivel.
- Restauracao concluida gera auditoria `SECURITY_IMPORT_RESTORED`, quando
  tecnicamente possivel.
- Sucesso leva ao login ou Radar conforme sessao valida depois da restauracao.

### Auditoria

Objetivo: permitir que somente a direcao consulte a memoria de acoes sensiveis.

Permissao:

- [D] consulta auditoria.
- [A] e [U] nao consultam auditoria.
- [S] auditoria nao mostra senha, token, resposta nem hash sensivel.

```text
+------------------------------------------------------------+
| Auditoria                                          [Voltar] |
+------------------------------------------------------------+
| Acoes sensiveis registradas pelo sistema.                  |
+------------------------------------------------------------+
| Buscar                                                     |
| [ pessoa, acao, data... _____________________________ ]    |
|                                                            |
| Filtros                                                    |
| [Todos] [Usuarios] [Necessidades] [Seguranca] [Direcao]    |
|                                                            |
| ---------------------------------------------------------- |
| 12/05/2026 09:12 | USER_CREATED                            |
| Marta Souza cadastrou Joao Pereira                         |
|                                                            |
| 12/05/2026 10:03 | PASSWORD_RESET                          |
| Direcao redefiniu senha temporaria de Joao Pereira         |
|                                                            |
| 13/05/2026 15:40 | NEED_RESOLVED                           |
| Marta Souza marcou necessidade #12 como resolvida          |
|                                                            |
| 14/05/2026 08:20 | SECURITY_EXPORT_CREATED                 |
| Direcao gerou exportacao de seguranca                      |
+------------------------------------------------------------+
```

Estados:

- Sem eventos: mostrar estado vazio.
- Evento nao pode ser editado pela interface.
- Evento nao pode ser apagado fisicamente pela interface.
- [A] bloqueado mesmo sendo apoio de gestao.

### Transferir Direcao

Objetivo: permitir troca controlada da pessoa responsavel principal pela escola.

Permissao:

- [D] atual transfere direcao para uma pessoa ativa.
- [A] e [U] nao transferem direcao.
- [S] transferencia move acesso a auditoria, seguranca e responsabilidade
  principal.

```text
+------------------------------------------------------------+
| Transferir direcao                                 [Voltar] |
+------------------------------------------------------------+
| Esta acao transfere a responsabilidade principal da escola. |
| A nova direcao tera acesso a seguranca e auditoria.         |
+------------------------------------------------------------+
| Direcao atual                                              |
| Maria Silva                                                |
|                                                            |
| Nova direcao                                               |
| [ Buscar pessoa ativa ________________________________ ]   |
|                                                            |
| Resultado selecionado                                      |
| Ana Costa - Secretaria                                     |
|                                                            |
| Confirmacao                                                |
| [ ] Entendo que Ana Costa sera a nova direcao do sistema.  |
| [ ] Entendo que minha permissao de direcao sera retirada.  |
|                                                            |
| [ Transferir direcao ]                                     |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nova direcao vazia: bloquear.
- Pessoa inativa: bloquear.
- Direcao tenta transferir para si mesma: informar que ja e responsavel.
- Transferencia gera auditoria `DIRECTORSHIP_TRANSFERRED`.
- Direcao anterior perde acoes exclusivas, salvo se tiver outra delegacao.
- Depois da transferencia, sistema deve orientar revisar apoios de gestao.
