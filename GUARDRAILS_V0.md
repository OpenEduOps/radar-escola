# Guardrails da V0

Este documento registra guardrails iniciais para a V0 do primeiro produto do
OpenEduOps.

Ele deve ser lido junto com:

- `CONTEXTO_INICIAL.md`;
- `REQUISITOS_V0.md`;
- `VISAO_PROTOTIPAL_V0.md`;
- `ESCOPO_V0.md`;
- `FLUXO_E2E_V0.md`.

O objetivo e proteger a experiencia do usuario final, reduzir riscos de escopo e
evitar que decisoes tecnicas enfraquecam a proposta inicial.

## Identidade e linguagem

- O nome publico adotado por enquanto e `Radar Escola`.
- `EduDesk` deve ser tratado apenas como nome anterior/codinome historico, ate
  decisao contraria.
- A tela principal/conceito operacional e `Radar de Necessidades`.
- A frase de valor e: "Veja o que sua escola precisa resolver."
- O principio do produto e: "Acao conjunta para cuidar das necessidades da
  escola."
- A unidade central do produto e `necessidade`, nao ticket ou chamado.
- A interface deve priorizar linguagem de intencao do usuario, como "Tenho algo
  para resolver" e "Quero ver o que esta parado".

## Experiencia do usuario final

- A V0 deve priorizar Windows desktop local.
- O fluxo principal deve ser: baixar, instalar, abrir e registrar a primeira
  necessidade em poucos minutos.
- O usuario final nao deve precisar entender Tauri, Rust, React, TypeScript,
  SQLite, banco de dados, servidor local, Docker ou infraestrutura.
- Docker nao deve fazer parte da experiencia do usuario final.
- O produto deve continuar util mesmo sem internet.
- E-mail, WhatsApp, mensageria e notificacoes automaticas nao devem fazer parte
  da V0.

## Escopo da V0

A V0 deve privilegiar o menor conjunto funcional que demonstre valor real:

- primeira abertura;
- cadastro local de pessoas/usuarios;
- Radar de Necessidades;
- registro de necessidade;
- detalhe da necessidade;
- envolvidos;
- andamento;
- registro de resolucao;
- historico;
- exportacao CSV de seguranca;
- equipamentos basicos quando necessarios para vincular uma necessidade.

Funcionalidades que devem ser tratadas com cuidado para nao inflar a V0:

- recuperacao de senha por e-mail;
- notificacoes automaticas;
- relatorios avancados;
- permissoes complexas;
- integracoes externas;
- modo multiunidade;
- sincronizacao entre computadores;
- importacao em massa;
- dashboards analiticos.

## Dados, privacidade e LGPD

- Coletar apenas os dados necessarios para a V0.
- Nao coletar nomes, e-mails, documentos, matriculas ou outros dados pessoais de
  estudantes na V0.
- O Radar Escola e um produto operacional, nao pedagogico ou academico. A V0 deve
  registrar necessidades da instituicao, equipamentos, locais, envolvidos
  operacionais e historico de resolucao.
- Se uma necessidade envolver estudantes indiretamente, o registro deve
  descrever o problema operacional sem identificar estudantes.
- Deixar claro que os dados ficam no computador da instituicao.
- Nao enviar dados para nuvem por padrao.
- Nao adicionar telemetria por padrao.
- Nao exigir e-mail pessoal para recuperacao de acesso na V0.
- O acesso normal deve usar usuario e senha.
- A V0 deve prever salvaguarda local para esquecimento de usuario e senha, como
  token simples, frase de recuperacao, pessoa responsavel ou fluxo manual
  documentado.
- Senhas nunca devem ser armazenadas em texto claro.
- Senhas devem ser armazenadas no banco apenas como hash adequado para senhas,
  com sal e parametros seguros conforme a tecnologia escolhida.
- A senha inicial padrao `123456` so pode ser usada para pessoas cadastradas e
  apenas como senha temporaria de primeiro acesso.
- O sistema deve obrigar a troca da senha inicial antes de permitir uso normal do
  usuario cadastrado.
- O produto deve salvar os dados no banco local e permitir exportacao CSV de
  seguranca.
- A exportacao CSV de seguranca deve preservar dados suficientes para permitir
  importacao/restauracao posterior.
- O produto deve prever caminho futuro para editar ou remover dados pessoais.
- Cargo ou funcao deve ajudar na identificacao, busca e organizacao das pessoas.
- Na V0, pessoas cadastradas podem ver necessidades, historico, envolvidos e
  andamentos.
- A V0 nao deve criar regras complexas de permissao por cargo ou funcao.
- As excecoes devem ser acoes sensiveis da direcao ou pessoa responsavel
  principal, especialmente exportacao de seguranca e gestao de acessos/senhas.
- A direcao ou pessoa responsavel principal pode definir ate duas pessoas como
  apoio de gestao.
- Apoio de gestao deve ser uma delegacao unica na V0.
- A delegacao deve ser explicita, preferencialmente para coordenadores ou
  funcoes imediatamente abaixo da direcao, conforme a hierarquia real da escola.
- Apoio de gestao permite cadastrar usuarios, cancelar/corrigir necessidades e
  marcar necessidades como resolvidas.
- Apoio de gestao nao deve liberar automaticamente exportacao/restauracao de
  seguranca, recuperacao administrativa da propria direcao nem transferencia de
  direcao.
- O cadastro de pessoa nao deve ser bloqueado quando o cargo ou funcao ainda nao
  existir; a interface deve permitir criar a opcao como excecao dentro do fluxo.

## Auditoria minima

- A V0 deve registrar historico local simples de acoes sensiveis.
- A auditoria deve responder, no minimo: quem fez, o que fez e quando fez.
- Eventos sensiveis minimos:
  - cadastro de usuario;
  - redefinicao administrativa de senha;
  - definicao de apoio de gestao;
  - exportacao/importacao de seguranca;
  - transferencia de direcao/responsavel principal;
  - marcacao de necessidade como resolvida;
  - cancelamento ou exclusao de necessidade.
- A V0 nao precisa ter dashboard de auditoria, mas os eventos devem ser
  persistidos localmente.
- A consulta da auditoria deve ser exclusiva da direcao/responsavel principal.
- Apoio de gestao nao deve consultar auditoria.

## Computador compartilhado

- O produto deve ter acao visivel de sair da conta.
- A interface deve orientar pessoas cadastradas a sair da conta ao terminar o
  uso, especialmente em computador compartilhado.
- A sessao deve bloquear apos 30 minutos de inatividade.
- Ao desbloquear, o sistema deve pedir a senha do usuario atual e preservar o
  contexto quando possivel.
- Sessao aberta em computador compartilhado deve ser tratada como risco de UX e
  seguranca.

## Troca de direcao

- A V0 deve prever transferencia da responsabilidade principal da escola.
- A transferencia deve ser acao sensivel, com confirmacao clara.
- A transferencia deve registrar auditoria minima.
- O fluxo deve reduzir risco de perda acidental de controle administrativo.

## Recuperacao de acesso

- Recuperacao por e-mail pessoal nao deve fazer parte do fluxo principal da V0.
- O produto deve usar usuario e senha como forma normal de acesso.
- A direcao da escola deve ser tratada como responsavel maxima inicial pelo
  cadastro da escola, primeira senha e salvaguarda de acesso.
- Durante a configuracao inicial, o produto deve exibir alerta claro sobre a
  importancia de nao perder usuario, senha e salvaguarda.
- A salvaguarda local deve usar usuario ou nome do responsavel e permitir
  recuperacao por token simples ou frase de recuperacao.
- O token e a frase de recuperacao devem ser apresentados de forma que a direcao ou
  pessoa responsavel consiga anotar e guardar em local seguro.
- O token de recuperacao deve ser exibido no momento de configuracao da
  salvaguarda e nao deve ser regenerado.
- A resposta da frase de recuperacao nao deve ser armazenada em texto claro.
- Para pessoas cadastradas depois da configuracao inicial, a salvaguarda local
  tambem deve ser definida no primeiro acesso, junto com a troca da senha padrao.
- O primeiro acesso de pessoa cadastrada deve ser privado. A direcao ou pessoa
  responsavel principal nao deve visualizar a nova senha, o token, a frase de
  recuperacao nem a resposta.
- A interface deve orientar que a pessoa faca esse procedimento
  preferencialmente sem a presenca da direcao ou com distancia segura da tela.
- A recuperacao individual deve poder usar token simples ou frase de recuperacao.
- Exemplos de frase de recuperacao devem ser simples e compreensiveis,
  como bairro onde cresceu, apelido de infancia ou outra referencia pessoal que
  a pessoa consiga lembrar sem registrar dado sensivel de terceiros.
- O produto deve recomendar que o token seja anotado em local seguro. Se a pessoa
  tirar foto temporariamente para anotar depois, deve apagar a foto apos guardar
  a informacao em local seguro.
- A direcao ou pessoa responsavel principal pode redefinir a senha de usuarios
  comuns para `123456` quando a pessoa perder senha e salvaguarda.
- Essa redefinicao deve recolocar o usuario em estado de primeiro acesso,
  exigindo troca obrigatoria de senha antes do uso normal.
- A redefinicao administrativa de senha nao deve gerar novo token. Se houver
  necessidade de atualizar a frase de recuperacao, isso deve acontecer dentro do
  fluxo autenticado apos a redefinicao, mantendo o token original como historico
  de salvaguarda exibido uma unica vez.
- A redefinicao administrativa deve ser registrada no historico/auditoria local
  quando esse recurso existir, sem expor a senha nova em texto claro.
- Se usuario, senha e salvaguarda forem perdidos, o acesso administrativo pode
  ser perdido. Nesse caso, a recuperacao dependera de um procedimento tecnico
  documentado, se existir.
- A recuperacao de acesso nao deve quebrar a promessa de uso local/offline.

## Acompanhamento pelos envolvidos

- Cada envolvido deve consultar o Radar Escola no computador em que o aplicativo
  esta instalado, usando seu usuario e senha.
- Envolvidos devem ser selecionados a partir de pessoas/usuarios cadastrados.
- A V0 nao deve enviar e-mails automaticos.
- A V0 nao deve depender de WhatsApp, mensageria, push notification ou qualquer
  vendor externo para acompanhar necessidades.
- O produto deve manter necessidades em andamento e paradas muito visiveis no
  Radar de Necessidades.
- A tela de necessidades paradas deve ajudar a manter o assunto quente sem
  depender de notificacoes externas.
- Integracoes de notificacao podem ser discutidas depois da V0, se houver
  necessidade real, baixo atrito de implantacao e guardrails de privacidade.

## Exportacao de seguranca

- O banco local e a persistencia principal da V0.
- Exportacao CSV de seguranca deve ser parte da V0.
- Exportacao de seguranca deve ser responsabilidade do perfil direcao ou da
  pessoa responsavel principal.
- O sistema deve orientar explicitamente que a exportacao seja salva fora do
  computador principal, como pendrive, pasta de rede ou outra maquina.
- Exportar CSV deve ser simples para uma pessoa responsavel nao tecnica.
- O CSV deve ser legivel fora do aplicativo.
- A V0 deve permitir importar de volta os CSVs exportados pelo proprio Radar
  Escola para restauracao em caso de perda, troca ou problema no computador.
- Restauracao por CSV deve sempre substituir os dados locais atuais.
- A V0 nao deve tentar mesclar dados importados com dados existentes.
- Antes da restauracao, a interface deve exibir confirmacao forte informando que
  os dados atuais serao substituidos.
- A exportacao deve preservar vinculos entre necessidades, equipamentos,
  pessoas, envolvidos, andamentos e historico.
- A exportacao restauravel deve incluir usuarios, cargos/funcoes, apoio de
  gestao e hashes de senha necessarios para restaurar os acessos.
- A exportacao nunca deve incluir senhas em texto claro.
- A importacao de restauracao deve ser tratada como acao sensivel da direcao ou
  pessoa responsavel principal.

## Resolucao de necessidades

- Pessoas cadastradas podem acompanhar necessidades e registrar atualizacoes de
  andamento.
- Marcar uma necessidade como resolvida deve ser permitido apenas para direcao ou
  apoio de gestao.
- Essa restricao existe para que a resolucao passe pelo olhar da gestao e nao
  seja encerrada sem validacao minima.
- A restricao de resolucao nao deve impedir que envolvidos expliquem, no
  andamento, que tecnicamente o problema foi resolvido.

## Edicao, cancelamento e exclusao

- A V0 deve permitir corrigir erros comuns de cadastro.
- Necessidades cadastradas por engano devem poder ser canceladas.
- Exclusao definitiva deve ser evitada na V0 ou ficar restrita a
  direcao/responsavel principal.
- Alteracoes e cancelamentos relevantes devem preservar historico sempre que
  possivel.
- A regra deve favorecer memoria operacional em vez de apagar rastros uteis.

## Arquitetura

- Stack inicial: Tauri + React + TypeScript + SQLite.
- React e TypeScript concentram experiencia, telas, componentes, formularios,
  estados, validacoes e regras simples de aplicacao.
- SQLite e o banco local, gratuito e embutido.
- Tauri e Rust atuam como casca desktop e ponte nativa minima.
- Rust nao deve ser o centro da regra de negocio na V0.
- A arquitetura deve favorecer componentes pequenos, pastas por dominio,
  validacoes centralizadas, testes focados e convencoes simples.
- Evitar abstracoes prematuras e dependencias desnecessarias.

## Testes automatizados

A V0 deve nascer com testes automatizados proporcionais ao risco do produto.

### Testes unitarios

Devem cobrir regras puras e validacoes, incluindo:

- visibilidade geral de necessidades para pessoas cadastradas;
- restricao de exportacao/restauracao de seguranca e transferencia de direcao
  para direcao ou pessoa responsavel principal;
- definicao explicita de apoio de gestao;
- limite maximo de duas pessoas como apoio de gestao alem da direcao;
- restricao de marcacao como resolvido para direcao ou apoio de gestao;
- auditoria minima de acoes sensiveis;
- consulta de auditoria exclusiva da direcao/responsavel principal;
- transferencia de direcao/responsavel principal;
- logout/saida da conta em computador compartilhado;
- bloqueio de sessao apos 30 minutos de inatividade;
- cancelamento de necessidade cadastrada por engano;
- criacao de necessidade;
- transicoes de status permitidas;
- marcacao de envolvidos;
- cadastro de pessoa/usuario;
- cadastro de cargo ou funcao durante cadastro de pessoa;
- obrigatoriedade de troca da senha inicial padrao;
- redefinicao administrativa de senha para `123456` com nova troca obrigatoria;
- regras de prioridade;
- regras de necessidades paradas;
- validacao de campos obrigatorios;
- validacao de usuario;
- armazenamento de senhas apenas como hash;
- regras de token simples ou frase de recuperacao;
- regra de nao regenerar token de recuperacao;
- regras de plano de acao;
- fechamento/resolucao de necessidade.

### Testes de persistencia

Devem cobrir o uso do SQLite em cenarios essenciais:

- criacao e leitura de necessidade;
- atualizacao de andamento;
- vinculo entre necessidade e equipamento;
- registro de historico;
- registro de auditoria minima;
- criacao e leitura de equipamento;
- migracoes basicas do banco;
- integridade minima dos dados.

### Testes de exportacao de seguranca

Devem cobrir fluxos criticos de dados:

- exportacao de necessidades em CSV;
- exportacao de equipamentos em CSV;
- importacao/restauracao a partir dos CSVs exportados;
- restauracao substituindo os dados locais atuais, sem mescla;
- cabecalhos esperados;
- dados essenciais presentes;
- preservacao de vinculos entre necessidades, equipamentos, pessoas,
  envolvidos, andamentos e historico;
- preservacao de usuarios, cargos/funcoes, apoio de gestao e hashes de senha na
  exportacao restauravel;
- ausencia de senhas em texto claro na exportacao;
- erro ao exportar para caminho indisponivel;
- preservacao do banco local apos exportacao.

### Testes de interface

Devem cobrir os fluxos principais da experiencia:

- primeira abertura;
- cadastro de pessoa/usuario;
- primeiro acesso com troca obrigatoria da senha padrao;
- orientacao de privacidade no primeiro acesso de pessoa cadastrada;
- saida da conta em computador compartilhado;
- bloqueio por inatividade e retorno com senha do usuario atual;
- registro de uma necessidade;
- exibicao da necessidade no radar;
- atualizacao de andamento;
- registro de resolucao;
- solicitacao de fechamento por usuario comum e fechamento pela gestao;
- cancelamento de necessidade cadastrada por engano;
- visualizacao de historico;
- criacao de equipamento basico;
- fluxo de exportacao CSV de seguranca.
- fluxo de importacao/restauracao dos CSVs exportados.

### Testes de integracao desktop

Devem ser adicionados quando o empacotamento Tauri estiver disponivel:

- abertura do aplicativo;
- acesso ao banco local;
- leitura e escrita de arquivos permitidos;
- escolha de destino para exportacao CSV;
- funcionamento basico no Windows.

### Guardrail de cobertura

- A cobertura deve priorizar fluxos criticos, nao porcentagem artificial.
- Mudancas em regras de necessidade, persistencia, exportacao/importacao CSV,
  acompanhamento pelos envolvidos, resolucao de necessidades ou recuperacao de
  acesso devem incluir testes automatizados.
- Mudancas em auditoria, sessao/logout, transferencia de direcao ou
  cancelamento/exclusao tambem devem incluir testes automatizados quando
  implementadas.
- Bugs corrigidos devem receber teste de regressao sempre que possivel.
- A ausencia de teste em area critica deve ser justificada no pull request.

## Acessibilidade e linguagem

- A interface deve ser em Portugues Brasileiro.
- Evitar termos tecnicos como ticket, service desk, incidente, workflow e
  dashboard na experiencia principal.
- Usar linguagem simples e orientada a intencao.
- Campos e botoes devem ser compreensiveis para pessoas nao tecnicas.
- Fluxos importantes devem funcionar com teclado.
- Estados vazios, erros e confirmacoes devem ser claros.

## Criterios de aceite para avancar alem da V0

Antes de ampliar escopo, a V0 deve demonstrar:

- instalacao ou execucao local funcional;
- registro de necessidade;
- acompanhamento no Radar de Necessidades;
- atualizacao de andamento;
- resolucao documentada;
- auditoria minima de acoes sensiveis;
- saida da conta em computador compartilhado;
- transferencia de direcao/responsavel principal;
- historico preservado;
- exportacao CSV de seguranca;
- importacao/restauracao dos CSVs exportados;
- testes automatizados dos fluxos criticos;
- documentacao minima para usuario e contribuidor.
