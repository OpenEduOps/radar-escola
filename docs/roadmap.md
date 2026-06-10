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

Status: parcial/implementado.

Resumo:

- SQLite local ja existe no playground e na primeira fatia Radar;
- migration relacional inicial do MVP criada em
  `src-tauri/migrations/001_initial_mvp.sql`;
- configuracao de escola e direcao/responsavel principal ja existem na fatia
  funcional atual;
- salvaguarda local ja tem regra de dominio, mas ainda precisa de fluxo final de
  recuperacao.

## Fase 3: Acesso e Pessoas

Status: parcial/implementado.

Resumo:

- login e primeiro acesso ja existem na fatia funcional atual;
- troca obrigatoria de senha ja existe no fluxo inicial;
- cargos/funcoes e pessoas/usuarios ja possuem regra de dominio;
- apoio de gestao ja possui limite de duas pessoas e permissoes testadas;
- ainda faltam repositorios finais e telas completas da V0.

## Fase 4: Radar de Necessidades

Status: parcial/implementado.

Resumo:

- criar necessidade, listar no radar, detalhe, envolvidos e andamento ja existem
  na fatia funcional atual;
- plano simples ja possui regra de dominio testada;
- ainda faltam repositorios finais e acabamento das telas V0.

## Fase 5: Resolucao, Historico e Auditoria

Status: parcial/implementado.

Resumo:

- marcar como resolvido ja existe na fatia funcional atual;
- cancelamento e auditoria ja possuem regra de dominio testada;
- restricoes sensiveis ja foram modeladas em regras puras;
- ainda faltam historico visual, persistencia final de auditoria e tela de
  consulta exclusiva da direcao.

## Fase 6: Equipamentos

Status: parcial/implementado em dominio.

Resumo:

- cadastro basico e inativacao ja possuem regra de dominio testada;
- ainda faltam repositorio, tela, listagem e vinculo operacional com necessidade.

## Fase 7: Exportacao e Restauracao

Status: parcial/implementado em dominio e schema.

Resumo:

- pacote de seguranca restauravel ja possui regra de dominio testada;
- migration inicial ja inclui `security_exports` e `security_imports`;
- substituicao total ja e regra obrigatoria;
- ainda faltam geracao/leitura de arquivos, UX de confirmacao e restauracao
  operacional.

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

- seguir para repositorios finais `PER-002` a `PER-011`;
- conectar casos de uso da aplicacao aos repositorios definitivos;
- endurecer hash Argon2id no runtime nativo;
- implementar recuperacao local operacional;
- manter a release tecnica honesta ate existir fluxo funcional da escola;
- atualizar documentacao sempre que comportamento real do app mudar.
