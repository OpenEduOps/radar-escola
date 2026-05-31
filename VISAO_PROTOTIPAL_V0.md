# Visao Prototipal V0

Este documento registra uma primeira visao prototipal em baixa fidelidade para o
primeiro produto do OpenEduOps.

O objetivo ainda nao e definir layout visual, componentes finais ou tecnologia de
interface. O objetivo e validar fluxo, linguagem, prioridade das acoes e
experiencia esperada para uma pessoa nao tecnica usando o produto em uma escola.

Esta visao deve ser lida junto com `CONTEXTO_INICIAL.md` e `GUARDRAILS_V0.md`.
Para requisitos objetivos, ver tambem `REQUISITOS_V0.md`.

## Produto

Nome candidato do produto:

> Radar Escola

Tela principal/conceito operacional:

> Radar de Necessidades

Frase de valor:

> Veja o que sua escola precisa resolver.

Principio do produto:

> Acao conjunta para cuidar das necessidades da escola.

## Primeira abertura

```text
+------------------------------------------------------+
| Radar Escola                                        |
| Veja o que sua escola precisa resolver.              |
+------------------------------------------------------+
|                                                      |
| Bem-vinda(o). Vamos preparar o uso nesta escola.     |
|                                                      |
| Nome da escola                                      |
| [ Escola Municipal __________________________ ]      |
|                                                      |
| Responsavel principal                               |
| [ Direcao - Maria Silva ______________________ ]     |
|                                                      |
| Usuario de acesso                                    |
| [ direcao.maria _____________________________ ]      |
|                                                      |
| Senha de acesso                                     |
| [ __________________________________________ ]       |
|                                                      |
| Atencao                                             |
| Esta senha protege os dados da escola. Se usuario,   |
| senha e salvaguarda forem perdidos, o acesso pode    |
| ser perdido. Anote a salvaguarda em local seguro.    |
|                                                      |
| Salvaguarda local de acesso                          |
| Token: RE-48291                                      |
| Frase de recuperacao                                 |
| [ Bairro onde cresci ________________________ ]      |
| Resposta                                             |
| [ __________________________________________ ]       |
|                                                      |
| [ Comecar ]                                         |
|                                                      |
+------------------------------------------------------+
```

## Radar de Necessidades

```text
+------------------------------------------------------+
| Radar Escola                  [Exportar] [Ajuda] [Sair]|
| Veja o que sua escola precisa resolver.              |
+------------------------------------------------------+
|                                                      |
| [ Tenho algo para resolver ]                         |
| [ Preciso pedir ajuda ]                              |
|                                                      |
| Em andamento                                        |
| ---------------------------------------------------- |
| #12 Projetor da sala 8 nao liga       Urgente        |
|     Sala 8 | Ana | Em execucao                       |
|                                                      |
| #11 Impressora da secretaria falhando  Aguardando    |
|     Secretaria | Marta | Aguardando material         |
|                                                      |
| Paradas                                              |
| ---------------------------------------------------- |
| #08 Computador 12 sem internet        3 dias parado  |
|     Laboratorio | Joao | Em analise                  |
|                                                      |
| Resolvidas recentemente                              |
| ---------------------------------------------------- |
| #07 Troca de mouse no laboratorio     Resolvido      |
|                                                      |
+------------------------------------------------------+
```

## Registrar Necessidade

```text
+------------------------------------------------------+
| Registrar necessidade                         [Voltar]|
+------------------------------------------------------+
|                                                      |
| O que precisa ser resolvido?                         |
| [ Projetor da sala 8 nao liga ________________ ]     |
|                                                      |
| Onde aconteceu?                                     |
| [ Sala 8 _____________________________________ ]     |
|                                                      |
| Descreva com suas palavras                           |
| [ Ontem o projetor nao ligou durante a aula...  ]    |
| [ ____________________________________________ ]     |
|                                                      |
| Isso atrapalha aula ou atendimento?                  |
| ( ) Sim, agora                                      |
| ( ) Sim, mas pode aguardar                           |
| ( ) Nao tenho certeza                                |
|                                                      |
| Tem equipamento envolvido?                           |
| [ Selecionar equipamento ] [ Cadastrar novo ]        |
|                                                      |
| Quem precisa acompanhar?                             |
| [ Selecionar pessoas cadastradas ]                   |
|                                                      |
| [ Registrar necessidade ]                            |
|                                                      |
+------------------------------------------------------+
```

## Detalhe da Necessidade

```text
+------------------------------------------------------+
| Necessidade #12                              [Voltar] |
| Projetor da sala 8 nao liga                          |
+------------------------------------------------------+
| Status: Em execucao              Prioridade: Urgente |
| Local: Sala 8                    Criado por: Ana     |
| Envolvidos: Ana, Coordenacao, Joao Tecnico           |
+------------------------------------------------------+
|                                                      |
| Plano de acao                                        |
| [x] Verificar tomada e cabo                          |
| [ ] Testar outro cabo HDMI                           |
| [ ] Avaliar troca da lampada                         |
|                                                      |
| Atualizacoes                                         |
| ---------------------------------------------------- |
| Joao: Verifiquei a tomada. Esta funcionando.         |
| Ana: A aula de amanha tambem depende do projetor.    |
| Sistema: Coordenacao foi marcada como envolvida.     |
|                                                      |
| Escrever atualizacao                                 |
| [ ____________________________________________ ]     |
| [ Registrar atualizacao ]                            |
|                                                      |
| [ Atualizar status ] [ Solicitar fechamento ]        |
| [ Solicitar correcao/cancelamento ]                  |
|                                                      |
+------------------------------------------------------+
```

## Solicitar Correcao ou Cancelamento

```text
+------------------------------------------------------+
| Solicitar correcao/cancelamento              [Voltar] |
+------------------------------------------------------+
| Projetor da sala 8 nao liga                          |
+------------------------------------------------------+
|                                                      |
| O que precisa ser corrigido?                         |
| ( ) Texto, local, prioridade ou equipamento           |
| ( ) Esta necessidade foi cadastrada por engano        |
| ( ) Existe outro registro igual                      |
|                                                      |
| Explique com suas palavras                           |
| [ Registrei na sala errada. O correto e sala 9. ]    |
| [ ____________________________________________ ]     |
|                                                      |
| [ Enviar para direcao/apoio de gestao ]              |
|                                                      |
+------------------------------------------------------+
```

## Registrar Solucao

```text
+------------------------------------------------------+
| Registrar solucao da necessidade #12          [Voltar]|
+------------------------------------------------------+
| Acao disponivel para direcao ou apoio de gestao.      |
+------------------------------------------------------+
|                                                      |
| O que foi feito?                                    |
| [ O cabo HDMI foi substituido e o projetor voltou ]  |
| [ a funcionar normalmente. _____________________ ]   |
|                                                      |
| Quem resolveu?                                      |
| [ Joao Tecnico _______________________________ ]     |
|                                                      |
| Precisa acompanhar depois?                           |
| ( ) Nao                                             |
| ( ) Sim, lembrar em [ 7 ] dias                       |
|                                                      |
| [ Registrar como resolvido ]                         |
|                                                      |
+------------------------------------------------------+
```

## Equipamentos

```text
+------------------------------------------------------+
| Equipamentos                                 [Voltar] |
+------------------------------------------------------+
| [ Cadastrar equipamento ]                            |
|                                                      |
| Buscar                                               |
| [ projetor, sala, patrimonio... ______________ ]     |
|                                                      |
| ---------------------------------------------------- |
| Projetor Epson X100                                  |
| Sala 8 | Patrimonio 12345 | Com problema             |
| Necessidades vinculadas: #12                         |
|                                                      |
| Computador 12                                        |
| Laboratorio | Patrimonio 99321 | Em analise          |
| Necessidades vinculadas: #08                         |
|                                                      |
+------------------------------------------------------+
```

## Entrar no Sistema

```text
+------------------------------------------------------+
| Radar Escola                                        |
| Veja o que sua escola precisa resolver.              |
+------------------------------------------------------+
|                                                      |
| Usuario                                              |
| [ maria.silva _______________________________ ]      |
|                                                      |
| Senha                                                |
| [ __________________________________________ ]       |
|                                                      |
| [ Entrar ]                                           |
|                                                      |
| Esqueci minha senha                                  |
|                                                      |
+------------------------------------------------------+
```

## Sessao Bloqueada

```text
+------------------------------------------------------+
| Sessao bloqueada                                     |
+------------------------------------------------------+
| A sessao ficou 30 minutos sem uso.                   |
| Digite sua senha para continuar.                     |
+------------------------------------------------------+
|                                                      |
| Usuario                                              |
| maria.silva                                          |
|                                                      |
| Senha                                                |
| [ __________________________________________ ]       |
|                                                      |
| [ Desbloquear ] [ Sair da conta ]                    |
|                                                      |
+------------------------------------------------------+
```

## Primeiro Acesso de Pessoa Cadastrada

```text
+------------------------------------------------------+
| Primeiro acesso                              [Sair]   |
+------------------------------------------------------+
| Sua senha inicial e temporaria.                      |
| Para continuar, crie uma nova senha e salve sua       |
| salvaguarda de acesso.                               |
| Faca isso em momento privado. A direcao nao deve ver  |
| sua senha, token ou frase de recuperacao.             |
+------------------------------------------------------+
|                                                      |
| Usuario                                              |
| [ joao.tecnico _____________________________ ]       |
|                                                      |
| Senha atual                                          |
| [ 123456 ___________________________________ ]       |
|                                                      |
| Nova senha                                           |
| [ __________________________________________ ]       |
|                                                      |
| Confirmar nova senha                                 |
| [ __________________________________________ ]       |
|                                                      |
| Salvaguarda local                                    |
| Token: RE-73924                                      |
|                                                      |
| Frase de recuperacao                                 |
| [ Bairro onde cresci ________________________ ]      |
| Resposta                                            |
| [ __________________________________________ ]       |
|                                                      |
| Recomenda-se anotar o token em local seguro.          |
| Se tirar foto para anotar depois, apague a foto.      |
| O token nao sera gerado novamente.                    |
| Proteja esta tela de outras pessoas.                  |
|                                                      |
| [ Salvar e entrar ]                                  |
|                                                      |
+------------------------------------------------------+
```

## Pessoas e Usuarios

```text
+------------------------------------------------------+
| Pessoas e usuarios                           [Voltar] |
+------------------------------------------------------+
| [ Cadastrar pessoa ]                                  |
| Direcao/responsavel ou apoio de gestao cadastra.      |
| [ Definir apoio de gestao ]                          |
| [ Transferir direcao ]                               |
| [ Auditoria ]                                        |
|                                                      |
| Buscar                                               |
| [ nome, usuario, cargo ou funcao... __________ ]     |
|                                                      |
| ---------------------------------------------------- |
| Maria Silva                                          |
| Usuario: direcao.maria | Funcao: Direcao             |
| Responsavel principal                                |
|                                                      |
| Joao Pereira                                         |
| Usuario: joao.tecnico | Funcao: Tecnico              |
| Primeiro acesso pendente                             |
| [ Redefinir senha para 123456 ]                      |
|                                                      |
+------------------------------------------------------+
```

## Auditoria

```text
+------------------------------------------------------+
| Auditoria                                    [Voltar] |
+------------------------------------------------------+
| Consulta exclusiva da direcao/responsavel principal. |
+------------------------------------------------------+
|                                                      |
| Hoje                                                 |
| ---------------------------------------------------- |
| Maria transferiu direcao para Marta       09:10      |
| Marta definiu Coordenacao como apoio      09:25      |
| Coordenacao marcou #12 como resolvida     10:40      |
|                                                      |
+------------------------------------------------------+
```

## Transferir Direcao

```text
+------------------------------------------------------+
| Transferir direcao                           [Voltar] |
+------------------------------------------------------+
| Esta acao muda a pessoa responsavel principal pela    |
| escola. Use apenas em troca real de direcao.          |
|                                                      |
| Nova pessoa responsavel                              |
| [ Buscar pessoa cadastrada __________________ ]      |
|                                                      |
| Confirmacao                                          |
| [ ] Entendo que esta acao muda o controle principal. |
|                                                      |
| [ Transferir responsabilidade ]                      |
|                                                      |
+------------------------------------------------------+
```

## Definir Apoio de Gestao

```text
+------------------------------------------------------+
| Apoio de gestao                              [Voltar] |
+------------------------------------------------------+
|                                                      |
| Quem pode apoiar a gestao?                           |
| [ Buscar pessoa ou cargo/funcao _____________ ]      |
| Limite: ate 2 pessoas alem da direcao.               |
|                                                      |
| Sugestoes                                            |
| [ ] Coordenacao                                      |
| [ ] Vice-direcao                                     |
| [ ] Secretaria responsavel                           |
|                                                      |
| Apoios atuais                                        |
| ---------------------------------------------------- |
| Coordenacao            Apoio de gestao               |
| Vice-direcao           Apoio de gestao               |
| Limite atingido                                      |
|                                                      |
| Permite cadastrar usuarios, cancelar/corrigir e      |
| marcar como resolvido.                               |
| Nao libera exportacao/restauracao nem transferencia. |
|                                                      |
| [ Salvar apoios ]                                    |
|                                                      |
+------------------------------------------------------+
```

## Cadastrar Pessoa

```text
+------------------------------------------------------+
| Cadastrar pessoa                             [Voltar] |
+------------------------------------------------------+
|                                                      |
| Nome                                                 |
| [ Joao Pereira ______________________________ ]      |
|                                                      |
| Usuario                                              |
| [ joao.tecnico _____________________________ ]       |
|                                                      |
| Cargo ou funcao                                      |
| [ Tecnico                                  v ]       |
| [ + Cadastrar novo cargo ou funcao ]                 |
|                                                      |
| Senha inicial                                        |
| [ 123456 ]                                           |
|                                                      |
| A pessoa devera trocar essa senha no primeiro acesso. |
| Oriente a pessoa a fazer isso em momento privado.     |
|                                                      |
| [ Salvar pessoa ]                                    |
|                                                      |
+------------------------------------------------------+
```

## Cadastrar Cargo ou Funcao

```text
+------------------------------------------------------+
| Novo cargo ou funcao                         [Voltar] |
+------------------------------------------------------+
|                                                      |
| Nome do cargo ou funcao                             |
| [ Tecnico de laboratorio ____________________ ]      |
|                                                      |
| Esta opcao ficara disponivel para proximos cadastros.|
|                                                      |
| [ Salvar e voltar ao cadastro da pessoa ]            |
|                                                      |
+------------------------------------------------------+
```

## Redefinir Senha de Pessoa

```text
+------------------------------------------------------+
| Redefinir senha                              [Voltar] |
+------------------------------------------------------+
| Joao Pereira                                         |
| Usuario: joao.tecnico | Funcao: Tecnico              |
+------------------------------------------------------+
|                                                      |
| Use esta acao apenas quando a pessoa perdeu senha e   |
| salvaguarda.                                         |
|                                                      |
| A senha voltara para: 123456                         |
| No proximo acesso, a pessoa devera trocar a senha e   |
| continuar usando o token original.                    |
| Esta acao nao gera novo token.                        |
|                                                      |
| [ Confirmar redefinicao ]                            |
|                                                      |
+------------------------------------------------------+
```

## Recuperar Acesso

```text
+------------------------------------------------------+
| Recuperar acesso                             [Voltar] |
+------------------------------------------------------+
|                                                      |
| Use a salvaguarda anotada pela direcao ou pessoa      |
| responsavel principal pela escola.                    |
|                                                      |
| Usuario ou nome do responsavel                       |
| [ direcao.maria _____________________________ ]      |
|                                                      |
| Token de recuperacao                                 |
| [ RE-48291 __________________________________ ]      |
|                                                      |
| Frase de recuperacao                                 |
| Bairro onde cresci                                   |
|                                                      |
| Resposta                                             |
| [ __________________________________________ ]       |
|                                                      |
| Se a salvaguarda tambem tiver sido perdida, pode ser  |
| necessario procedimento tecnico documentado.          |
|                                                      |
| [ Recuperar acesso ]                                 |
|                                                      |
+------------------------------------------------------+
```

## Cadastrar Equipamento

```text
+------------------------------------------------------+
| Cadastrar equipamento                         [Voltar]|
+------------------------------------------------------+
|                                                      |
| Nome do equipamento                                  |
| [ Projetor Epson X100 _______________________ ]      |
|                                                      |
| Onde fica?                                           |
| [ Sala 8 _____________________________________ ]      |
|                                                      |
| Patrimonio ou identificacao                          |
| [ 12345 ______________________________________ ]      |
|                                                      |
| Estado atual                                         |
| ( ) Funcionando                                      |
| ( ) Com problema                                     |
| ( ) Em manutencao                                    |
| ( ) Fora de uso                                      |
|                                                      |
| Observacoes                                          |
| [ Usado principalmente no turno da manha... ____ ]   |
|                                                      |
| [ Salvar equipamento ]                               |
|                                                      |
+------------------------------------------------------+
```

## Envolver Pessoas

```text
+------------------------------------------------------+
| Envolver pessoas na necessidade #12           [Voltar]|
+------------------------------------------------------+
| Projetor da sala 8 nao liga                          |
+------------------------------------------------------+
|                                                      |
| Quem precisa acompanhar?                             |
| [ Buscar pessoa cadastrada ___________________ ]     |
|                                                      |
| Sugestoes                                            |
| [ ] Maria Silva - Direcao                            |
| [ ] Joao Pereira - Tecnico                           |
| [ ] Marta Souza - Secretaria                         |
|                                                      |
| Envolvidos atuais                                    |
| ---------------------------------------------------- |
| Ana                     Solicitante                  |
| Joao Tecnico            Responsavel                  |
| Coordenacao             Acompanhamento               |
|                                                      |
| [ Salvar envolvidos ]                                |
|                                                      |
+------------------------------------------------------+
```

## Criar Plano de Acao

```text
+------------------------------------------------------+
| Plano de acao da necessidade #12              [Voltar]|
+------------------------------------------------------+
| Projetor da sala 8 nao liga                          |
+------------------------------------------------------+
|                                                      |
| Proximos passos                                      |
| ---------------------------------------------------- |
| [x] Verificar tomada e cabo                          |
|     Responsavel: Joao Tecnico                        |
|                                                      |
| [ ] Testar outro cabo HDMI                           |
|     Responsavel: Joao Tecnico                        |
|                                                      |
| [ ] Avaliar troca da lampada                         |
|     Responsavel: Coordenacao                         |
|                                                      |
| Adicionar passo                                      |
| [ ____________________________________________ ]     |
| Responsavel                                          |
| [ Selecionar pessoa cadastrada _______________ ]     |
|                                                      |
| [ Adicionar passo ]                                  |
| [ Salvar plano ]                                     |
|                                                      |
+------------------------------------------------------+
```

## Atualizar Andamento

```text
+------------------------------------------------------+
| Atualizar andamento da necessidade #12        [Voltar]|
+------------------------------------------------------+
| Projetor da sala 8 nao liga                          |
+------------------------------------------------------+
|                                                      |
| Novo status                                          |
| ( ) Nova                                             |
| ( ) Em analise                                       |
| ( ) Em execucao                                      |
| ( ) Aguardando material                              |
| ( ) Aguardando autorizacao                           |
| ( ) Pausada                                          |
|                                                      |
| O que mudou?                                         |
| [ Testamos outro cabo HDMI e o problema continua. ]  |
| [ ____________________________________________ ]     |
|                                                      |
| [ Salvar atualizacao ]                               |
|                                                      |
+------------------------------------------------------+
```

## Ver Necessidades Paradas

```text
+------------------------------------------------------+
| Necessidades paradas                         [Voltar] |
+------------------------------------------------------+
| Essas necessidades precisam voltar para o radar.      |
+------------------------------------------------------+
|                                                      |
| #08 Computador 12 sem internet        3 dias parado  |
| Laboratorio | Joao | Em analise                      |
| [ Ver caso ] [ Registrar atualizacao ]               |
|                                                      |
| #05 Impressora sem toner              5 dias parada  |
| Secretaria | Marta | Aguardando material             |
| [ Ver caso ] [ Registrar atualizacao ]               |
|                                                      |
| #03 Porta da biblioteca emperrada     8 dias parada  |
| Biblioteca | Coordenacao | Aguardando autorizacao     |
| [ Ver caso ] [ Registrar atualizacao ]               |
|                                                      |
+------------------------------------------------------+
```

## Historico

```text
+------------------------------------------------------+
| Historico                                    [Voltar] |
+------------------------------------------------------+
| Buscar no historico                                  |
| [ projetor, sala, pessoa, equipamento... _____ ]     |
|                                                      |
| Filtros                                              |
| [Resolvidas] [Canceladas] [Todas]                    |
|                                                      |
| ---------------------------------------------------- |
| #07 Troca de mouse no laboratorio     Resolvido      |
| Resolvido por Joao Tecnico em 12/05/2026             |
|                                                      |
| #04 Cabo de rede rompido na secretaria Resolvido     |
| Resolvido por Equipe tecnica em 08/05/2026           |
|                                                      |
| #02 Projetor sem imagem na sala 3     Resolvido      |
| Resolvido por Marta em 01/05/2026                    |
|                                                      |
+------------------------------------------------------+
```

## Exportacao de Seguranca

```text
+------------------------------------------------------+
| Exportacao de seguranca                      [Voltar] |
+------------------------------------------------------+
| Seus dados ficam neste computador.                    |
| Exporte uma copia CSV para pendrive, pasta de rede    |
| ou outra maquina.                                    |
| Acao disponivel para direcao/responsavel principal.   |
+------------------------------------------------------+
|                                                      |
| Ultima exportacao                                    |
| 20/05/2026 as 14:32                                  |
|                                                      |
| [ Exportar necessidades em CSV ]                     |
| [ Exportar equipamentos em CSV ]                     |
| [ Importar dados de seguranca ]                      |
|                                                      |
| Salvar em                                            |
| [ Escolher pendrive, pasta de rede ou outra maquina ]|
|                                                      |
| Restaurar substitui todos os dados atuais.            |
| A copia inclui usuarios e hashes, nunca senhas claras.|
+------------------------------------------------------+
| Confirmacao ao restaurar                             |
| Os dados atuais deste computador serao substituidos.  |
| Nao existe mescla na V0.                              |
| [ Cancelar ] [ Entendo e quero restaurar ]           |
|                                                      |
+------------------------------------------------------+
```

## Perguntas em Aberto

- A primeira tela deve iniciar pelo cadastro da escola ou pelo radar com
  configuracao guiada?
- O botao principal deve ser "Tenho algo para resolver" ou "Registrar
  necessidade"?
- "Preciso pedir ajuda" deve ser uma acao separada ou apenas outra porta para
  registrar uma necessidade?
- A tela principal deve priorizar "Em andamento" e "Paradas" antes de qualquer
  grafico?
- Os envolvidos devem consultar apenas o computador principal com o aplicativo
  instalado, ou a V0 deve preparar uma forma futura de acesso em rede local?

## Hipotese Principal

O coracao da experiencia deve ser o Radar de Necessidades.

Essa tela deve tornar muito visivel o que esta em andamento, o que esta parado,
quem esta envolvido e o que precisa de atencao para nao esfriar ate ser
resolvido.
