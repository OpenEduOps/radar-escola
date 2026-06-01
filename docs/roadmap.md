# Roadmap

Para requisitos duraveis do produto, veja
[`docs/project-context.md`](project-context.md).

Para o plano detalhado, veja
[`docs/implementation-plan.md`](implementation-plan.md).

Para o alvo final de aceite, veja
[`docs/final-testable-delivery.md`](final-testable-delivery.md).

Para detalhes do estado atual, veja
[`docs/implementation-status.md`](implementation-status.md).

## Fase 0: Fundacao do Projeto

Status: parcial/implementado.

Resumo:

- documentacao inicial consolidada;
- CI/CD OSS criada;
- scaffold minimo Tauri + React + TypeScript criado;
- build frontend validado;
- release tecnica `v0.0.1` publicada com instalador Windows e checksum;
- smoke Windows validou instalacao, subsistema GUI, janela maximizada e
  Playground.

## Fase 1: Planejamento Implementavel

Status: implementado.

Resumo:

- adotar `template-pre-projeto`;
- quebrar requisitos em fases;
- criar issues de implementacao;
- criar issues de testes;
- definir criterios de aceite por fase;
- cadastrar matriz V1 com 85 issues do MVP e 9 issues Docker transversais.

## Fase 2: Persistencia e Primeiro Uso

Status: planejado.

Resumo:

- SQLite;
- migracoes;
- configuracao de escola;
- direcao/responsavel principal;
- salvaguarda local.

## Fase 3: Acesso e Pessoas

Status: planejado.

Resumo:

- login;
- troca obrigatoria de senha;
- cargos/funcoes;
- pessoas/usuarios;
- apoio de gestao.

## Fase 4: Radar de Necessidades

Status: planejado.

Resumo:

- criar necessidade;
- listar no radar;
- detalhe;
- envolvidos;
- andamento;
- plano simples.

## Fase 5: Resolucao, Historico e Auditoria

Status: planejado.

Resumo:

- marcar como resolvido;
- cancelar/corrigir;
- preservar historico;
- registrar auditoria;
- restringir acoes sensiveis.

## Fase 6: Equipamentos

Status: planejado.

Resumo:

- cadastro basico;
- vinculo com necessidade;
- listagem simples.

## Fase 7: Exportacao e Restauracao

Status: planejado.

Resumo:

- CSV restauravel;
- substituicao total apos confirmacao;
- preservacao de hashes;
- validacao de integridade minima.

## Fase 8: Release Windows

Status: parcial/implementado.

Resumo:

- instalador Windows;
- checksum;
- smoke test de artefato;
- validacao local de instalacao e abertura;
- release por tag `v0.0.1`;
- executavel sem prompt atras da janela principal;
- janela principal maximizada por padrao.

## Iniciativa Transversal: Dockerizacao Do Ambiente Tecnico

Status: base Node implementada e validada.

Resumo:

- manter Docker fora da experiencia final da escola;
- `.dockerignore` e `Dockerfile.dev` criados;
- validacao Node basica em container criada;
- tempo de build e tamanho de imagem medidos;
- validacao Docker adicionada a CI como etapa pequena;
- decidir depois se Playwright ou compose fazem sentido;
- preservar `Desktop Release` como caminho de instalador Windows.

## Proximos Passos Imediatos

- escolher a primeira issue fundacional do MVP;
- implementar regras de dominio criticas com testes;
- iniciar persistencia SQLite e bootstrap local;
- manter a release tecnica honesta ate existir fluxo funcional da escola;
- atualizar documentacao sempre que comportamento real do app mudar.
