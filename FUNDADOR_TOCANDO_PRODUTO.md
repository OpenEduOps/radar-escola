# Fundador Tocando Produto

Este documento registra uma decisao de direcao do projeto Radar Escola: o
fundador/mantenedor pode tocar diretamente as issues fundacionais do MVP para
transformar o scaffold tecnico em um primeiro produto utilizavel, sem fechar a
porta para colaboradores OSS.

## Contexto

O projeto ja possui uma base confiavel:

- documentacao de produto V0 e V1;
- especificacao executavel V1;
- matriz de issues cadastrada;
- CI;
- Docker tecnico;
- release desktop Windows;
- instalador publicado em `v0.0.1`;
- app abrindo sem prompt, maximizado e com playground validado.

A partir deste ponto, esperar exclusivamente contribuicao externa pode atrasar a
chegada do primeiro fluxo funcional. Para ganhar confianca publica, o projeto
precisa deixar de ser apenas bem planejado e passar a demonstrar um fluxo real.

## Decisao

Faz sentido o fundador tocar pessoalmente as issues estruturais do MVP,
especialmente as que desbloqueiam produto.

Isso nao muda a natureza OSS do projeto. A regra e:

- fundador avanca a espinha dorsal do produto;
- issues menores, documentais, QA, revisao e tarefas bem isoladas continuam
  abertas para colaboradores;
- toda entrega continua pequena, revisavel, testada e documentada.

## Principio

O foco inicial nao e fechar muitas issues. O foco e chegar em um fluxo util
demonstravel.

O primeiro sinal de confianca para pessoas usuarias e colaboradoras sera ver o
Radar Escola executar um caminho concreto, ainda que pequeno, sem depender de
explicacao longa.

## Ordem Recomendada

1. `DOM-001` a `DOM-006`: permissao basica, escola/direcao,
   pessoa/cargo/conta, senha/salvaguarda, apoio de gestao,
   necessidade/status.
2. `PER-001`: migrations SQLite.
3. `PER-002`, `PER-003`, `PER-005`: repositorios de escola, pessoas/contas e
   necessidades.
4. Primeiro fluxo de app:
   - configurar escola;
   - entrar;
   - cadastrar pessoa;
   - registrar necessidade;
   - marcar envolvidos;
   - atualizar andamento;
   - marcar como resolvido.
5. Depois disso:
   - equipamentos;
   - exportacao/restauracao;
   - auditoria;
   - refinamentos transversais.

## Como Tocar Sem Fechar O Projeto

- Uma issue por vez.
- Um plano curto antes de implementar quando houver ambiguidade.
- Commits pequenos, modulares e explicaveis.
- Testes junto com regra de dominio, persistencia ou tela.
- Documentacao atualizada quando o comportamento do produto mudar.
- Issues `good first issue`, documentacao, QA, testes e revisao continuam
  disponiveis para entrada de novas pessoas.

## Criterios Para Avancar

Uma issue fundacional pode ser puxada pelo fundador quando:

- desbloqueia o fluxo minimo do MVP;
- reduz incerteza arquitetural;
- ajuda o produto a demonstrar valor real;
- melhora confianca de instalacao, abertura, persistencia ou uso;
- evita que o projeto fique parado esperando contribuicao externa.

Uma issue deve ser deixada preferencialmente para colaboradores quando:

- e documental;
- e de revisao de requisito;
- e QA manual;
- e teste isolado;
- tem baixo risco e baixo acoplamento;
- nao bloqueia a espinha dorsal do MVP.

## Risco A Evitar

O risco nao e o fundador contribuir demais. O risco e transformar isso em um
trabalho invisivel, grande e dificil de revisar.

Por isso, o fundador deve evitar:

- commits grandes demais;
- misturar dominios diferentes na mesma entrega;
- fechar varias issues com uma unica mudanca ampla;
- deixar testes para depois;
- alterar a UX definida sem atualizar documentacao;
- trocar a ordem por entusiasmo tecnico.

## Resultado Esperado

O projeto deve caminhar para um primeiro produto real, mesmo pequeno:

```text
instalar
-> abrir
-> configurar escola
-> entrar
-> cadastrar pessoa
-> registrar necessidade
-> envolver pessoas
-> acompanhar andamento
-> marcar como resolvido
```

Quando esse fluxo existir, o Radar Escola ganha uma base mais forte para:

- atrair colaboradores;
- demonstrar valor;
- orientar boas primeiras issues;
- validar UX com pessoas reais;
- justificar novas releases.

## Direcao Pratica

A proxima rodada recomendada e escolher uma issue fundacional pequena, como
`DOM-001` ou `DOM-002`, planejar rapidamente, implementar com testes e commitar
com lastro de produto.
