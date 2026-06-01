# Fluxo E2E da V0

Este documento consolida o fluxo ponta a ponta da V0 do Radar Escola.

O objetivo e responder uma pergunta simples:

> O MVP entrega um ciclo util completo para uma escola?

Nota apos a tag `v0.0.1`: esse fluxo continua sendo o alvo da V0 funcional. A
release tecnica atual valida instalador, casca desktop e Playground, mas ainda
nao entrega este ciclo operacional completo.

## Resposta curta

Sim, desde que a V0 entregue um ciclo operacional completo:

> configurar -> entrar -> registrar necessidade -> acompanhar no radar ->
> cadastrar pessoas -> registrar necessidade -> acompanhar no radar -> marcar
> envolvidos -> atualizar andamento -> marcar como resolvido -> consultar historico.

Se qualquer etapa desse ciclo faltar, a V0 fica incompleta.

## Usuario principal da V0

Pessoa responsavel por organizar necessidades operacionais da escola.

Exemplos:

- secretaria;
- coordenacao;
- responsavel por laboratorio;
- pessoa da equipe tecnica;
- direcao em escola pequena.

Essa pessoa nao deve precisar entender banco de dados, servidor, Docker,
terminal, rede, cloud ou infraestrutura.

## Fluxo E2E principal

### 1. Primeiro uso

A pessoa abre o Radar Escola pela primeira vez.

O sistema pede apenas o essencial:

- nome da escola;
- nome da direcao ou pessoa responsavel principal;
- usuario;
- senha;
- alerta sobre a importancia de nao perder usuario, senha e salvaguarda;
- token simples de recuperacao;
- frase de recuperacao e resposta.

Resultado esperado:

- a escola esta configurada;
- existe um primeiro usuario local;
- existe uma salvaguarda local contra esquecimento de acesso;
- a direcao ou pessoa responsavel principal sabe que deve anotar e guardar a
  salvaguarda em local seguro;
- o usuario chega ao Radar de Necessidades.
- existe a possibilidade futura de transferir a responsabilidade principal se a
  direcao mudar.

### 2. Cadastrar pessoas/usuarios

A direcao ou pessoa responsavel principal cadastra as pessoas que poderao
acompanhar necessidades.

Cada cadastro deve ter:

- nome;
- usuario;
- cargo ou funcao;
- senha inicial padrao `123456`.

Fluxo de excecao:

- se o cargo ou funcao ainda nao existir na lista, a direcao ou responsavel
  principal pode cadastrar essa opcao na hora;
- depois de cadastrar o novo cargo ou funcao, o sistema volta ao cadastro da
  pessoa com a nova opcao selecionada.

No primeiro acesso, a pessoa cadastrada deve obrigatoriamente:

- trocar a senha;
- definir token simples ou frase de recuperacao;
- guardar a salvaguarda em local seguro.

O token deve ser exibido nesse momento e nao deve ser regenerado depois.
Esse procedimento deve ser privado. A direcao cria o usuario, mas nao deve ver a
nova senha, o token, a frase de recuperacao nem a resposta. O sistema deve
orientar que a pessoa faca esse primeiro acesso preferencialmente sem a presenca
da direcao ou com distancia segura da tela.

Resultado esperado:

- existem pessoas cadastradas para serem marcadas como envolvidas;
- a senha padrao nao permanece como senha de uso normal;
- cada pessoa tem sua propria forma local de recuperacao.
- pessoas cadastradas podem consultar necessidades, historico, envolvidos e
  andamentos;
- a direcao ou pessoa responsavel principal conserva as acoes sensiveis de
  exportacao de seguranca e gestao de acessos/senhas.

A direcao tambem pode definir ate duas pessoas como apoio de gestao,
preferencialmente coordenadores ou funcoes imediatamente abaixo da direcao. Essa
delegacao unica permite cadastrar usuarios, cancelar/corrigir necessidades e
marcar necessidades como resolvidas. Apoio de gestao nao recebe automaticamente
acesso a exportacao/restauracao de seguranca, recuperacao administrativa da
propria direcao nem transferencia de direcao.

Se uma pessoa cadastrada perder senha e salvaguarda:

- a direcao ou pessoa responsavel principal pode redefinir a senha para
  `123456`;
- no proximo acesso, a pessoa deve trocar a senha novamente;
- essa redefinicao nao gera novo token de recuperacao.

### 3. Registrar uma necessidade

A pessoa percebe algo que precisa ser resolvido.

Exemplo:

> O projetor da sala 8 nao liga.

Ela registra:

- o que precisa ser resolvido;
- onde aconteceu;
- descricao em linguagem simples;
- prioridade;
- envolvidos;
- equipamento relacionado, se existir.

Resultado esperado:

- a necessidade foi registrada;
- ela aparece no Radar de Necessidades;
- ela nao depende mais de memoria, WhatsApp, papel ou conversa informal.

### 4. Acompanhar no Radar de Necessidades

Ao entrar no sistema, a pessoa ve:

- necessidades em andamento;
- necessidades paradas;
- resolvidas recentemente.

Resultado esperado:

- o que precisa de atencao fica visivel;
- necessidades paradas nao desaparecem;
- a escola consegue enxergar o que ainda precisa ser cuidado.

### 5. Marcar envolvidos

A pessoa indica quais pessoas cadastradas precisam acompanhar a necessidade.

Resultado esperado:

- a necessidade deixa de ser apenas um registro solto;
- existe clareza sobre quem deve acompanhar ou agir;
- os envolvidos podem consultar o Radar Escola no computador instalado, usando
  usuario e senha.

### 6. Atualizar andamento

Uma pessoa envolvida acessa o computador onde o aplicativo esta instalado e
entra com seu usuario e senha.

Ela abre a necessidade e registra uma atualizacao.

Exemplo:

> Testamos outro cabo HDMI e o problema continua.

Tambem pode alterar o status:

- nova;
- em analise;
- em execucao;
- aguardando material;
- aguardando autorizacao;
- pausada.

Resultado esperado:

- o andamento fica documentado;
- outras pessoas podem consultar a situacao no Radar Escola;
- a necessidade continua viva ate ser resolvida.
- se a pessoa entender que o problema foi tecnicamente resolvido, ela registra
  isso no andamento, mas nao fecha a necessidade sozinha.

### 7. Marcar como resolvido

Quando o problema for resolvido, a direcao ou apoio de gestao registra:

- o que foi feito;
- quem resolveu;
- quando foi resolvido;
- se precisa acompanhar depois.

Exemplo:

> O cabo HDMI foi substituido e o projetor voltou a funcionar.

Resultado esperado:

- a necessidade sai do fluxo ativo;
- a solucao fica preservada;
- a escola cria memoria operacional.
- o fechamento passa pelo olhar da gestao, evitando que necessidades sejam
  encerradas sem validacao minima.

### 7.1. Cancelar ou corrigir cadastro errado

Se uma necessidade foi cadastrada por engano, a escola deve conseguir corrigir o
registro.

Na V0:

- dados simples podem ser editados quando houver erro;
- uma necessidade pode ser cancelada quando nao deve seguir no fluxo;
- exclusao definitiva deve ser evitada ou ficar restrita a direcao/responsavel
  principal;
- alteracoes relevantes devem ficar preservadas no historico sempre que
  possivel.

### 8. Consultar historico

Depois, a escola pode consultar necessidades resolvidas.

Isso ajuda a responder perguntas como:

- isso ja aconteceu antes?
- quem resolveu?
- qual foi a solucao?
- esse equipamento tem problema recorrente?

Resultado esperado:

- a escola aprende com a propria rotina;
- problemas recorrentes ficam mais faceis de perceber;
- trocas de equipe nao apagam o historico.

## Rotina de exportacao de seguranca

Exportar dados nao faz parte do fluxo principal de um usuario comum.

Mesmo assim, como o produto e local, a V0 deve prever exportacao CSV como rotina
do perfil direcao ou da pessoa responsavel principal pela protecao dos dados.

Resultado esperado:

- os dados locais podem ser preservados;
- a escola reduz risco de perda por problema no computador;
- existe uma copia simples para guardar em pendrive, pasta de rede ou outra
  maquina.
- os CSVs exportados podem ser importados de volta para restauracao em caso de
  perda, troca ou problema no computador.
- a restauracao sempre substitui os dados locais atuais; nao existe mescla na
  V0.
- antes de confirmar a restauracao, o sistema avisa claramente que os dados
  atuais serao substituidos.
- a exportacao restauravel inclui usuarios, cargos/funcoes, apoio de gestao e
  hashes de senha, nunca senhas em texto claro.

## Computador compartilhado

Como o Radar Escola sera usado em computadores compartilhados, a V0 deve prever:

- botao visivel para sair da conta;
- orientacao simples para encerrar a sessao ao terminar o uso;
- bloqueio automatico apos 30 minutos de inatividade;
- desbloqueio com senha do usuario atual, preservando o contexto quando
  possivel;
- protecao contra a ideia de que o computador pertence a uma unica pessoa.

## Auditoria minima

A V0 deve registrar "quem fez o que e quando" para acoes sensiveis, como:

- cadastro de usuario;
- redefinicao de senha;
- definicao de apoio de gestao;
- transferencia de direcao;
- exportacao/importacao de seguranca;
- cancelamento de necessidade;
- marcacao como resolvido.

Esse historico deve ser simples e local. Nao precisa virar dashboard na V0.
Quando houver consulta desse registro, ela deve ser exclusiva da
direcao/responsavel principal. Apoio de gestao nao consulta auditoria.

## Fluxo minimo de valor

O menor fluxo que ainda entrega valor real e:

> cadastrar pessoas -> registrar necessidade -> ver no radar -> marcar
> envolvidos -> atualizar andamento -> marcar como resolvido -> consultar
> historico.

Exportacao e importacao de seguranca nao fazem parte da dor diaria do usuario
comum. Elas devem existir como rotina do perfil direcao ou pessoa responsavel
principal porque o produto e local e os dados precisam ser protegidos contra
perda do computador ou problema na maquina.

## O que torna o MVP util

A V0 e util se permitir que a escola deixe de depender de:

- memoria das pessoas;
- mensagens soltas;
- papel;
- conversas de corredor;
- planilhas improvisadas;
- historico informal.

E passe a ter:

- um lugar unico para registrar necessidades;
- visao do que esta em andamento;
- visao do que esta parado;
- registro de atualizacoes;
- resolucao documentada;
- historico consultavel;
- rotina de exportacao CSV de seguranca para direcao ou responsavel principal.
- possibilidade de importar de volta os CSVs exportados para restauracao.

## O que nao faz parte do fluxo E2E da V0

- notificacao por e-mail;
- WhatsApp;
- app mobile;
- acesso remoto;
- sincronizacao entre computadores;
- dashboards;
- relatorios avancados;
- anexos;
- fotos;
- permissao complexa;
- dados de estudantes;
- nuvem.

Essas ideias podem existir no futuro, mas nao sao necessarias para provar o ciclo
principal da V0.

## Criterio de corte

Antes de adicionar qualquer nova funcionalidade, a pergunta deve ser:

> Isso melhora diretamente o ciclo registrar, acompanhar, marcar envolvidos,
> atualizar andamento, marcar como resolvido e consultar historico?

Se a resposta for nao, a funcionalidade deve ficar fora da V0.

## Teste narrativo da V0

A V0 deve ser validada com uma historia simples:

1. Maria instala e abre o Radar Escola.
2. Maria cria o primeiro acesso da escola.
3. Maria cadastra Joao como usuario com cargo ou funcao e senha inicial `123456`.
4. Joao acessa pela primeira vez em momento privado, troca a senha e define sua
   salvaguarda sem expor senha, token ou frase de recuperacao para Maria.
5. Maria registra que o projetor da sala 8 nao liga.
6. A necessidade aparece no Radar de Necessidades.
7. Maria marca Joao como responsavel/envolvido.
8. Joao acessa o mesmo computador e registra uma atualizacao.
9. A necessidade aparece como em andamento.
10. Depois de resolver tecnicamente, Joao registra uma atualizacao informando o
    que foi feito.
11. Maria, como direcao, revisa e marca a necessidade como resolvida.
12. Maria consulta o historico e ve o que foi feito.

Se essa historia funcionar de ponta a ponta, a V0 tem um MVP util.
