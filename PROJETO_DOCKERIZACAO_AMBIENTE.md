# Projeto De Dockerizacao Do Ambiente

Este documento registra a decisao de projeto para dockerizar o ambiente tecnico
do Radar Escola.

Ele nao e um guia operacional de desenvolvimento. O guia pratico, com comandos
e instrucoes de uso quando os artefatos existirem, permanece em
[`docs/development-docker.md`](docs/development-docker.md).

## Natureza Do Documento

Este e um documento de projeto.

Ele existe para responder:

- por que Docker esta sendo considerado;
- qual problema de projeto ele resolve;
- quais limites protegem a experiencia final Windows-first;
- quais fases fazem sentido;
- quais criterios permitem aprovar, pausar ou reverter a iniciativa;
- quais tarefas podem virar issues depois de revisao.

Este documento nao deve substituir:

- README;
- guia de contribuicao;
- guia operacional de Docker;
- documentacao de CI;
- documentacao de release desktop.

## Documentos Relacionados

- [`docs/development-docker.md`](docs/development-docker.md): guia operacional
  futuro para comandos Docker reais.
- [`docs/ci.md`](docs/ci.md): CI atual e decisao de nao depender de Docker por
  padrao.
- [`docs/oss-guardrails.md`](docs/oss-guardrails.md): limites publicos de
  contribuicao e narrativa.
- [`docs/desktop-release.md`](docs/desktop-release.md): fonte do caminho final
  de instalador Windows.

Este documento e a fonte de verdade da decisao de projeto sobre dockerizacao. O
guia operacional deve obedecer a estes limites.

## Decisao De Projeto

Docker deve ser tratado como ferramenta de apoio ao projeto, nao como parte da
experiencia final da escola.

A narrativa do produto permanece:

```text
Radar Escola = aplicativo desktop local para Windows
```

A narrativa de engenharia fica limitada a:

```text
Docker = ambiente reproduzivel para desenvolvimento, QA tecnico e contribuicao OSS
```

Essa separacao e obrigatoria. O produto final continua sendo instalado e usado
como aplicativo desktop local.

## Problema A Resolver

O Radar Escola quer receber contribuicoes OSS e formar pessoas desenvolvedoras,
mantendo um projeto tecnicamente confiavel.

Sem uma camada de ambiente reproduzivel, podem surgir problemas comuns:

- maquinas locais com versoes diferentes de Node.js;
- diferencas entre Windows, WSL2, Linux e runners temporarios;
- dificuldade para uma pessoa iniciante executar validacoes basicas;
- maior chance de "funciona na minha maquina";
- mais custo para QA tecnico repetir uma validacao;
- maior dependencia de configuracao manual do host.

Docker entra como resposta a esse problema, desde que nao confunda a experiencia
final da escola.

## Objetivos De Projeto

A dockerizacao deve ajudar o projeto a:

- reduzir divergencia entre ambientes tecnicos;
- simplificar validacoes locais de frontend, regras puras e scaffold;
- apoiar QA tecnico e contribuicoes OSS;
- registrar custos reais de tempo, imagem e disco;
- manter o caminho local sem Docker funcionando;
- preservar release e instalacao Windows como validacao final do produto.

## Nao Objetivos

Docker nao deve:

- ser usado pela escola;
- substituir o instalador Windows;
- virar requisito para uso final do Radar Escola;
- virar requisito obrigatorio para toda contribuicao;
- esconder a necessidade de build nativo Windows para Tauri;
- publicar container como artefato do produto;
- criar narrativa de app web, PWA, site ou sistema em navegador;
- expor banco local, servidor local ou container como parte da UX final;
- substituir a CI;
- substituir smoke test do instalador Windows.

## Marco Zero

O projeto ja possui:

- scaffold minimo Tauri + React + TypeScript;
- playground CRUD de referencia;
- `package-lock.json`;
- testes unitarios do playground;
- teste E2E Playwright do playground;
- CI com instalacao, typecheck, testes, build frontend e E2E;
- workflow `Desktop Release` para instalador Windows tecnico;
- `.dockerignore`;
- `Dockerfile.dev`;
- imagem dev Node validada localmente;
- validacao Docker pequena na CI;
- guia operacional em
  [`docs/development-docker.md`](docs/development-docker.md).

O projeto ainda nao possui:

- `docker-compose.yml`;
- Playwright/E2E em Docker;
- build Tauri/Windows em Docker;
- persistencia SQLite em Docker;
- imagem publicada em registry.

Portanto, a documentacao operacional ja pode usar comandos reais para a imagem
dev Node, mas deve continuar evitando comandos para E2E, SQLite, Tauri ou
publicacao de imagem que ainda nao foram implementados.

## Publicos Impactados

### Pessoas Mantenedoras

Precisam avaliar se Docker reduz atrito real sem aumentar manutencao demais.

### Pessoas Desenvolvedoras E Contribuidoras

Podem ganhar um caminho mais previsivel para validar mudancas, mas nao devem ser
obrigadas a usar Docker para toda PR simples.

### QA Tecnico

Pode usar Docker como camada adicional de reproducibilidade, especialmente para
validacoes do scaffold e de fluxos automatizados.

### Escola Usuaria Final

Nao deve ser impactada. A escola deve continuar enxergando apenas instalar,
abrir, entrar, registrar, acompanhar e resolver necessidades no aplicativo
desktop local.

## Principios De Governanca

- Docker e ferramenta de engenharia, nao produto.
- O menor ambiente util vem antes de uma solucao completa.
- A dockerizacao deve reduzir atrito, nao adicionar ritual.
- O caminho local sem Docker deve continuar existindo.
- A imagem deve ser simples, previsivel e barata de manter.
- Tags de imagem devem ser explicitas o suficiente para evitar `latest` como
  dependencia invisivel.
- O build Windows do instalador continua no GitHub Actions Windows runner ou em
  maquina Windows com toolchain nativa.
- Nenhum secret, cache pesado ou artefato gerado deve ser versionado.
- Dependencias instaladas no container nao devem poluir a maquina local.
- A decisao de projeto deve considerar espaco em disco como restricao real de
  uso.
- A documentacao publica deve continuar centrada em desktop local Windows.
- Docker deve ser reversivel: se a experiencia piorar, o projeto deve conseguir
  voltar ao fluxo local sem perda de caminho tecnico.
- Imagens, containers e volumes criados pelo projeto devem ter nomes associados
  ao Radar Escola para facilitar limpeza segura.
- A primeira fase nao deve publicar imagem em GHCR, Docker Hub ou qualquer
  registry externo.

## Escopo Por Camadas

### Camada 1: Validacao Node Basica

Objetivo de projeto: validar que o scaffold frontend, regras puras e build Vite
podem ser reproduzidos em ambiente isolado.

Deve cobrir:

- Node.js 24;
- npm;
- `package-lock.json` como fonte de instalacao reproduzivel;
- instalacao de dependencias;
- testes unitarios;
- typecheck;
- build frontend.

Nao deve cobrir na primeira entrega:

- build Tauri completo;
- instalador Windows;
- banco SQLite real da V0;
- Playwright com navegador.

### Camada 2: Validacao E2E Opcional

Objetivo de projeto: avaliar se Playwright em Docker reduz divergencia real ou
se apenas aumenta peso.

Deve ser aprovada apenas se:

- o custo de imagem for aceitavel;
- o navegador necessario estiver bem definido;
- a estrategia nao duplicar complexidade da CI;
- a documentacao deixar claro que isso nao valida o instalador Windows.

### Camada 3: Persistencia SQLite Futura

Objetivo de projeto: preparar caminho para testes de persistencia quando a V0
funcional tiver banco SQLite implementado.

Deve cobrir futuramente:

- banco temporario de teste;
- migracoes;
- testes de repositorio;
- exportacao e restauracao em diretorios controlados;
- limpeza deterministica.

Nao deve cobrir:

- banco real da escola;
- dados pessoais reais;
- volume persistente tratado como ambiente de producao.

### Camada 4: Limite Desktop/Tauri

Objetivo de projeto: deixar explicito que Docker pode apoiar validacoes
tecnicas, mas nao substitui o build desktop Windows.

Docker pode apoiar futuramente:

- checks auxiliares Rust independentes de Windows, se fizer sentido;
- organizacao de dependencias tecnicas;
- validacoes de camadas que nao dependem de MSVC.

Docker nao substitui:

- Visual Studio Build Tools/MSVC;
- runner Windows;
- build real do instalador `.exe`;
- smoke test do app instalado no Windows.

## Entregaveis Planejados

### Entregaveis Da Primeira Fase

- `.dockerignore`;
- `Dockerfile.dev`;
- documentacao operacional minima em `docs/development-docker.md`;
- validacao de instalacao, testes, typecheck e build no container;
- registro de tamanho aproximado da imagem;
- registro de tempo aproximado de build;
- orientacao de limpeza limitada aos recursos do projeto.

### Entregaveis Posteriores

- decisao sobre Playwright em Docker;
- estrategia de E2E em container, se aprovada;
- avaliacao de uso ou nao de `docker-compose.yml`;
- integracao futura com testes SQLite;
- decisao sobre uso de Docker em CI;
- atualizacao explicita da matriz de issues se a iniciativa entrar no backlog
  formal.

## Fases Do Projeto

### Fase 0: Documento De Projeto

Status: concluida.

Objetivo:

- alinhar decisao, escopo, riscos e linha de corte;
- separar projeto de guia operacional;
- preservar a narrativa desktop local Windows.

Criterios de aceite:

- documento deixa claro que Docker nao e UX final;
- documento diferencia ambiente dev, E2E, persistencia e release Windows;
- documento define primeira entrega pequena;
- README aponta para o documento correto.

### Fase 1: Docker Basico Para Validacao Node

Objetivo:

- criar o primeiro ambiente Docker util e barato.

Resultado esperado:

- uma pessoa tecnica consegue validar scaffold, testes unitarios, typecheck e
  build frontend em container;
- a experiencia sem Docker continua documentada e funcional.

Criterios de aceite:

- imagem dev e construida com sucesso;
- dependencias sao instaladas de forma reproduzivel;
- testes unitarios passam no container;
- typecheck passa no container;
- build frontend passa no container;
- tamanho aproximado da imagem e tempo de build sao registrados;
- nenhum artefato gerado entra no Git;
- `package-lock.json` nao muda sem mudanca real de dependencia.

Resultado validado:

- imagem local: `radar-escola-dev:local`;
- imagem base: `node:24-bookworm-slim`;
- usuario de execucao: `node`;
- build sem cache observado: 41.36s;
- tamanho observado: 523MB;
- `npm run typecheck`, `npm test` e `npm run build` passaram no container.

### Fase 2: Ergonomia Para Contribuicoes

Objetivo:

- decidir se atalhos, scripts ou compose reduzem atrito real.

Criterios de aceite:

- pessoa contribuidora entende quando usar Docker;
- Docker continua opcional para PR simples;
- documentacao operacional fica curta e verificavel.

### Fase 3: Decisao Sobre E2E Em Docker

Objetivo:

- decidir se Playwright em Docker vale o custo.

Opcoes:

1. usar imagem oficial Playwright;
2. instalar browser na imagem dev;
3. manter E2E fora do Docker.

Criterios de aceite:

- decisao registrada;
- custo de imagem e tempo de execucao medidos;
- compatibilidade de navegador validada;
- relatorios e traces continuam ignorados;
- documentacao explica o limite em relacao ao instalador Windows.

### Fase 4: Persistencia SQLite Em Testes

Objetivo:

- preparar Docker para testes de persistencia quando SQLite existir no MVP.

Criterios de aceite:

- testes nao usam dados reais;
- banco de teste e descartavel;
- exportacao e restauracao nao escrevem em locais inesperados;
- dados sensiveis continuam protegidos.

### Fase 5: Avaliacao De Uso Em CI

Objetivo:

- decidir se Docker deve entrar na CI.

Status: implementada para validacao Node basica.

Direcao atual:

- CI continua validando o scaffold sem depender exclusivamente de Docker;
- Docker entra como job adicional pequeno para validar `Dockerfile.dev`;
- a validacao Docker nao substitui `Desktop Release`;
- a validacao Docker nao publica imagem;
- E2E Playwright continua fora da imagem basica.

### Fase 6: Preservacao Do Release Desktop

Objetivo:

- garantir que Docker nunca vire substituto do caminho final Windows.

Criterios de aceite:

- `Desktop Release` continua usando runner Windows;
- instalador continua validado com Tauri e toolchain nativa;
- smoke test do app instalado continua sendo referencia final;
- documentacao nao sugere container como instalacao para escola.

## Dependencias Entre Fases

- Fase 1 nao depende de `docker-compose.yml`, Playwright em Docker, SQLite ou
  Rust.
- Fase 2 depende da Fase 1 validada.
- Fase 3 depende de medidas reais de custo da Fase 1.
- Fase 4 depende da implementacao real de SQLite no MVP.
- Fase 5 depende de evidencia de que Docker reduz divergencia com a CI.
- Fase 6 nao depende de Docker e nao deve ser bloqueada por Docker.

Essa ordem impede que uma primeira PR de dockerizacao cresca alem do necessario.

## Linha De Corte Da Primeira Entrega

A primeira entrega util de dockerizacao deve conter apenas:

```text
.dockerignore
Dockerfile.dev
documentacao operacional minima
validacao de instalacao, testes, typecheck e build
```

Fica fora da primeira entrega:

- Playwright em Docker, se exigir imagem pesada;
- `docker-compose.yml`, se nao houver ganho imediato;
- build Tauri completo;
- geracao de instalador Windows;
- banco SQLite real;
- fluxo de MVP funcional.

Qualquer proposta que inclua E2E em Docker, compose, CI com Docker e build Tauri
na mesma primeira entrega deve ser quebrada antes de virar issue.

## Guardrails De Projeto

### Narrativa Publica

O projeto deve continuar comunicando:

```text
Radar Escola e aplicativo desktop local para Windows.
```

Docker so deve aparecer como apoio tecnico para desenvolvimento, QA e
contribuicao.

### Seguranca Da Imagem

A dockerizacao deve evitar aumentar a superficie de risco.

Regras:

- usar imagem base oficial ou confiavel;
- evitar tag `latest`;
- registrar a tag escolhida e o motivo;
- nao copiar `.env`, `.npmrc`, tokens ou arquivos locais sensiveis;
- nao montar `docker.sock`;
- nao usar `--privileged`;
- nao usar `--network host` sem justificativa;
- preferir usuario nao-root quando isso nao prejudicar a primeira entrega;
- manter `npm audit` e checks de workflow na CI como controles independentes.

### Nomeacao E Publicacao

Regras:

- usar nome de imagem associado ao projeto, como `radar-escola-dev`;
- nao publicar imagem em GHCR, Docker Hub ou registry externo na primeira fase;
- nao tratar imagem local como artefato de release;
- se volumes ou containers nomeados forem criados, usar prefixo do projeto para
  facilitar limpeza segura.

### Limpeza E Disco

Regras:

- registrar tamanho aproximado da imagem;
- documentar limpeza limitada a recursos do projeto;
- nao recomendar limpeza global destrutiva como caminho padrao;
- nao criar caches persistentes sem beneficio claro;
- manter browsers fora da imagem basica.

## Matriz De Validacao

| Camada | Obrigatoria Na Fase 1 | Papel No Projeto |
| --- | --- | --- |
| Host local sem Docker | Sim | caminho principal continua existindo |
| Docker Node basico | Sim | reduzir divergencia tecnica |
| Docker E2E | Nao | decisao futura sobre custo e browser |
| Docker SQLite | Nao | depende da persistencia real |
| Docker Tauri/Windows | Nao | nao substitui runner Windows |
| GitHub Actions Windows | Sim para release | fonte do instalador desktop |

## Riscos E Mitigacoes

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Confundir Docker com produto | narrativa errada para escolas | reforcar desktop local Windows |
| Imagem pesada | baixa adesao de contribuidores | comecar com Node basico |
| Consumo de disco | atrito em maquinas locais | medir imagem e documentar limpeza segura |
| Duplicacao com CI | manutencao sem ganho | usar Docker apenas se reduzir divergencia |
| Falsa cobertura desktop | container passa e Windows quebra | manter release e smoke Windows |
| Permissoes em Windows/WSL2 | arquivos inconvenientes no host | evitar escrita desnecessaria e documentar limites |
| Atrito para iniciantes | menos contribuicoes | manter Docker opcional |

## Indicadores De Sucesso

A iniciativa sera considerada saudavel quando:

- explicar claramente que e dev-only;
- preservar o fluxo final por instalador Windows;
- rodar validacoes principais em container;
- nao exigir Docker para contribuicoes simples;
- nao aumentar muito custo de disco e tempo;
- documentar tamanho aproximado da imagem;
- documentar limpeza segura;
- nao versionar artefatos gerados;
- nao poluir o host com `node_modules` ou caches sem intencao;
- manter CI verde;
- manter documentacao atualizada.

## Criterios Para Pausar Ou Reverter

Docker deve ser pausado, simplificado ou revertido se:

- a imagem ficar pesada demais para uma primeira contribuicao;
- o fluxo com Docker ficar mais confuso que o fluxo local;
- o consumo de disco crescer sem ganho claro;
- Docker passar a parecer requisito para PR simples;
- a manutencao dos arquivos Docker superar o beneficio de reproducibilidade;
- a documentacao gerar confusao com a UX final desktop Windows.

Se isso acontecer, o projeto deve preservar comandos locais e CI como caminho
principal. A dockerizacao pode permanecer apenas como registro historico ou
voltar para estado experimental.

## Relacao Com A Matriz De Issues V1

A matriz atual do MVP permanece com 85 issues cadastradas e voltadas ao produto.

As issues Docker descritas neste documento foram cadastradas como trilha
transversal de engenharia. Elas nao alteram o total da V1 do MVP e nao devem ser
misturadas com requisitos funcionais do Radar Escola.

A trilha Docker deve permanecer em secao separada, com prefixo `DOCKER`,
dependencias claras e sem bloquear o fluxo normal do MVP. A validacao em CI deve
ficar em uma issue final dependente das issues anteriores de dockerizacao.
Essa issue final e um gate: ela so deve ser iniciada depois que a base Docker
local estiver implementada, medida, documentada e revisada.

## Issues Cadastradas

Esta quebra transforma o projeto Docker em tarefas pequenas, revisaveis e com
escopo controlado.

| Issue | Objetivo | Dependencia |
| --- | --- | --- |
| [DOCKER-001](https://github.com/OpenEduOps/radar-escola/issues/89) | Criar `.dockerignore` com exclusoes seguras | nenhuma |
| [DOCKER-002](https://github.com/OpenEduOps/radar-escola/issues/90) | Criar `Dockerfile.dev` com Node 24 e tag explicita | DOCKER-001 |
| [DOCKER-003](https://github.com/OpenEduOps/radar-escola/issues/91) | Validar build local da imagem dev | DOCKER-002 |
| [DOCKER-004](https://github.com/OpenEduOps/radar-escola/issues/92) | Validar testes, typecheck e build frontend no container | DOCKER-003 |
| [DOCKER-005](https://github.com/OpenEduOps/radar-escola/issues/93) | Medir tempo, tamanho da imagem e impacto em disco | DOCKER-004 |
| [DOCKER-006](https://github.com/OpenEduOps/radar-escola/issues/94) | Documentar comandos reais e limpeza segura | DOCKER-005 |
| [DOCKER-007](https://github.com/OpenEduOps/radar-escola/issues/95) | Decidir estrategia E2E Playwright em Docker | DOCKER-005 |
| [DOCKER-008](https://github.com/OpenEduOps/radar-escola/issues/96) | Validar guardrails da primeira entrega Docker | DOCKER-001 a DOCKER-007 |
| [DOCKER-009](https://github.com/OpenEduOps/radar-escola/issues/97) | Validar trilha Docker em CI apos bases prontas | DOCKER-001 a DOCKER-008 |

Cada issue deve manter a narrativa de que Docker e ambiente tecnico opcional, nao
parte da experiencia final da escola.

A `DOCKER-009` foi usada como gate para levar Docker a CI somente depois da
base local validada. A validacao adicionada e limitada a imagem dev Node e nao
substitui `Desktop Release`.

## Convencoes Executaveis Da Trilha Docker

Para reduzir ambiguidade de implementacao, as issues Docker devem usar estas
convencoes iniciais:

- imagem base candidata: `node:24-bookworm-slim`;
- nome local preferencial da imagem: `radar-escola-dev:local`;
- `WORKDIR` preferencial: `/workspace`;
- validacoes Node em ordem equivalente a CI: `npm run typecheck`, `npm test`,
  `npm run build`;
- Playwright/E2E fora da imagem basica ate decisao explicita;
- limpeza documentada apenas para recursos nomeados do projeto;
- medicao minima: sistema operacional, shell, versao do Docker, tag local,
  tempo aproximado de build, tamanho da imagem e observacao sobre disco.

Qualquer desvio dessas convencoes deve ser justificado na PR ou na documentacao
operacional atualizada.

## Decisoes Abertas

- Usar ou nao `docker-compose.yml` na primeira versao?
- Playwright em Docker deve continuar fora ou entrar em fase posterior?
- O projeto deve adicionar comandos npm como atalho para Docker?
- A validacao Docker em CI deve continuar protegida em todo PR ou virar
  validacao opcional no futuro?
- Qual limite aceitavel de tamanho da imagem para pessoas contribuidoras
  iniciantes?
- `node_modules` deve ficar em camada da imagem ou em volume nomeado?
- O E2E em container deve usar Chrome real, Chromium ou configuracao separada?
- Qual comando de limpeza sera recomendado sem risco de apagar recursos de
  outros projetos?
- Qual nome padrao deve ser usado para containers e volumes, mantendo
  `radar-escola-dev:local` como nome preferencial da imagem local?
- Publicacao de imagem deve continuar fora de escopo ate qual marco do projeto?

## Recomendacao

Manter a Fase 1 como base implementada e observar seu custo real nas proximas
PRs.

A base atual entrega valor de projeto sem comprometer a narrativa de produto,
reduz risco de ambiente local e permite validar se Docker realmente ajuda sem
virar requisito da escola.

Depois das primeiras PRs usando a imagem, revisar:

- tempo de build da imagem;
- espaco em disco usado;
- facilidade para pessoa contribuidora iniciante;
- impacto real nos testes;
- necessidade ou nao de Playwright em Docker.

Somente depois disso decidir se `docker-compose.yml` e E2E em Docker entram em
uma fase seguinte.
