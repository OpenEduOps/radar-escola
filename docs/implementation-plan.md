# Plano de Implementacao

Este plano adota o `template-pre-projeto` para transformar a documentacao atual
do Radar Escola em fases pequenas, revisaveis e testaveis.

Ele ainda nao detalha todas as regras internas. O detalhamento fino de
requisitos deve acontecer depois desta reorganizacao documental.

## Baseline Atual

Ja existe:

- documentacao de contexto, escopo, requisitos, guardrails, fluxo E2E e visao
  prototipal;
- scaffold minimo Tauri + React + TypeScript;
- tela inicial tecnica do Radar Escola;
- playground CRUD de referencia acionado por menu nativo;
- `package-lock.json`;
- CI com qualidade documental, higiene, `npm ci`, typecheck e build frontend;
- workflow de release desktop gerando instalador tecnico do scaffold;
- documentacao de CI/CD OSS;
- documento de projeto para dockerizacao do ambiente tecnico;
- `.dockerignore` e `Dockerfile.dev`;
- imagem Docker dev Node validada localmente e na CI.

Ainda nao existe:

- banco SQLite;
- autenticacao local;
- modelo de dominio implementado;
- persistencia;
- testes automatizados de regra de negocio;
- build Tauri validado localmente;
- release versionada publicada por tag;
- fluxo funcional de MVP.

## Principios de Implementacao

- Incrementos pequenos.
- Cada fase deve ter criterio de aceite verificavel.
- Regra de negocio deve nascer junto com teste.
- Documentacao deve acompanhar mudanca de comportamento.
- UX final da escola deve prevalecer sobre preferencia tecnica.
- O scaffold nao deve fingir funcionalidade ainda nao implementada.
- A V0 deve preservar simplicidade antes de crescer permissoes, notificacoes ou
  integracoes.
- Docker pode apoiar desenvolvimento e QA tecnico, mas nao deve entrar como
  requisito da pessoa usuaria final nem substituir o release Windows.

## Fase 1: Scaffold Executavel

Objetivo: manter o menor app desktop possivel, sem regra falsa.

Estado: parcial/implementado.

Criterios de aceite:

- `npm ci` passa;
- `npm run typecheck` passa;
- `npm run build` passa;
- interface React renderiza tela inicial honesta;
- Tauri possui configuracao minima;
- instalador tecnico do scaffold e gerado pelo workflow `Desktop Release`;
- app instalado abre sem crash imediato;
- CI valida o scaffold;
- docs deixam claro que ainda nao e MVP funcional.

## Fase 2: Fundacao de Persistencia Local

Objetivo: criar a base SQLite local e migracoes iniciais.

Criterios de aceite:

- banco local criado em local previsivel;
- migracoes rodam de forma idempotente;
- schema inicial cobre escola, usuarios, cargos, necessidades, envolvidos,
  equipamentos, historico e auditoria;
- testes de persistencia passam;
- falhas de banco geram erro claro.

## Fase 3: Primeiro Uso e Direcao

Objetivo: permitir configurar a escola e a direcao/responsavel principal.

Criterios de aceite:

- primeira abertura detecta app nao configurado;
- escola e direcao sao cadastradas;
- senha e armazenada como hash;
- token e frase de recuperacao sao configurados;
- alerta sobre salvaguarda aparece;
- testes cobrem configuracao inicial e dados obrigatorios.

## Fase 4: Acesso, Primeiro Login e Sessao

Objetivo: implementar login local, troca obrigatoria de senha inicial e bloqueio
por inatividade.

Criterios de aceite:

- login com usuario e senha funciona;
- senha inicial `123456` obriga troca antes do uso;
- salvaguarda individual e obrigatoria;
- logout visivel existe;
- sessao bloqueia apos 30 minutos de inatividade;
- desbloqueio pede senha do usuario atual;
- testes cobrem sucesso, erro e bloqueio.

## Fase 5: Pessoas, Cargos e Apoio de Gestao

Objetivo: permitir cadastro de pessoas/usuarios e delegacao simples.

Criterios de aceite:

- cargos/funcoes sao cadastraveis;
- cargo pode ser criado durante cadastro de pessoa;
- direcao cadastra pessoas com senha temporaria;
- ate duas pessoas podem ser apoio de gestao;
- apoio de gestao nao recebe permissoes exclusivas da direcao;
- testes cobrem limite de duas pessoas e reset de senha.

## Fase 6: Necessidades e Radar

Objetivo: registrar necessidades e exibi-las no Radar de Necessidades.

Criterios de aceite:

- necessidade possui titulo, descricao, local, prioridade e status;
- lista mostra necessidades em andamento, paradas e resolvidas recentemente;
- detalhe abre com dados principais;
- estados vazios sao claros;
- testes cobrem criacao, listagem e validacoes.

## Fase 7: Envolvidos, Plano e Andamento

Objetivo: acompanhar a necessidade como acao conjunta.

Criterios de aceite:

- envolvidos sao selecionados a partir de pessoas cadastradas;
- atualizacoes de andamento sao registradas;
- plano de acao simples pode ser descrito;
- historico da necessidade preserva eventos importantes;
- testes cobrem vinculo de envolvidos e andamento.

## Fase 8: Resolucao, Cancelamento e Correcoes

Objetivo: encerrar necessidades com controle da gestao.

Criterios de aceite:

- usuario comum pode solicitar fechamento;
- apenas direcao ou apoio de gestao marca como resolvido;
- direcao ou apoio de gestao pode cancelar/corrigir necessidade;
- exclusao definitiva e evitada ou restrita;
- auditoria registra acoes sensiveis;
- testes cobrem permissao de resolucao e cancelamento.

## Fase 9: Equipamentos

Objetivo: permitir cadastro basico de equipamentos e vinculo com necessidades.

Criterios de aceite:

- equipamento possui nome, local, identificacao, estado e observacoes;
- necessidade pode referenciar equipamento;
- listagem simples existe;
- testes cobrem cadastro e vinculo.

## Fase 10: Historico e Auditoria

Objetivo: preservar memoria operacional e registrar acoes sensiveis.

Criterios de aceite:

- necessidades resolvidas e canceladas continuam consultaveis;
- eventos relevantes aparecem no historico;
- auditoria registra quem fez, o que fez e quando fez;
- apenas direcao consulta auditoria;
- testes cobrem acoes sensiveis minimas.

## Fase 11: Exportacao e Restauracao

Objetivo: permitir copia restauravel local em CSV.

Criterios de aceite:

- direcao exporta dados de seguranca;
- CSV inclui dados suficientes para restaurar o app;
- hashes de senha sao exportados, nunca senhas em texto claro;
- restauracao substitui dados locais atuais;
- confirmacao forte aparece antes da restauracao;
- testes cobrem exportacao, restauracao e ausencia de senha clara.

## Fase 12: Release Desktop e Smoke Test

Objetivo: gerar instalador Windows e validar abertura minima.

Criterios de aceite:

- workflow de release gera instalador Windows;
- checksum SHA-256 e gerado;
- smoke test valida existencia do artefato;
- validacao local instala e abre o artefato gerado pelo workflow;
- menu nativo inicia o playground no executavel instalado;
- smoke test futuro automatiza instalacao e abertura no runner Windows;
- release por tag `v*` publica artefatos reais.

## Fase 13: Teste End-to-End da V0

Objetivo: provar o fluxo completo do MVP.

Criterios de aceite:

- ambiente limpo configura escola;
- direcao cadastra pessoa;
- pessoa faz primeiro acesso;
- necessidade e criada;
- envolvidos sao marcados;
- andamento e registrado;
- necessidade e marcada como resolvida por gestao;
- historico e consultado;
- exportacao/restauracao preserva dados;
- testes automatizados e smoke manual documentado passam.

## Iniciativa Transversal: Dockerizacao Do Ambiente

Objetivo: reduzir divergencia tecnica entre ambientes de desenvolvimento sem
alterar a experiencia final desktop local Windows.

Estado: implementado para validacao Node basica.

Criterios de aceite iniciais:

- `.dockerignore` existe;
- `Dockerfile.dev` usa Node 24 com tag explicita;
- validacoes Node basicas rodam em container;
- tamanho da imagem e tempo de build sao registrados;
- guia operacional documenta comandos reais;
- fluxo local sem Docker continua funcionando;
- `Desktop Release` continua sendo o caminho do instalador Windows.
- validacao Docker em CI existe apenas para a imagem dev Node basica;
- Playwright/E2E, SQLite e build Tauri/Windows continuam fora do Docker nesta
  fase.
