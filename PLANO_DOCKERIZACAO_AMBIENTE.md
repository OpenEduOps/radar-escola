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

## Principios

- Docker e ferramenta de engenharia, nao produto.
- O menor ambiente util vem antes de uma solucao completa.
- A dockerizacao deve reduzir atrito, nao adicionar ritual.
- O caminho local sem Docker deve continuar existindo.
- A imagem deve ser simples, previsivel e barata de manter.
- O build Windows do instalador continua no GitHub Actions Windows runner ou em
  maquina Windows com toolchain nativa.
- Nenhum secret, cache pesado ou artefato gerado deve ser versionado.
- A documentacao publica deve continuar centrada em desktop local Windows.

## Arquitetura Alvo Da Dockerizacao

### Camada 1: Ambiente Node Basico

Objetivo: validar o scaffold frontend e regras puras.

Deve cobrir:

- Node.js 24;
- npm;
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
- porta Vite usada pelo scaffold;
- relatorios e traces como artefatos locais ignorados.

Ponto de atencao:

- imagens com browsers podem ser pesadas;
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
- logs e temporarios.

### `Dockerfile.dev`

Deve ser o primeiro artefato executavel da dockerizacao.

Responsabilidades:

- partir de imagem Node adequada;
- instalar dependencias via `npm ci`;
- permitir comandos de validacao do scaffold;
- nao embutir segredos;
- nao gerar artefatos versionados.

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
- padronizar comandos para contributors.

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

### Fase 1: Docker Basico Para Validacao Node

Objetivo: permitir validacao tecnica inicial em container.

Entregas:

- `.dockerignore`;
- `Dockerfile.dev`;
- comando documentado para build da imagem;
- comando documentado para rodar validacoes principais.

Criterios de aceite:

- container executa `npm ci`;
- container executa `npm test`;
- container executa `npm run typecheck`;
- container executa `npm run build`;
- README ou doc operacional aponta para o fluxo;
- CI continua verde;
- nenhum artefato gerado entra no Git.

### Fase 2: Ergonomia De Uso Para Contributors

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
- nao commitar artefatos gerados;
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
- decidir estrategia E2E em Docker;
- implementar E2E em Docker, se aprovado;
- documentar limpeza de artefatos locais;
- revisar impacto em disco;
- revisar se Docker deve ou nao entrar na CI;
- atualizar `docs/development-docker.md` com comandos reais;
- atualizar matriz de issues se a dockerizacao entrar no backlog formal.

## Decisoes Abertas

- Usar ou nao `docker-compose.yml` na primeira versao?
- Playwright em Docker entra na primeira entrega ou fica para fase posterior?
- O projeto deve adicionar comandos npm como atalho para Docker?
- A validacao Docker deve ser exigida em algum tipo especifico de PR?
- Qual limite aceitavel de tamanho da imagem para contributors iniciantes?

## Recomendacao Inicial

Comecar pela Fase 1.

Ela entrega valor rapido, reduz risco de ambiente local, nao pesa demais e nao
confunde a UX final.

Depois da Fase 1, medir:

- tempo de build da imagem;
- espaco em disco usado;
- facilidade para contributor iniciante;
- impacto real nos testes;
- necessidade ou nao de Playwright em Docker.

So entao decidir se `docker-compose.yml` e E2E em Docker entram na fase seguinte.
