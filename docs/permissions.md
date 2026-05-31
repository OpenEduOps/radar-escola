# Permissoes dos Workflows

Os workflows do OpenEduOps devem usar permissoes minimas.

## Regra padrao

Todo workflow deve declarar:

```yaml
permissions:
  contents: read
```

Jobs de validacao, incluindo `Agent name guard`, devem funcionar com permissao
somente leitura.

## Permissoes especiais

- `contents: write`: apenas publicacao de release.
- `id-token: write`: apenas jobs que geram attestations.
- `attestations: write`: apenas jobs que publicam attestations.
- `issues: write`: apenas automacoes que comentam em issues.
- `pull-requests: write`: apenas automacoes que comentam em pull requests.
- `contents: write` + `pull-requests: write`: apenas automacoes que precisam
  habilitar auto-merge ou publicar artefatos, com escopo restrito por condicoes
  do evento.
- `security-events: write`: apenas scanners que enviam resultados ao GitHub.

## Auto-merge restrito

O workflow `Owner auto-merge` usa permissoes de escrita porque precisa solicitar
auto-merge ao GitHub. Esse uso deve permanecer limitado a PRs abertos por
`Will-thom`, com base `main` e fora de modo draft.

O workflow nao deve fazer checkout nem executar codigo do pull request. Sua
responsabilidade e somente habilitar o auto-merge para o mantenedor principal.
Pull requests de outros usuarios continuam dependentes de revisao humana.

## Review gate

O workflow `Review gate` usa apenas permissoes de leitura para consultar revisoes
do pull request.

Ele passa automaticamente para PRs do usuario `Will-thom`. Para qualquer outro
usuario, exige pelo menos uma aprovacao humana feita por uma pessoa diferente do
autor do PR.

## Pull request target

`pull_request_target` so pode ser usado em workflows que nao fazem checkout nem
executam codigo enviado por contributors.

No OpenEduOps, o workflow de agradecimento usa `pull_request_target` apenas para
comentar no PR. Ele le a mensagem de boas-vindas pela API do GitHub, a partir do
branch padrao, e nao executa codigo do PR.
