# Detalhamento de Requisitos da V0

Este documento registra quais requisitos ainda precisam descer de nivel antes
da implementacao do MVP do Radar Escola.

Os documentos atuais ja definem bem a direcao macro do produto. O proximo passo
e transformar esses requisitos em itens implementaveis, com campos, regras,
telas, estados, erros, testes e criterios de aceite por fluxo.

Este documento deve ser lido junto com:

- `REQUISITOS_V0.md`;
- `ESCOPO_V0.md`;
- `FLUXO_E2E_V0.md`;
- `GUARDRAILS_V0.md`;
- `VISAO_PROTOTIPAL_V0.md`.

## Ordem Recomendada de Detalhamento

### 1. Primeiro uso e direcao

Definir exatamente tela por tela:

- cadastro da escola;
- criacao da direcao ou pessoa responsavel principal;
- usuario e senha;
- geracao e apresentacao do token;
- frase de recuperacao;
- alerta de perda de acesso;
- entrada no Radar de Necessidades apos a configuracao inicial.

### 2. Login, primeiro acesso e recuperacao

Detalhar:

- login normal;
- primeiro acesso com senha temporaria `123456`;
- troca obrigatoria de senha;
- configuracao de salvaguarda;
- recuperacao por token;
- recuperacao por frase de recuperacao;
- reset administrativo pela direcao.

### 3. Pessoas, cargos e apoio de gestao

Definir:

- campos do cadastro de pessoa;
- validacoes;
- criacao de cargo ou funcao durante o cadastro;
- limite de ate duas pessoas como apoio de gestao;
- quem pode cadastrar usuario;
- quem pode redefinir senha;
- quem pode ver cada area da aplicacao.

### 4. Necessidade

Este e o coracao do produto.

Precisamos detalhar:

- campos obrigatorios;
- prioridades;
- status;
- criacao;
- edicao;
- cancelamento;
- andamento;
- plano de acao simples;
- envolvidos;
- equipamento vinculado.

### 5. Radar de Necessidades

Definir como a tela principal organiza o trabalho da escola:

- necessidades em andamento;
- necessidades paradas;
- resolvidas recentemente;
- filtros minimos;
- estados vazios;
- ordenacao;
- informacoes exibidas em cada card ou linha.

### 6. Marcar envolvidos e atualizar andamento

Detalhar:

- quem pode atualizar;
- como o historico aparece;
- quais textos sao obrigatorios;
- como a necessidade continua visivel sem notificacao externa;
- como os envolvidos acompanham pelo computador instalado.

### 7. Marcar como resolvido

Regra critica:

> Apenas direcao ou apoio de gestao podem marcar uma necessidade como resolvida.

Precisamos detalhar:

- confirmacao;
- campos finais;
- historico;
- auditoria;
- o que usuario comum pode fazer quando entende que resolveu tecnicamente a
  necessidade.

### 8. Exportacao e restauracao CSV

Fluxo exclusivo da direcao ou pessoa responsavel principal.

Precisamos detalhar:

- formato dos CSVs;
- quais dados entram;
- preservacao de vinculos;
- inclusao de hashes de senha;
- ausencia de senhas em texto claro;
- substituicao total dos dados atuais na restauracao;
- confirmacao forte antes de restaurar;
- testes de exportacao e restauracao.

## Blocos Transversais

Depois do fluxo minimo, tambem precisam ser detalhados:

- auditoria minima;
- sessao e bloqueio apos 30 minutos de inatividade;
- equipamentos;
- transferencia de direcao;
- testes automatizados;
- acessibilidade;
- linguagem em Portugues Brasileiro;
- criterios de aceite do MVP completo.

O detalhamento desses blocos esta em
`DETALHAMENTO_BLOCOS_TRANSVERSAIS_V0.md`.

## Fluxo Minimo de Valor

A recomendacao e comecar pelo fluxo minimo de valor, porque ele prova o produto:

```text
cadastrar pessoa
-> registrar necessidade
-> ver no radar
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido
-> consultar historico
```

Esse fluxo deve orientar as primeiras issues de implementacao, teste e aceite.

## Criterio de Foco

Antes de detalhar uma funcionalidade, a pergunta deve ser:

> Isso ajuda diretamente a escola a registrar, acompanhar, envolver pessoas,
> atualizar, resolver e preservar historico de uma necessidade?

Se a resposta for nao, a funcionalidade deve ficar fora do primeiro detalhamento
ou entrar apenas como backlog futuro.
