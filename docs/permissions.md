# Permissoes dos Workflows

Os workflows do OpenEduOps devem usar permissoes minimas.

## Regra padrao

Todo workflow deve declarar:

```yaml
permissions:
  contents: read
```

## Permissoes especiais

- `contents: write`: apenas publicacao de release.
- `id-token: write`: apenas jobs que geram attestations.
- `attestations: write`: apenas jobs que publicam attestations.
- `issues: write`: apenas automacoes que comentam em issues.
- `pull-requests: write`: apenas automacoes que comentam em pull requests.
- `security-events: write`: apenas scanners que enviam resultados ao GitHub.

## Pull request target

`pull_request_target` so pode ser usado em workflows que nao fazem checkout nem
executam codigo enviado por contributors.

No OpenEduOps, o workflow de agradecimento usa `pull_request_target` apenas para
comentar no PR. Ele le a mensagem de boas-vindas pela API do GitHub, a partir do
branch padrao, e nao executa codigo do PR.
