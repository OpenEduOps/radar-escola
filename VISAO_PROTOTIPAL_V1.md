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
- Recuperacao local nao usa e-mail, WhatsApp ou internet.

## Criterio De Pronto Desta Visao

Esta visao prototipal esta pronta para virar issues de interface e QA quando:

- cada tela critica tiver objetivo claro;
- cada acao sensivel mostrar quem pode executar;
- cada bloqueio importante estiver visivel;
- cada fluxo principal da V1 tiver caminho de entrada e saida;
- os rascunhos nao criarem funcionalidades fora da V1.

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
| [ Salvar e entrar ]                                        |
|                                                            |
+------------------------------------------------------------+
```

Estados:

- Nova senha igual a `123456`: bloquear.
- Confirmacao diferente: bloquear.
- Salvaguarda incompleta: bloquear.
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
| Use sua salvaguarda local.                          |
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
