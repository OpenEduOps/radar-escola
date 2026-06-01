# Docker Para Desenvolvimento

Este documento sera o guia operacional de Docker para pessoas desenvolvedoras,
QA tecnico e contribuidoras OSS.

A decisao de projeto, fases, riscos e criterios de corte estao em
[`PROJETO_DOCKERIZACAO_AMBIENTE.md`](../PROJETO_DOCKERIZACAO_AMBIENTE.md).

## Estado Atual

Docker ainda nao esta implementado no repositorio.

Ainda nao existem:

- `.dockerignore`;
- `Dockerfile.dev`;
- imagem local validada;
- comando padrao para rodar validacoes em container;
- estrategia Docker para Playwright;
- `docker-compose.yml`.

Por enquanto, este guia registra a abordagem operacional esperada. Ele deve ser
atualizado com comandos reais somente quando os artefatos Docker forem criados e
validados.

## Regra Principal

Docker e opcional e tecnico.

```text
desenvolvimento / QA tecnico / contribuicao OSS -> Docker pode ajudar
pessoa usuaria final da escola -> instalador Windows
```

Docker nao faz parte da experiencia final do Radar Escola.

## O Que Docker Deve Resolver

Quando implementado, Docker deve ajudar a:

- reduzir diferencas entre maquinas de desenvolvimento;
- validar o scaffold com Node.js 24;
- executar testes unitarios;
- executar typecheck;
- executar build frontend;
- apoiar QA tecnico;
- facilitar contribuicoes OSS pequenas e revisaveis.

Docker deve continuar fora do caminho final de uso da escola.

## O Que Docker Nao Deve Resolver

Docker nao deve:

- ser usado pela escola;
- substituir o instalador Windows;
- substituir o workflow `Desktop Release`;
- substituir smoke test do app instalado no Windows;
- virar requisito obrigatorio para toda contribuicao;
- publicar container como artefato do produto;
- criar narrativa de app web, PWA, site ou sistema em navegador;
- esconder a necessidade de toolchain nativa Windows para build Tauri.

## Fluxo Local Continua Principal

Enquanto Docker nao existir, use os comandos locais:

```text
npm ci
npm test
npm run test:e2e
npm run typecheck
npm run build
```

Mesmo depois da dockerizacao, esses comandos devem continuar documentados e
funcionais para quem nao usar Docker.

## Linha Operacional Esperada

A primeira entrega Docker deve ser pequena:

```text
.dockerignore
Dockerfile.dev
validacao de instalacao, testes, typecheck e build
limpeza segura limitada ao projeto
```

Ficam fora da primeira entrega:

- Playwright em Docker, se exigir imagem pesada;
- `docker-compose.yml`, se nao houver ganho imediato;
- build Tauri completo;
- geracao de instalador Windows;
- banco SQLite real;
- fluxo funcional de MVP.

## Comandos Futuros

Esta secao deve receber comandos reais somente apos implementacao e validacao.

Quando existirem, os comandos devem deixar claro:

- nome da imagem;
- tag base usada;
- se dependencias sao instaladas no build da imagem ou na execucao;
- quais validacoes rodam;
- quais arquivos podem ser gerados;
- como limpar imagens, containers e volumes do projeto.

Nao adicionar comandos exemplares que ainda nao foram testados no repositorio.

## Relacao Com Issues

As tarefas Docker foram cadastradas como trilha transversal `DOCKER-001` a
`DOCKER-009`.

Elas devem continuar pequenas, executaveis e independentes do uso final da
escola. A validacao Docker em CI, se aprovada, deve ser uma etapa final
dependente das issues de base: `.dockerignore`, `Dockerfile.dev`, validacao
local, medicao de custo e documentacao operacional.

Enquanto essas bases nao existirem, nenhuma documentacao deve sugerir que Docker
ja e caminho oficial de validacao do projeto.

A `DOCKER-009` funciona como gate final da trilha: primeiro fecham as issues de
base, depois se decide se Docker entra na CI, fica como validacao local ou segue
como workflow experimental. Esse passo nao deve antecipar CI parcial.

## Guardrails Operacionais

- Usar imagem base oficial ou confiavel.
- Evitar tag `latest`.
- Nao copiar `.env`, `.npmrc`, tokens ou arquivos sensiveis.
- Nao montar `docker.sock`.
- Nao usar `--privileged`.
- Nao usar `--network host` sem justificativa.
- Nao montar `node_modules` do Windows dentro do container.
- Nao escrever `node_modules` do container no host por acidente.
- Nao recomendar limpeza global destrutiva como caminho padrao.
- Nomear recursos com prefixo do projeto quando containers ou volumes forem
  criados.

## Relacao Com CI

A CI atual nao depende de Docker.

Docker so deve entrar na CI se reduzir divergencia real ou simplificar
manutencao. A decisao precisa ser registrada antes de mudar workflows.

Uma validacao Docker parcial nao deve ser adicionada ao agregado protegido antes
de existir uma imagem local validada e documentada.

O check protegido continua sendo:

```text
All CI checks
```

## Relacao Com Release Desktop

Docker nao substitui o build Windows.

O instalador do Radar Escola continua dependendo de:

- Tauri;
- Rust/Cargo;
- toolchain nativa Windows;
- workflow `Desktop Release`;
- validacao do app instalado no Windows.

## Frase De Referencia

```text
Docker facilita o ambiente tecnico, mas nunca faz parte da experiencia da pessoa
usuaria final.
```
