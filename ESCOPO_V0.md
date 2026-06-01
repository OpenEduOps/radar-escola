# Escopo da V0

Este documento define a linha de corte da V0 do primeiro produto, usando
`Radar Escola` como nome publico adotado por enquanto.

O fluxo ponta a ponta esta descrito em `FLUXO_E2E_V0.md`.

A V0 deve entregar uma experiencia util, instalavel/local e pequena o suficiente
para ser implementada, testada e validada sem transformar a primeira versao em um
produto amplo demais.

Estado apos a tag `v0.0.1`: ja existe uma release tecnica instalavel do
scaffold. Ela nao fecha este escopo da V0; ela apenas confirma que a casca
desktop, o instalador, o checksum e o smoke tecnico funcionam.

## Objetivo da V0

Permitir que uma escola registre necessidades operacionais, acompanhe o que esta
em andamento, mantenha historico basico e exporte copias CSV de seguranca dos
dados.

Frase-guia:

> Instalar, abrir, registrar uma necessidade, acompanhar andamento, marcar como
> resolvido e preservar historico.

## Linha de corte

A V0 termina quando o Radar Escola permite:

- configurar o primeiro acesso local;
- cadastrar pessoas/usuarios locais com cargo ou funcao;
- entrar com usuario e senha;
- registrar uma necessidade;
- listar necessidades no Radar de Necessidades;
- visualizar detalhe de uma necessidade;
- atualizar andamento;
- marcar envolvidos a partir de pessoas/usuarios cadastrados;
- registrar resolucao;
- cancelar necessidade cadastrada por engano;
- consultar historico de necessidades resolvidas;
- cadastrar equipamento basico;
- vincular uma necessidade a um equipamento;
- exportar necessidades em CSV;
- exportar equipamentos em CSV;
- importar dados exportados em CSV para restauracao;
- registrar auditoria minima de acoes sensiveis;
- permitir sair da conta em computador compartilhado;
- bloquear sessao apos 30 minutos de inatividade;
- transferir responsabilidade principal da escola;
- executar testes automatizados dos fluxos criticos.

Qualquer funcionalidade fora dessa lista deve ser considerada fora da V0, salvo
decisao explicita posterior.

## Entra na V0

### Primeiro uso

- Nome da escola.
- Nome da direcao ou pessoa responsavel principal.
- Usuario de acesso.
- Senha.
- Alerta sobre a importancia de nao perder usuario, senha e salvaguarda.
- Geracao de token simples de recuperacao.
- Cadastro de frase de recuperacao e resposta.

### Acesso

- Login com usuario e senha.
- Recuperacao local de acesso com usuario ou nome e salvaguarda local, usando
  token simples ou frase de recuperacao.
- Senhas devem ser armazenadas no banco apenas como hash, nunca em texto claro.
- Sem e-mail pessoal para recuperacao.
- Sem dependencia de internet.

### Pessoas e usuarios

- A V0 deve ter cadastro local de pessoas/usuarios desde o inicio.
- Campos minimos:
  - nome;
  - usuario;
  - cargo ou funcao;
  - senha inicial;
  - status de primeiro acesso.
- Cargo ou funcao deve usar lista simples cadastravel localmente.
- Se o cargo ou funcao ainda nao existir durante o cadastro de pessoa, a V0 deve
  permitir criar essa opcao no proprio fluxo e continuar o cadastro.
- Na V0, pessoas cadastradas podem ver necessidades, historico, envolvidos e
  andamentos.
- Acoes sensiveis devem ficar restritas a direcao ou pessoa responsavel
  principal, incluindo exportacao de seguranca e gestao de acessos/senhas.
- A direcao ou pessoa responsavel principal pode definir ate duas pessoas como
  apoio de gestao, preferencialmente coordenadores ou funcoes imediatamente
  abaixo da direcao.
- Apoio de gestao deve ser uma delegacao unica na V0.
- Essa delegacao permite cadastrar pessoas/usuarios, cancelar/corrigir
  necessidades e marcar necessidades como resolvidas.
- Essa delegacao nao deve liberar exportacao/restauracao de seguranca,
  recuperacao administrativa da propria direcao nem transferencia de direcao.
- Pessoas cadastradas podem ser marcadas como envolvidas em necessidades.
- A senha inicial padrao para pessoas cadastradas pode ser `123456`, mas apenas
  para primeiro acesso.
- No primeiro login da pessoa cadastrada, a troca de senha deve ser obrigatoria
  antes de usar o sistema.
- Ao trocar a senha inicial, a pessoa deve definir sua propria salvaguarda local
  de recuperacao.
- A salvaguarda individual deve permitir recuperacao por token simples ou por
  frase de recuperacao.
- O token de recuperacao deve ser exibido no momento de configuracao da
  salvaguarda e nao deve poder ser regenerado.
- O primeiro acesso da pessoa cadastrada deve ser privado. A direcao ou pessoa
  responsavel principal nao deve ver a nova senha, o token, a frase de
  recuperacao nem a resposta.
- A interface deve explicitar que a pessoa deve fazer esse procedimento
  preferencialmente sem a presenca da direcao ou com distancia segura da tela.
- Se uma pessoa cadastrada perder senha e salvaguarda, a direcao ou pessoa
  responsavel principal pode redefinir a senha dessa pessoa para `123456`.
- Apos redefinicao administrativa, o proximo login deve obrigar nova troca de
  senha. Essa redefinicao nao deve gerar novo token.

### Necessidades

- Criar necessidade.
- Campos minimos:
  - titulo;
  - descricao;
  - local;
  - prioridade simples;
  - status;
  - envolvidos;
  - equipamento vinculado opcional.
- Listar necessidades em andamento.
- Listar necessidades paradas.
- Listar resolvidas recentemente.
- Visualizar detalhe.
- Registrar atualizacao.
- Alterar status.
- Registrar resolucao.
- Marcar como resolvido deve ser permitido apenas para direcao ou pessoas
  definidas como apoio de gestao.
- Necessidades cadastradas por engano podem ser editadas ou canceladas.
- Exclusao definitiva de necessidade deve ser evitada na V0 ou ficar restrita a
  direcao/responsavel principal, preservando historico quando possivel.

### Envolvidos

- Envolvidos devem ser pessoas/usuarios cadastrados.
- Cada envolvido deve poder consultar o aplicativo no computador instalado, se
  tiver usuario e senha.
- Sem notificacao automatica.

### Equipamentos

- Cadastro basico de equipamento:
  - nome;
  - local;
  - patrimonio ou identificacao;
  - estado atual;
  - observacoes.
- Vinculo entre necessidade e equipamento.
- Listagem simples de equipamentos.

### Historico

- Necessidades resolvidas devem continuar consultaveis.
- Historico deve mostrar atualizacoes relevantes e resolucao.
- Historico deve registrar cancelamento e alteracoes relevantes.
- Busca simples pode existir se for barata, mas nao deve bloquear a V0.

### Auditoria minima

- A V0 deve registrar "quem fez o que e quando" para acoes sensiveis.
- Eventos minimos:
  - cadastro de usuario;
  - redefinicao administrativa de senha;
  - definicao de apoio de gestao;
  - exportacao/importacao de seguranca;
  - transferencia de direcao/responsavel principal;
  - marcacao de necessidade como resolvida;
  - cancelamento ou exclusao de necessidade.
- A auditoria deve ser simples e local, sem dashboard obrigatorio na V0.
- A consulta da auditoria deve ser exclusiva da direcao/responsavel principal.
- Apoio de gestao nao deve consultar auditoria.

### Computador compartilhado

- A V0 deve permitir sair da conta de forma visivel.
- A interface deve orientar o usuario a sair da conta ao terminar o uso em
  computador compartilhado.
- A sessao deve bloquear apos 30 minutos de inatividade.
- Ao desbloquear, o sistema deve pedir a senha do usuario atual e preservar o
  contexto quando possivel.
- O produto nao deve assumir que o computador e pessoal.

### Troca de direcao

- A V0 deve permitir transferir a responsabilidade principal da escola.
- A transferencia deve ser tratada como acao sensivel.
- A transferencia deve exigir confirmacao clara e registrar auditoria minima.

### Exportacao de seguranca

- Exportacao manual em CSV.
- A exportacao de seguranca deve ser responsabilidade do perfil direcao ou da
  pessoa responsavel principal.
- Exportacao de necessidades.
- Exportacao de equipamentos.
- Orientacao explicita para salvar a exportacao em pendrive, pasta de rede ou
  outra maquina.
- O CSV deve servir como copia de seguranca e tambem como formato simples de
  leitura fora do aplicativo.
- A V0 deve permitir importar de volta os dados exportados, para restaurar em
  caso de perda, troca ou problema no computador.
- A restauracao por CSV deve sempre substituir os dados locais atuais. A V0 nao
  deve tentar mesclar dados importados com dados existentes.
- Antes de restaurar, a interface deve exibir mensagem explicita de que os dados
  atuais serao substituidos.
- A exportacao precisa preservar dados suficientes para restauracao coerente,
  incluindo vinculos entre necessidades, equipamentos, pessoas, envolvidos,
  andamentos e historico.
- A exportacao restauravel deve incluir usuarios, cargos/funcoes, apoio de
  gestao e hashes de senha necessarios para restaurar os acessos.
- A exportacao nunca deve incluir senhas em texto claro.

### Testes

- Testes unitarios para regras de necessidade e validacoes.
- Testes de persistencia para SQLite.
- Testes de exportacao e importacao/restauracao CSV.
- Testes de auditoria minima para acoes sensiveis.
- Testes de logout/saida da conta.
- Testes de bloqueio de sessao por inatividade.
- Testes de interface dos fluxos principais.
- Testes de integracao desktop quando o empacotamento Tauri estiver disponivel.

## Fica fora da V0

- Nomes, e-mails, documentos, matriculas ou dados pessoais de estudantes.
- E-mail automatico.
- WhatsApp.
- Push notification.
- Mensageria externa.
- Recuperacao por e-mail pessoal.
- Perfis e permissoes complexas.
- Multiunidade.
- Sincronizacao entre computadores.
- Servidor em rede local como requisito.
- Aplicativo mobile.
- Dashboard analitico.
- Graficos.
- Relatorios avancados.
- Importacao em massa que nao seja restauracao dos CSVs exportados pelo proprio
  Radar Escola.
- Anexos.
- Fotos.
- Comentarios ricos.
- Editor formatado.
- SLA.
- Calendario.
- Reserva de salas.
- Controle completo de patrimonio.
- Base de conhecimento.
- Telemetria.
- Nuvem.
- IA.

## Pode aparecer apenas como estrutura futura

Algumas decisoes podem ser preparadas de forma leve, sem virar funcionalidade da
V0:

- organizacao do codigo por dominio;
- campos que facilitem evolucao para rede local;
- separacao entre interface e persistencia;
- migracoes de banco;
- testes que reduzam risco de mudanca futura;
- nomenclatura que permita crescimento para EduInventory, EduLab, EduRooms e
  EduContinuity.

Preparar nao significa implementar a funcionalidade agora.

## Criterios de aceite da V0

A V0 pode ser considerada entregue quando:

- roda localmente em ambiente de desenvolvimento;
- possui caminho claro para empacotamento desktop;
- permite primeiro uso local;
- permite cadastrar pessoa/usuario local com cargo ou funcao;
- obriga troca da senha inicial padrao no primeiro acesso da pessoa cadastrada;
- permite login;
- permite sair da conta;
- bloqueia sessao apos 30 minutos de inatividade;
- cria necessidade;
- mostra a necessidade no Radar de Necessidades;
- atualiza andamento;
- registra resolucao;
- restringe marcacao como resolvido a direcao ou apoio de gestao;
- permite cancelar necessidade cadastrada por engano;
- preserva historico;
- registra auditoria minima de acoes sensiveis;
- cadastra equipamento basico;
- vincula equipamento a necessidade;
- exporta necessidades em CSV;
- exporta equipamentos em CSV;
- importa de volta dados exportados em CSV;
- permite transferencia de direcao/responsavel principal;
- possui testes automatizados dos fluxos criticos;
- documenta como executar, testar e validar a V0.

## Regra de protecao de escopo

Se uma nova ideia nao ajudar diretamente a completar o fluxo:

> registrar -> acompanhar -> marcar envolvidos -> atualizar -> marcar como
> resolvido -> preservar historico

ela deve ficar fora da V0.

Ideias boas podem virar backlog futuro, mas nao devem entrar no primeiro corte
sem uma razao forte de utilidade imediata.
