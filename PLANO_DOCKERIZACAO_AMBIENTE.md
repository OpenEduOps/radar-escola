# Plano De Dockerizacao Do Ambiente

Este documento registra o planejamento de projeto para dockerizar o ambiente do
Radar Escola.

Ele nao e um guia operacional de desenvolvimento. O guia pratico continua em
[`docs/development-docker.md`](docs/development-docker.md).

## Decisao De Produto E Engenharia

Docker deve ser tratado como ferramenta de apoio ao projeto, nao como parte da
experiencia final da escola.

A narrativa do produto permanece:

```text
Radar Escola = aplicativo desktop local para Windows
```

A narrativa da engenharia passa a ser:

```text
Docker = ambiente reproduzivel para desenvolvimento, QA tecnico e contribuicao
OSS
```

## Objetivo

Criar uma camada de ambiente reproduzivel que ajude pessoas desenvolvedoras,
QA e contribuidoras OSS a validar o projeto com menos atrito.

O plano deve permitir que o projeto evolua para:

- instalar dependencias de forma reproduzivel;
- executar testes unitarios;
- executar typecheck;
- executar build frontend;
- executar testes E2E do playground quando viavel;
- reduzir diferencas entre maquinas locais;
- documentar claramente o que Docker valida e o que nao valida;
- preservar a entrega final por instalador Windows.

## Nao Objetivos

Docker nao deve:

- ser usado pela escola;
- substituir o instalador Windows;
- virar requisito para uso final do Radar Escola;
- virar requisito obrigatorio para toda contribuicao;
- esconder a necessidade de build nativo Windows para Tauri;
- publicar container como artefato do produto;
- criar narrativa de app web, PWA, site ou sistema em navegador;
- expor banco local, servidor local ou container como parte da UX final.

## Estado Atual

O projeto ja possui:

- scaffold minimo Tauri + React + TypeScript;
- playground CRUD de referencia;
- `package-lock.json`;
- testes unitarios do playground;
- teste E2E Playwright do playground;
- CI com `npm ci`, typecheck, testes, build frontend e E2E;
- workflow `Desktop Release` para instalador Windows tecnico;
- guia conceitual em `docs/development-docker.md`.

Ainda nao possui:

- `Dockerfile.dev`;
- `.dockerignore`;
- imagem dev validada;
- comando padrao para validar o projeto via Docker;
- imagem ou estrategia Docker para Playwright;
- documentacao operacional final dos comandos Docker;
- integracao explicita entre plano Docker e matriz de issues.

## Premissas Tecnicas Atuais

- A CI usa Node.js 24.
- O projeto usa npm e `package-lock.json`.
- O Vite esta configurado com porta fixa `1420`.
- O teste E2E usa Playwright e base URL `http://127.0.0.1:1420`.
- O Playwright esta configurado hoje para usar o canal `chrome`.
- O ambiente alvo de desenvolvimento pode ser Windows, WSL2, Linux ou runner
  temporario.
- Docker Desktop/WSL2 pode ter custo de disco e desempenho diferente em
  maquinas Windows.
- O fluxo local sem Docker continua sendo suportado por `npm ci`, `npm test`,
  `npm run typecheck`, `npm run build` e `npm run test:e2e`.
- Dependencias npm exigem acesso a registry durante `npm ci`, salvo cache local
  ja existente.
- Docker nao deve ser apresentado como estrategia offline para a escola.

## Principios

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
- O plano deve considerar espaco em disco como restricao real de uso.
- A documentacao publica deve continuar centrada em desktop local Windows.
- Docker deve ser reversivel: se a experiencia piorar, o projeto deve conseguir
  voltar ao fluxo local sem perda de caminho tecnico.
- Imagens, containers e volumes criados pelo projeto devem ter nomes associados
  ao Radar Escola para facilitar limpeza segura.
- A primeira fase nao deve publicar imagem em GHCR, Docker Hub ou qualquer
  registry externo.

## Arquitetura Alvo Da Dockerizacao

### Camada 1: Ambiente Node Basico

Objetivo: validar o scaffold frontend e regras puras.

Deve cobrir:

- Node.js 24;
- npm;
- `package-lock.json` como fonte de instalacao reproduzivel;
- `npm ci`;
- `npm test`;
- `npm run typecheck`;
- `npm run build`.

Nao precisa cobrir:

- build Tauri completo;
- instalador Windows;
- banco SQLite real da V0;
- Playwright com navegador, na primeira entrega.

### Camada 2: Ambiente E2E

Objetivo: executar testes Playwright de forma mais reproduzivel.

Deve cobrir:

- browser necessario para Playwright;
- `npm run test:e2e`;
- porta Vite `1420`;
- relatorios e traces como artefatos locais ignorados.

Ponto de atencao:

- imagens com browsers podem ser pesadas;
- o canal `chrome` precisa existir dentro da imagem escolhida, ou a estrategia
  E2E deve documentar uma configuracao especifica para container;
- essa camada deve ser opcional se o custo ficar alto demais para contribuidores
  iniciantes.

### Camada 3: Ambiente De Persistencia Futura

Objetivo: preparar caminho para testes SQLite quando a V0 funcional existir.

Deve cobrir futuramente:

- criacao de banco em diretorio temporario de teste;
- migracoes;
- testes de repositorio;
- exportacao/restauracao em diretorios montados;
- limpeza deterministica entre execucoes.

Nao deve cobrir:

- banco real da escola;
- dados pessoais reais;
- volume persistente tratado como ambiente de producao.

### Camada 4: Limite Tauri/Rust

Objetivo: definir o que Docker pode ou nao validar na camada desktop.

Docker pode ajudar futuramente em:

- checks Rust independentes de Windows, quando fizer sentido;
- organizacao de dependencias de desenvolvimento;
- validacoes auxiliares.

Docker nao deve ser tratado como substituto de:

- Visual Studio Build Tools/MSVC;
- runner Windows;
- build real do instalador `.exe`;
- smoke test do instalador instalado no Windows.

## Artefatos Planejados

### `.dockerignore`

Deve impedir envio de arquivos desnecessarios ao contexto Docker:

- `.git`;
- `node_modules`;
- `dist`;
- `playwright-report`;
- `test-results`;
- `src-tauri/target`;
- `.env`;
- `.env.*`;
- `*.log`;
- `*.tmp`;
- logs e temporarios.

### `Dockerfile.dev`

Deve ser o primeiro artefato executavel da dockerizacao.

Responsabilidades:

- partir de imagem Node adequada;
- usar Node 24 para alinhar com a CI;
- evitar tag `latest`;
- copiar `package.json` e `package-lock.json` antes do restante do codigo quando
  isso ajudar cache de build;
- instalar dependencias via `npm ci`;
- permitir comandos de validacao do scaffold;
- evitar que `node_modules` do container seja escrito no host por acidente;
- nao embutir segredos;
- nao gerar artefatos versionados.

### Seguranca Da Imagem

A dockerizacao deve evitar aumentar a superficie de risco do projeto.

Direcoes:

- usar imagem base oficial ou confiavel;
- evitar tag `latest`;
- registrar a tag escolhida e o motivo;
- nao copiar `.env`, `.npmrc`, tokens ou arquivos locais sensiveis;
- nao montar `docker.sock`;
- nao usar `--privileged`;
- nao usar `--network host` sem justificativa;
- preferir usuario nao-root quando isso nao prejudicar a primeira entrega;
- manter `npm audit` e checks de workflow na CI como controles independentes.

### Estrategia De Dependencias E Volumes

A primeira versao deve evitar ambiguidade entre dependencias do host e
dependencias do container.

Direcoes aceitaveis:

- instalar dependencias dentro da imagem durante o build;
- ou usar volume nomeado para `node_modules`, se houver modo dev interativo.

Direcoes a evitar:

- montar `node_modules` do Windows dentro do container;
- sobrescrever `node_modules` local sem intencao clara;
- depender de caches locais nao documentados;
- exigir que pessoas contribuidoras limpem manualmente arquivos gerados sem
  orientacao.

### Estrategia De Comandos

A primeira versao deve diferenciar dois momentos:

- build da imagem: prepara ambiente e valida instalacao de dependencias;
- execucao do container: roda comandos de verificacao do projeto.

Comandos documentados devem deixar claro:

- se `npm ci` roda durante `docker build`, durante `docker run` ou nos dois;
- qual diretorio do host e montado;
- quais arquivos podem ser gerados;
- como limpar containers, imagens e volumes criados pelo projeto.

Evitar comandos magicos que escondam comportamento importante. Uma pessoa
contribuidora iniciante precisa entender o que esta sendo validado.

### Nomeacao E Publicacao De Imagens

A primeira fase deve criar apenas imagem local de desenvolvimento.

Direcoes:

- usar nome de imagem associado ao projeto, como `radar-escola-dev`;
- nao publicar imagem em GHCR, Docker Hub ou registry externo;
- nao tratar imagem local como artefato de release;
- se volumes ou containers nomeados forem criados, usar prefixo do projeto para
  facilitar limpeza segura.

### `Dockerfile.e2e` Ou Estrategia Equivalente

Deve existir apenas se a camada E2E for aprovada como custo razoavel.

Alternativas:

- usar imagem oficial Playwright;
- instalar browser no container dev;
- manter E2E fora do Docker inicialmente e documentar a decisao.

### `docker-compose.yml`

Nao deve ser criado por padrao.

Pode entrar se houver ganho real para:

- subir Vite com porta previsivel;
- rodar E2E contra servidor local;
- padronizar comandos para pessoas contribuidoras.

Se for criado, deve ser tratado como ambiente de desenvolvimento.

### Documentacao Operacional

`docs/development-docker.md` deve evoluir de decisao conceitual para guia
operacional quando os artefatos Docker existirem.

Deve explicar:

- pre-requisitos;
- comandos;
- o que cada comando valida;
- limitacoes;
- como limpar artefatos;
- por que isso nao substitui o instalador Windows.

## Fases De Implementacao

### Fase 0: Planejamento

Objetivo: alinhar decisao, escopo, riscos e linha de corte.

Entregas:

- este documento;
- link no README;
- alinhamento com guardrails de produto.

Criterios de aceite:

- plano deixa claro que Docker nao e UX final;
- plano diferencia ambiente dev, E2E, persistencia e release Windows;
- plano define primeira entrega minima.

### Dependencias Entre Fases

- Fase 1 nao depende de `docker-compose.yml`, Playwright em Docker, SQLite ou
  Rust.
- Fase 2 depende da Fase 1 validada e deve ser descartada se nao reduzir atrito
  real.
- Fase 3 depende de decisao explicita sobre custo de imagem e compatibilidade do
  browser.
- Fase 4 depende da implementacao real de SQLite no MVP.
- Fase 5 depende de evidencia de que Docker reduz divergencia com a CI.
- Fase 6 nao depende de Docker e nao deve ser bloqueada por Docker.

Essa ordem existe para impedir que uma primeira PR de dockerizacao cresca alem
do necessario.

### Fase 1: Docker Basico Para Validacao Node

Objetivo: permitir validacao tecnica inicial em container.

Entregas:

- `.dockerignore`;
- `Dockerfile.dev`;
- comando documentado para build da imagem;
- comando documentado para rodar validacoes principais.

Criterios de aceite:

- imagem dev e construida com sucesso;
- instalacao de dependencias via `npm ci` e validada no fluxo definido;
- container executa `npm test`;
- container executa `npm run typecheck`;
- container executa `npm run build`;
- tamanho aproximado da imagem e tempo de build sao registrados;
- README ou doc operacional aponta para o fluxo;
- CI continua verde;
- nenhum artefato gerado entra no Git.
- nao ha alteracao de `package-lock.json` sem mudanca real de dependencia.

### Fase 2: Ergonomia De Uso Para Pessoas Contribuidoras

Objetivo: tornar o fluxo Docker mais facil para contribuicoes pequenas.

Entregas possiveis:

- comandos npm auxiliares, se fizer sentido;
- `docker-compose.yml`, se agregar ergonomia;
- exemplos de uso no guia operacional.

Criterios de aceite:

- uma pessoa contribuidora entende quando usar Docker;
- o fluxo sem Docker continua documentado;
- Docker nao vira requisito obrigatorio para PR simples.

### Fase 3: E2E Com Playwright

Objetivo: decidir e implementar a melhor forma de rodar E2E em Docker.

Opcoes:

1. imagem oficial Playwright;
2. imagem dev com browser instalado;
3. manter E2E fora do Docker por custo alto.

Criterios de aceite:

- decisao registrada;
- compatibilidade entre Playwright, browser disponivel e canal `chrome` foi
  validada;
- se implementado, `npm run test:e2e` roda no container;
- relatorios e traces continuam ignorados;
- custo de imagem e tempo de execucao sao aceitaveis.

### Fase 4: Persistencia SQLite Em Testes

Objetivo: preparar Docker para testes de persistencia quando SQLite for
implementado.

Entregas futuras:

- diretorio temporario de banco em teste;
- estrategia de limpeza;
- comandos de teste de repositorio;
- orientacao para exportacao/restauracao em ambiente controlado.

Criterios de aceite:

- testes nao dependem de dados reais;
- banco de teste e descartavel;
- exportacao/restauracao nao escreve em locais inesperados;
- dados sensiveis continuam protegidos.

### Fase 5: Integracao Com CI

Objetivo: decidir se Docker deve ser usado tambem em CI.

Direcao inicial:

- CI atual ja funciona sem Docker;
- Docker em CI so deve entrar se reduzir divergencia ou simplificar manutencao;
- nao trocar uma CI simples por uma mais pesada sem ganho claro.

Criterios de aceite:

- decisao documentada;
- tempo de CI nao cresce sem justificativa;
- checks protegidos continuam claros.

### Fase 6: Release Desktop

Objetivo: manter Docker fora do caminho final de release Windows.

Criterios de aceite:

- `Desktop Release` continua usando runner Windows;
- build do instalador continua validado com Tauri e toolchain nativa;
- smoke test do instalador continua sendo referencia final;
- documentacao nao sugere container como forma de instalar na escola.

## Linha De Corte Da Primeira Entrega

A primeira entrega util de dockerizacao deve ser pequena:

```text
.dockerignore
Dockerfile.dev
documentacao operacional minima
validacao de npm ci, npm test, typecheck e build
```

Fica fora da primeira entrega:

- Playwright em Docker, se exigir imagem pesada;
- docker-compose, se nao houver ganho imediato;
- build Tauri completo;
- geracao de instalador Windows;
- banco SQLite real;
- fluxo de MVP funcional.

Qualquer proposta que inclua E2E em Docker, compose, CI com Docker e build
Tauri na mesma primeira entrega deve ser quebrada antes de virar issue.

## Definicao De Pronto Para Issues De Docker

Toda issue de dockerizacao deve declarar:

- objetivo exato;
- comandos executados;
- ambiente onde foi testada;
- se Docker Desktop/WSL2 foi usado;
- impacto observado em disco quando aplicavel;
- arquivos gerados e confirmacao de que nao foram versionados;
- relacao com a UX final desktop Windows;
- motivo para nao exigir Docker de todas as pessoas contribuidoras, quando
  aplicavel.

Uma PR de Docker nao deve ser considerada pronta se:

- misturar primeira entrega com E2E pesado sem decisao previa;
- alterar fluxo de release Windows sem necessidade;
- adicionar Docker como requisito de usuario final;
- adicionar comando destrutivo de limpeza sem escopo seguro;
- deixar ambigua a origem de `node_modules`;
- introduzir `latest` como base de imagem sem justificativa.

## Matriz De Validacao Planejada

| Camada | Obrigatoria Na Fase 1 | Validacao |
| --- | --- | --- |
| Host local sem Docker | Sim | comandos npm continuam documentados |
| Docker Node basico | Sim | `npm ci`, testes, typecheck e build |
| Docker E2E | Nao | decisao futura sobre Playwright/browser |
| Docker SQLite | Nao | depende da persistencia real |
| Docker Tauri/Windows | Nao | nao substitui runner Windows |
| GitHub Actions Windows | Sim para release | continua fonte do instalador |

## Riscos

### Confusao De Narrativa

Risco: pessoas acharem que o Radar Escola virou app web ou sistema em container.

Mitigacao:

- reforcar sempre "desktop local Windows";
- documentar Docker apenas como dev/QA;
- nao colocar Docker no caminho de uso da escola.

### Imagem Pesada

Risco: imagem com browser, Rust ou ferramentas nativas ficar grande demais.

Mitigacao:

- comecar com Node basico;
- adiar E2E em Docker ate medir custo;
- evitar instalar toolchains desnecessarias.

### Consumo De Disco E Limpeza

Risco: Docker aumentar muito uso de disco em maquinas de contribuidores ou na
maquina de manutencao do projeto.

Mitigacao:

- medir tamanho da imagem na primeira entrega;
- documentar comando de limpeza seguro;
- evitar caches persistentes sem necessidade;
- nao baixar browsers no container basico;
- manter E2E em camada separada se a imagem ficar pesada.

### Duplicacao Com CI

Risco: Docker duplicar a CI sem ganho real.

Mitigacao:

- Docker deve facilitar reproducao local;
- CI continua sendo fonte de verdade remota;
- usar Docker em CI apenas se simplificar.

### Falsa Cobertura Desktop

Risco: container Linux passar e o app desktop Windows quebrar.

Mitigacao:

- documentar que Docker nao valida instalador Windows;
- manter `Desktop Release` e smoke Windows como validacao final.

### Caminhos, Permissoes E WSL2

Risco: volume montado a partir do Windows ter desempenho ruim, permissao
inesperada ou comportamento diferente no WSL2.

Mitigacao:

- documentar comandos testados no Windows/PowerShell e, quando aplicavel, WSL2;
- evitar depender de permissao Unix especifica para arquivos gerados;
- manter artefatos de teste em diretorios ja ignorados;
- validar que o container nao cria arquivos com permissao inconveniente no host.

### Atrito Para Iniciantes

Risco: Docker virar mais um obstaculo para good first issues.

Mitigacao:

- manter comandos locais simples;
- Docker opcional;
- documentacao curta e direta.

## Criterios De Aceite Gerais

Uma dockerizacao sera considerada saudavel quando:

- explicar claramente que e dev-only;
- preservar o fluxo final por instalador Windows;
- rodar validacoes principais em container;
- nao exigir Docker para contribuicoes simples;
- nao aumentar muito o custo de disco e tempo;
- documentar tamanho aproximado da imagem e comando de limpeza;
- nao commitar artefatos gerados;
- nao poluir o host com `node_modules` ou caches sem intencao;
- nao enfraquecer guardrails de seguranca;
- manter CI verde;
- manter documentacao atualizada.

## Tarefas Futuras Candidatas

Estas tarefas podem virar issues depois de revisao:

- criar `.dockerignore`;
- criar `Dockerfile.dev` com Node 24;
- documentar comandos Docker minimos;
- validar `npm ci` em container;
- validar `npm test` em container;
- validar `npm run typecheck` em container;
- validar `npm run build` em container;
- medir tamanho da imagem dev;
- documentar limpeza segura de imagens, containers e volumes do projeto;
- validar comportamento em Windows com Docker Desktop/WSL2;
- decidir estrategia de `node_modules` no container;
- decidir estrategia E2E em Docker;
- implementar E2E em Docker, se aprovado;
- validar canal `chrome` do Playwright em container ou definir alternativa;
- documentar limpeza de artefatos locais;
- revisar impacto em disco;
- revisar se Docker deve ou nao entrar na CI;
- atualizar `docs/development-docker.md` com comandos reais;
- atualizar matriz de issues se a dockerizacao entrar no backlog formal.

## Quebra Inicial Sugerida Em Issues

Esta quebra ainda nao cria issues. Ela serve para transformar o plano em tarefas
pequenas, revisaveis e com escopo controlado.

| Issue sugerida | Objetivo | Dependencia |
| --- | --- | --- |
| DOCKER-001 | Criar `.dockerignore` com exclusoes seguras | nenhuma |
| DOCKER-002 | Criar `Dockerfile.dev` com Node 24 e tag explicita | DOCKER-001 |
| DOCKER-003 | Documentar comandos minimos em `docs/development-docker.md` | DOCKER-002 |
| DOCKER-004 | Validar `npm ci`, testes, typecheck e build no container | DOCKER-002 |
| DOCKER-005 | Medir tempo, tamanho da imagem e impacto em disco | DOCKER-004 |
| DOCKER-006 | Documentar limpeza segura limitada a recursos do projeto | DOCKER-005 |
| DOCKER-007 | Decidir se E2E em Docker entra na fase seguinte | DOCKER-005 |
| DOCKER-008 | Atualizar matriz de issues se Docker entrar no backlog formal | DOCKER-007 |

Cada issue deve manter a narrativa de que Docker e ambiente tecnico opcional, nao
parte da experiencia final da escola.

## Criterios Para Pausar Ou Reverter

Docker deve ser pausado, simplificado ou revertido se:

- a imagem ficar pesada demais para uma primeira contribuicao;
- o fluxo com Docker ficar mais confuso que o fluxo local;
- o consumo de disco crescer sem ganho claro;
- Docker passar a parecer requisito para PR simples;
- a manutencao dos arquivos Docker superar o beneficio de reproducibilidade;
- a documentacao gerar confusao com a UX final desktop Windows.

Se isso acontecer, o projeto deve preservar comandos locais e CI como caminho
principal. O plano Docker pode permanecer como registro historico ou voltar para
estado experimental.

## Decisoes Abertas

- Usar ou nao `docker-compose.yml` na primeira versao?
- Playwright em Docker entra na primeira entrega ou fica para fase posterior?
- O projeto deve adicionar comandos npm como atalho para Docker?
- A validacao Docker deve ser exigida em algum tipo especifico de PR?
- Qual limite aceitavel de tamanho da imagem para pessoas contribuidoras
  iniciantes?
- `node_modules` deve ficar em camada da imagem ou em volume nomeado?
- O E2E em container deve usar Chrome real, Chromium ou configuracao separada?
- Qual comando de limpeza sera recomendado sem risco de apagar recursos de
  outros projetos?
- Qual nome padrao deve ser usado para imagem, containers e volumes?
- O `Dockerfile.dev` deve rodar como usuario root ou nao-root na primeira fase?
- Publicacao de imagem deve continuar fora de escopo ate qual marco do projeto?

## Recomendacao Inicial

Comecar pela Fase 1.

Ela entrega valor rapido, reduz risco de ambiente local, nao pesa demais e nao
confunde a UX final.

Depois da Fase 1, medir:

- tempo de build da imagem;
- espaco em disco usado;
- facilidade para pessoa contribuidora iniciante;
- impacto real nos testes;
- necessidade ou nao de Playwright em Docker.

So entao decidir se `docker-compose.yml` e E2E em Docker entram na fase seguinte.
