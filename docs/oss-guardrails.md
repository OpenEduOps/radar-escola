# Guardrails OSS

Este documento resume guardrails praticos para manter o OpenEduOps acolhedor e
seguro para contribuidores.

## Contribuicao

- Issues para iniciantes devem ter escopo pequeno e criterio de aceite claro.
- Documentacao e discussao devem usar Portugues Brasileiro por padrao.
- Revisoes devem explicar o motivo das solicitacoes de mudanca.
- Mudancas devem ser pequenas o suficiente para revisao humana cuidadosa.
- Contribuicoes automatizadas ou assistidas por ferramentas sao permitidas
  quando forem revisaveis.
- Metadados publicos devem ser focados no produto, issue, comportamento ou
  mudanca de engenharia, nao na ferramenta usada.
- Branches, titulos de pull request, commits e mensagens de merge nao devem
  conter nomes de agentes ou ferramentas de programacao.

## CI/CD

- `main` deve depender de `All CI checks`.
- Workflows devem usar permissoes minimas.
- CI central nao deve depender de servicos pagos ou credenciais privadas.
- Forks nao devem executar codigo em workflows `pull_request_target`.
- O job `Agent name guard` deve permanecer dentro de `All CI checks`.
- Auto-merge automatico e permitido apenas para PRs do usuario `Will-thom`,
  depois que os checks obrigatorios estiverem verdes.
- PRs de outros usuarios devem continuar pendentes de revisao humana, mesmo
  quando os checks passarem.
- O check `Review gate` deve permanecer protegido para garantir que PRs de
  terceiros nao sejam mergeados sem aprovacao humana.

## Produto

- O usuario final nao deve precisar entender a tecnologia interna.
- O Radar Escola deve priorizar experiencia Windows desktop local.
- A narrativa publica deve descrever o Radar Escola como aplicativo desktop
  local para Windows, nao como app web, PWA, site ou sistema em navegador.
- Termos como React, Vite, frontend e navegador devem aparecer apenas em
  contexto tecnico de implementacao, desenvolvimento ou testes automatizados.
- Funcionalidades novas devem respeitar `REQUISITOS_V0.md` e `GUARDRAILS_V0.md`.

## Seguranca

- Nunca commitar secrets, tokens ou chaves privadas.
- Senhas nunca devem aparecer em texto claro.
- Dados sensiveis devem ser tratados com cuidado mesmo quando o app for local.
