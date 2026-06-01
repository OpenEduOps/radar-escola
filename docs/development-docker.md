# Docker Para Desenvolvimento

Este documento explica por que Docker pode ser util no desenvolvimento do Radar
Escola e quais limites devem ser preservados para nao confundir a proposta do
produto.

## Decisao

Docker pode ser usado para desenvolvimento, QA tecnico e contribuicao OSS.

Docker nao deve fazer parte da experiencia da pessoa usuaria final da escola.

Regra curta:

```text
dev/QA/contribuicao OSS -> Docker pode ajudar
pessoa usuaria final -> instalador Windows
```

## Por Que Usar Docker No Projeto

### Onboarding De Pessoas Desenvolvedoras

Uma pessoa nova pode validar o scaffold sem instalar manualmente toda a cadeia
de dependencias na maquina local.

O objetivo e reduzir atrito para comandos como:

```text
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
```

### Ambiente Mais Reproduzivel

Docker reduz diferencas entre maquinas, versoes de Node, npm, dependencias de
teste e configuracoes locais.

Isso e especialmente importante em um projeto OSS, onde contribuidores podem
usar Windows, Linux, WSL ou ambientes temporarios.

### Menos Erro Em Contribuicoes OSS

Issues pequenas e bem delimitadas ficam mais faceis de validar quando existe um
ambiente previsivel para rodar testes e build antes da abertura de pull request.

Isso aumenta a chance de uma contribuicao iniciante chegar revisavel, pequena e
integravel.

### QA Tecnico Mais Confiavel

Docker pode ajudar a rodar:

- testes unitarios;
- typecheck;
- build frontend;
- testes E2E com Playwright;
- validacoes de documentacao;
- checks auxiliares de qualidade.

O objetivo nao e substituir a CI, mas aproximar a validacao local da validacao
automatizada.

### Isolamento Da Maquina Local

Dependencias ficam contidas no ambiente de desenvolvimento, reduzindo risco de
poluir a maquina da pessoa desenvolvedora com versoes conflitantes de Node,
pacotes, navegadores de teste ou ferramentas auxiliares.

### Referencia Para O Playground

Enquanto o MVP ainda nao existe, o playground CRUD serve como referencia tecnica.

Docker pode ajudar pessoas desenvolvedoras a rodar esse scaffold, executar os
testes e estudar o fluxo master-detail sem depender tanto da configuracao local.

## O Que Docker Nao Deve Fazer

Docker nao deve:

- ser usado pela escola;
- ser requisito para instalar o Radar Escola;
- substituir o instalador Windows;
- aparecer como caminho de uso para a pessoa usuaria final;
- expor banco, servidor local ou container como parte da experiencia do produto;
- enfraquecer a narrativa de aplicativo desktop local para Windows.

## Relacao Com O App Desktop

O Radar Escola continua sendo um aplicativo desktop local Windows-first.

A entrega final esperada para a escola e:

```text
baixar instalador -> instalar no Windows -> abrir pelo icone -> usar localmente
```

Docker, quando existir, sera apenas ferramenta de engenharia para quem
desenvolve, testa ou revisa o projeto.

## Limite Tecnico Importante

Docker ajuda muito no frontend, nos testes e na automacao de desenvolvimento.

Ele nao substitui completamente o build nativo do aplicativo desktop Windows.
O build real do instalador Tauri depende de toolchain nativa Windows, Rust/Cargo
e Visual Studio Build Tools/MSVC.

Por isso, o caminho principal para gerar o instalador continua sendo o workflow
`Desktop Release` em runner Windows do GitHub Actions, ou uma maquina Windows
local com a toolchain nativa instalada.

## Caminho Recomendado

Quando o projeto for dockerizado, a abordagem recomendada e criar uma camada
explicitamente dev-only:

```text
Dockerfile.dev
.dockerignore
docs/development-docker.md
```

Um `docker-compose.yml` pode ser adicionado apenas se houver ganho real de
ergonomia para desenvolvimento.

O escopo inicial deveria cobrir:

- instalacao de dependencias;
- testes unitarios;
- typecheck;
- build frontend;
- testes E2E, se o custo de imagem e manutencao continuar razoavel.

## Guardrails

- Documentar Docker sempre como ambiente de desenvolvimento.
- Nao chamar Docker de instalador, distribuicao ou modo de uso do Radar Escola.
- Nao exigir Docker para contribuir quando comandos locais simples forem
  suficientes.
- Evitar imagens pesadas sem necessidade.
- Nao commitar caches, relatorios, artefatos de build ou arquivos gerados pelo
  container.
- Manter a documentacao publica centrada em Windows desktop local.

## Frase De Referencia

```text
Docker facilita o desenvolvimento, mas nunca faz parte da experiencia da pessoa
usuaria final.
```
