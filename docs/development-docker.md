# Docker Para Desenvolvimento

Este documento e o guia operacional de Docker para pessoas desenvolvedoras,
QA tecnico e contribuidoras OSS.

A decisao de projeto, fases, riscos e criterios de corte estao em
[`PROJETO_DOCKERIZACAO_AMBIENTE.md`](../PROJETO_DOCKERIZACAO_AMBIENTE.md).

## Estado Atual

Docker esta implementado como apoio tecnico de desenvolvimento.

Ja existem:

- `.dockerignore`;
- `Dockerfile.dev`;
- imagem local validada com Node.js 24;
- comandos reais para build, typecheck, testes unitarios e build frontend;
- decisao inicial de manter Playwright/E2E fora da imagem basica;
- validacao Docker na CI como etapa final da trilha de base.

Ainda nao existe:

- `docker-compose.yml`;
- imagem publicada em registry;
- build Tauri/Windows em Docker;
- persistencia SQLite em Docker.

## Regra Principal

Docker e opcional e tecnico.

```text
desenvolvimento / QA tecnico / contribuicao OSS -> Docker pode ajudar
pessoa usuaria final da escola -> instalador Windows
```

Docker nao faz parte da experiencia final do Radar Escola.

## O Que Docker Deve Resolver

Docker deve ajudar a:

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

Para validar sem Docker, use os comandos locais:

```text
npm ci
npm test
npm run test:e2e
npm run typecheck
npm run build
```

Mesmo depois da dockerizacao, esses comandos devem continuar documentados e
funcionais para quem nao usar Docker.

## Linha Operacional Implementada

A primeira entrega Docker permanece pequena:

```text
.dockerignore
Dockerfile.dev
validacao de instalacao, testes, typecheck e build
limpeza segura limitada ao projeto
```

Continuam fora desta fase:

- Playwright em Docker, se exigir imagem pesada;
- `docker-compose.yml`, se nao houver ganho imediato;
- build Tauri completo;
- geracao de instalador Windows;
- banco SQLite real;
- fluxo funcional de MVP.

Artefatos locais de release, como `dist-artifacts`, instaladores Windows,
arquivos `.msi` e checksums `.sha256`, tambem ficam fora do contexto Docker por
meio do `.dockerignore`, fora do versionamento por `.gitignore` e bloqueados
pela higiene da CI.

## Comandos

Construa a imagem dev local:

```text
docker build -f Dockerfile.dev -t radar-escola-dev:local .
```

Execute as validacoes Node basicas no container:

```text
docker run --rm radar-escola-dev:local npm run typecheck
docker run --rm radar-escola-dev:local npm test
docker run --rm radar-escola-dev:local npm run build
```

Inspecione a imagem local:

```text
docker images radar-escola-dev:local
docker run --rm radar-escola-dev:local sh -lc "node --version && npm --version && pwd && whoami"
```

Limpeza segura limitada ao projeto:

```text
docker rmi radar-escola-dev:local
```

Nao use limpeza global como caminho padrao. Comandos como `docker system prune`
podem apagar caches e recursos de outros projetos.

## Convencoes Implementadas

- imagem base: `node:24-bookworm-slim`;
- nome local preferencial: `radar-escola-dev:local`;
- diretorio de trabalho: `/workspace`;
- usuario de execucao: `node`;
- dependencias instaladas durante o build da imagem com `npm ci`;
- checks Node em ordem equivalente a CI: `npm run typecheck`, `npm test`,
  `npm run build`;
- Playwright/E2E fora da imagem basica;
- sem `docker-compose.yml` nesta fase;
- sem publicacao de imagem em registry.

Se a implementacao precisar fugir dessas convencoes no futuro, o motivo deve
aparecer na PR e na documentacao atualizada.

## Validacao Realizada

Validacao local realizada em 2026-06-01:

| Item | Resultado |
| --- | --- |
| Sistema | Windows + PowerShell + Docker Desktop |
| Docker Desktop | 4.52.0 |
| Docker Engine | 29.0.1 |
| Contexto | `desktop-linux` |
| Imagem | `radar-escola-dev:local` |
| Node no container | `v24.16.0` |
| npm no container | `11.13.0` |
| Usuario no container | `node` |
| Diretorio no container | `/workspace` |
| Build sem cache | 41.36s |
| Tamanho da imagem | 523MB |
| `npm run typecheck` | 6.73s |
| `npm test` | 11.32s |
| `npm run build` | 7.76s |

Resultado: a imagem e aceitavel para a primeira fase, porque valida o scaffold
sem browser, sem Rust/Tauri e sem artefatos de release Windows.

## Relacao Com Issues

As tarefas Docker foram cadastradas e concluidas como trilha transversal
`DOCKER-001` a `DOCKER-009`.

Elas devem continuar pequenas, executaveis e independentes do uso final da
escola. A validacao Docker em CI foi incluida depois das issues de base:
`.dockerignore`, `Dockerfile.dev`, validacao local, medicao de custo e
documentacao operacional.

Como essas bases ja existem, Docker pode ser citado como caminho tecnico
opcional de validacao. Ele nao substitui o fluxo local sem Docker.

A `DOCKER-009` funcionou como gate final da trilha: primeiro foram fechadas as
issues de base, depois Docker entrou na CI. A validacao atual da CI cobre apenas
a imagem dev Node basica e nao substitui `Desktop Release`.

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
- Nao versionar instaladores, checksums, `dist-artifacts`, `dist`, `coverage`
  ou relatorios locais de teste.
- Nomear recursos com prefixo do projeto quando containers ou volumes forem
  criados.

## Relacao Com CI

A CI inclui uma validacao Docker pequena para impedir que `Dockerfile.dev` e
`.dockerignore` apodrecam.

O check protegido continua sendo:

```text
All CI checks
```

Essa validacao:

- confere que `.dockerignore` existe e preserva exclusoes minimas do contexto
  Docker;
- constroi `radar-escola-dev:ci`;
- roda `npm run typecheck`;
- roda `npm test`;
- roda `npm run build`;
- nao roda Playwright/E2E;
- nao gera instalador Windows;
- nao publica imagem.

## Relacao Com Release Desktop

Docker nao substitui o build Windows.

O instalador do Radar Escola continua dependendo de:

- Tauri;
- Rust/Cargo;
- toolchain nativa Windows;
- workflow `Desktop Release`;
- validacao do app instalado no Windows.

Na tag `v0.0.1`, esse caminho ja publicou um instalador tecnico com checksum.
Docker nao participa desse empacotamento e nao deve ser apresentado como
alternativa de instalacao.

## Frase De Referencia

```text
Docker facilita o ambiente tecnico, mas nunca faz parte da experiencia da pessoa
usuaria final.
```
