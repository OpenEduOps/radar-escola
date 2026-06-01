# Contexto e Requisitos do Projeto

Este documento adota o `template-pre-projeto` como camada de contexto duravel
para o Radar Escola.

Ele nao substitui os documentos de requisitos existentes. Ele organiza a
fronteira do projeto antes do detalhamento tecnico da implementacao.

## Problema

Escolas, especialmente em contextos publicos e com pouca estrutura, lidam com
necessidades operacionais todos os dias: computadores com defeito, salas com
problemas, pedidos de apoio, acompanhamento de providencias, historico disperso
e dependencia de memoria informal.

O problema nao e apenas tecnico. E de rotina, cuidado, acompanhamento e
responsabilidade compartilhada.

Sem uma ferramenta simples, local e confiavel, a escola tende a perder contexto:

- o que precisa ser resolvido;
- quem esta envolvido;
- qual foi o combinado;
- o que ja foi tentado;
- quando algo foi resolvido;
- como preservar historico se o computador falhar.

## Objetivo do Produto

O Radar Escola deve permitir que uma escola acompanhe necessidades operacionais
em um aplicativo desktop local, com linguagem simples e foco em uso real.

Fluxo conceitual:

```text
necessidade -> envolvidos -> plano/andamento -> resolucao -> historico
```

Fluxo de uso esperado:

```text
instalar -> abrir -> configurar -> entrar -> registrar necessidade
  -> marcar envolvidos -> atualizar andamento -> marcar como resolvido
  -> consultar historico -> exportar/restaurar seguranca
```

## Modelo de Execucao

- Aplicativo desktop local.
- Windows-first.
- Local-first.
- Banco SQLite local.
- Interface em Portugues Brasileiro.
- Sem internet obrigatoria.
- Sem servidor obrigatorio.
- Sem Docker para pessoa usuaria final.
- Sem telemetria por padrao.

Docker pode ser avaliado apenas como apoio tecnico para desenvolvimento, QA e
contribuicao OSS. Ele nao altera o modelo de execucao do produto.

## Fronteira Atual do Workflow

Workflow externo:

```text
escola identifica uma necessidade operacional
```

Este projeto:

```text
necessidade registrada -> envolvidos definidos -> andamento acompanhado
  -> resolucao validada pela gestao -> historico preservado
```

Fora deste projeto na V0:

```text
execucao fisica do reparo, compra, atendimento externo, notificacao por e-mail,
WhatsApp, nuvem, sincronizacao entre computadores
```

## Fora de Escopo

Na V0, nao entram:

- sistema pedagogico;
- controle de estudantes;
- dados pessoais de estudantes;
- e-mail automatico;
- WhatsApp;
- notificacoes push;
- nuvem;
- multiunidade;
- servidor local obrigatorio;
- mobile;
- dashboards analiticos;
- SLA;
- anexos e fotos;
- IA.

O fora de escopo detalhado permanece em `ESCOPO_V0.md` e `REQUISITOS_V0.md`.

## Principios do Produto

- UX da pessoa usuaria final vem antes da tecnologia.
- A pessoa usuaria nao deve precisar saber que existem Tauri, React,
  TypeScript, Rust, SQLite, CI ou banco de dados.
- Windows desktop tradicional e a experiencia alvo inicial.
- Linguagem do produto deve evitar termos tecnicos como ticket, service desk e
  chamado sempre que isso afastar a usuaria final.
- O produto deve tratar necessidades como assuntos vivos, nao como tickets
  frios.
- A direcao deve manter responsabilidade sobre a resolucao formal.
- Todos podem ver o que acontece na V0, mas acoes sensiveis ficam restritas.
- Dados ficam no computador da escola por padrao.
- Exportacao/restauracao existe para preservar autonomia local.

## Categorias / Modelo de Dominio

Conceitos centrais:

- escola;
- direcao/responsavel principal;
- pessoa/usuario;
- cargo ou funcao;
- apoio de gestao;
- necessidade;
- envolvido;
- andamento;
- plano de acao;
- equipamento;
- historico;
- auditoria;
- exportacao de seguranca;
- restauracao.

Estados principais de uma necessidade:

- registrada;
- em andamento;
- parada;
- aguardando resolucao;
- resolvida;
- cancelada.

## Requisitos de Seguranca

Guardrails centrais:

- senhas armazenadas apenas como hash;
- senha inicial `123456` apenas para primeiro acesso;
- troca obrigatoria no primeiro acesso;
- salvaguarda local obrigatoria;
- token de recuperacao nao regeneravel;
- auditoria minima em acoes sensiveis;
- exportacao/restauracao exclusiva da direcao;
- apoio de gestao limitado a duas pessoas;
- apoio de gestao nao consulta auditoria;
- sessao bloqueada apos 30 minutos de inatividade;
- restauracao sempre substitui dados atuais apos confirmacao forte;
- CSV restauravel nunca contem senha em texto claro.

## Requisitos de Entrada

Entradas principais:

- dados iniciais da escola;
- dados da direcao;
- pessoas/usuarios;
- cargos/funcoes;
- necessidades;
- atualizacoes de andamento;
- envolvidos;
- equipamentos;
- CSVs exportados pelo proprio Radar Escola.

Entradas devem ser validadas antes de persistir dados.

## Requisitos de Saida

Saidas principais:

- radar de necessidades;
- detalhe da necessidade;
- historico;
- auditoria para direcao;
- exportacao CSV restauravel;
- instalador Windows em release futura.

## Requisitos de Validacao

Antes de considerar a V0 segura:

- fluxo E2E precisa passar;
- regras de permissao simples precisam ser testadas;
- exportacao/restauracao precisa ser testada;
- acoes sensiveis precisam registrar auditoria;
- dados sensiveis nao podem aparecer em texto claro;
- build frontend precisa passar;
- release desktop precisa gerar artefato instalavel quando o app estiver pronto.

## Requisitos de Automacao

Automatizar:

- lint/qualidade basica de documentacao;
- validacao de links internos;
- `npm ci`;
- typecheck;
- build frontend;
- checks de workflow/permissoes;
- release desktop quando houver tag e scaffold valido.

Avaliar como apoio tecnico:

- ambiente Docker opcional para reduzir divergencia entre maquinas de
  desenvolvimento;
- validacoes Node basicas em container;
- uso de Docker em CI apenas se houver ganho claro e decisao documentada.

Manter manual na V0:

- decisao de release;
- publicacao de versao;
- revisao de requisitos;
- validacao UX com pessoas reais;
- criacao e priorizacao de issues.

## Estado Final Objetivo

O estado final da V0 e um app desktop local, instalavel no Windows, capaz de
acompanhar necessidades operacionais da escola com pessoas envolvidas,
andamento, resolucao, historico, auditoria minima e exportacao/restauracao de
seguranca.
