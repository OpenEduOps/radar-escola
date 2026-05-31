# Requisitos da V0

Este documento consolida uma primeira versao objetiva dos requisitos da V0 do
Radar Escola.

Ele deve ser lido junto com:

- `CONTEXTO_INICIAL.md`;
- `ESCOPO_V0.md`;
- `FLUXO_E2E_V0.md`;
- `GUARDRAILS_V0.md`;
- `VISAO_PROTOTIPAL_V0.md`.

## Produto

- Nome publico candidato atual: `Radar Escola`.
- Tela principal/conceito operacional: `Radar de Necessidades`.
- Frase de valor: "Veja o que sua escola precisa resolver."
- Principio: "Acao conjunta para cuidar das necessidades da escola."
- Plataforma prioritaria: aplicativo desktop local para Windows.
- Stack definida: Tauri + React + TypeScript + SQLite.

## Requisitos funcionais

### Primeiro uso

- RF-001: Permitir configurar a escola no primeiro uso.
- RF-002: Permitir cadastrar a direcao/responsavel principal.
- RF-003: Gerar token simples de recuperacao para a direcao.
- RF-004: Permitir definir frase de recuperacao e resposta.
- RF-005: Exibir alerta claro sobre risco de perda de usuario, senha e
  salvaguarda.

### Acesso e sessao

- RF-006: Permitir login com usuario e senha.
- RF-007: Armazenar senhas apenas como hash, nunca em texto claro.
- RF-008: Permitir sair da conta por acao visivel.
- RF-009: Bloquear a sessao apos 30 minutos de inatividade.
- RF-010: Ao desbloquear, pedir senha do usuario atual e preservar o contexto
  quando possivel.
- RF-011: Orientar o usuario a sair da conta em computador compartilhado.

### Pessoas, cargos e apoio de gestao

- RF-012: Permitir cadastrar pessoas/usuarios locais.
- RF-013: Cada pessoa deve ter nome, usuario, cargo ou funcao, senha inicial e
  status de primeiro acesso.
- RF-014: Permitir cadastrar cargo ou funcao durante o cadastro de pessoa.
- RF-015: Usar senha inicial `123456` apenas como senha temporaria de primeiro
  acesso.
- RF-016: Obrigar troca de senha no primeiro login da pessoa cadastrada.
- RF-017: Obrigar configuracao de salvaguarda local no primeiro login.
- RF-018: Tratar o primeiro acesso da pessoa cadastrada como procedimento
  privado, sem visualizacao da direcao.
- RF-019: Nao regenerar token de recuperacao.
- RF-020: Permitir redefinicao administrativa de senha de usuario comum para
  `123456`.
- RF-021: Permitir que a direcao defina ate duas pessoas como apoio de gestao.
- RF-022: Apoio de gestao pode cadastrar usuarios, cancelar/corrigir
  necessidades e marcar necessidades como resolvidas.
- RF-023: Apoio de gestao nao pode exportar/restaurar seguranca, transferir
  direcao, recuperar administrativamente a propria direcao nem consultar
  auditoria.

### Necessidades

- RF-024: Permitir registrar necessidade.
- RF-025: Campos minimos da necessidade: titulo, descricao, local, prioridade,
  status, envolvidos e equipamento vinculado opcional.
- RF-026: Permitir listar necessidades em andamento, paradas e resolvidas
  recentemente.
- RF-027: Permitir visualizar detalhe da necessidade.
- RF-028: Permitir registrar atualizacoes de andamento.
- RF-029: Permitir marcar envolvidos a partir de pessoas cadastradas.
- RF-030: Permitir criar plano de acao simples.
- RF-031: Permitir solicitar fechamento quando usuario comum entender que a
  necessidade foi resolvida tecnicamente.
- RF-032: Permitir marcar como resolvido apenas para direcao ou apoio de gestao.
- RF-033: Permitir corrigir necessidade cadastrada com erro.
- RF-034: Permitir cancelar necessidade cadastrada por engano.
- RF-035: Evitar exclusao definitiva; se existir, restringir a direcao e
  preservar historico quando possivel.

### Equipamentos

- RF-036: Permitir cadastrar equipamento basico.
- RF-037: Campos minimos de equipamento: nome, local, patrimonio ou
  identificacao, estado atual e observacoes.
- RF-038: Permitir vincular necessidade a equipamento.
- RF-039: Permitir listar equipamentos.

### Historico e auditoria

- RF-040: Preservar historico de necessidades resolvidas e canceladas.
- RF-041: Registrar atualizacoes relevantes no historico da necessidade.
- RF-042: Registrar auditoria minima para acoes sensiveis.
- RF-043: Auditoria deve responder: quem fez, o que fez e quando fez.
- RF-044: Consulta da auditoria deve ser exclusiva da direcao/responsavel
  principal.
- RF-045: Apoio de gestao nao deve consultar auditoria.

### Exportacao e restauracao

- RF-046: Permitir exportar dados de seguranca em CSV.
- RF-047: Exportacao/restauracao de seguranca deve ser acao exclusiva da
  direcao/responsavel principal.
- RF-048: Orientar salvar exportacao em pendrive, pasta de rede ou outra
  maquina.
- RF-049: Exportacao restauravel deve incluir necessidades, equipamentos,
  pessoas, usuarios, cargos/funcoes, apoio de gestao, envolvidos, andamentos,
  historico e hashes de senha.
- RF-050: Exportacao nunca deve incluir senhas em texto claro.
- RF-051: Permitir importar de volta CSVs exportados pelo proprio Radar Escola.
- RF-052: Restauracao sempre substitui os dados locais atuais.
- RF-053: Nao deve existir mescla de dados na V0.
- RF-054: Antes de restaurar, exibir confirmacao forte informando que os dados
  atuais serao substituidos.

### Troca de direcao

- RF-055: Permitir transferir a responsabilidade principal da escola.
- RF-056: Transferencia de direcao deve ser acao sensivel com confirmacao clara.
- RF-057: Transferencia de direcao deve registrar auditoria minima.

## Requisitos nao funcionais

- RNF-001: O aplicativo deve funcionar localmente, sem internet obrigatoria.
- RNF-002: A experiencia deve ser Windows-first.
- RNF-003: O usuario final nao deve precisar entender Tauri, Rust, React,
  TypeScript, SQLite, Docker, servidor ou banco de dados.
- RNF-004: A interface deve usar Portugues Brasileiro.
- RNF-005: A linguagem deve evitar termos como ticket, chamado, service desk,
  incidente, workflow e dashboard na experiencia principal.
- RNF-006: Dados devem ficar no computador da instituicao por padrao.
- RNF-007: Nao deve haver telemetria por padrao.
- RNF-008: Nao coletar nomes, documentos, matriculas ou dados pessoais de
  estudantes na V0.
- RNF-009: Fluxos importantes devem funcionar com teclado.
- RNF-010: Estados vazios, erros e confirmacoes devem ser claros.

## Fora da V0

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
- SLA.
- Calendario.
- Reserva de salas.
- Controle completo de patrimonio.
- Base de conhecimento.
- Telemetria.
- Nuvem.
- IA.

## Criterios de aceite

- CA-001: O fluxo narrativo da V0 funciona de ponta a ponta.
- CA-002: A escola consegue registrar, acompanhar, envolver pessoas, atualizar,
  fechar e consultar historico de uma necessidade.
- CA-003: Pessoas cadastradas conseguem acessar com usuario e senha.
- CA-004: Primeiro acesso com senha `123456` obriga troca de senha e
  salvaguarda.
- CA-005: Apoio de gestao respeita limite de ate duas pessoas alem da direcao.
- CA-006: Usuario comum nao consegue marcar como resolvido.
- CA-007: Direcao ou apoio de gestao consegue marcar como resolvido.
- CA-008: Direcao consegue exportar e restaurar dados por CSV.
- CA-009: Restauracao substitui dados atuais apos confirmacao forte.
- CA-010: Exportacao restauravel nao contem senhas em texto claro.
- CA-011: Auditoria registra acoes sensiveis.
- CA-012: Apenas direcao consulta auditoria.
- CA-013: Sessao bloqueia apos 30 minutos de inatividade.
- CA-014: Testes automatizados cobrem regras criticas da V0.
