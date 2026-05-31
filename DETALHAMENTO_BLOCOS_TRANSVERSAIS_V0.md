# Detalhamento dos Blocos Transversais da V0

Este documento detalha os blocos transversais da V0 do Radar Escola.

Eles nao sao uma tela unica nem um fluxo isolado. Sao regras e cuidados que
atravessam o produto inteiro e protegem a experiencia final da escola.

Este documento complementa:

- `REQUISITOS_V0.md`;
- `ESCOPO_V0.md`;
- `FLUXO_E2E_V0.md`;
- `GUARDRAILS_V0.md`;
- `DETALHAMENTO_REQUISITOS_V0.md`.

## Como Usar Este Documento

Cada bloco transversal deve virar requisitos implementaveis, criterios de aceite
e testes antes da implementacao.

Para cada bloco, devemos responder:

- qual problema ele evita;
- quem pode usar;
- quais regras sao obrigatorias na V0;
- quais erros ou estados vazios precisam aparecer;
- quais eventos precisam ser auditados;
- quais testes automatizados protegem a regra;
- o que fica fora da V0.

## 1. Auditoria Minima

### Objetivo

Registrar acoes sensiveis para que a direcao consiga saber quem fez o que e
quando fez, sem transformar a V0 em um sistema complexo de compliance.

### Regras da V0

- Auditoria deve ser local.
- Auditoria deve ser gravada automaticamente pelo sistema.
- Auditoria deve registrar, no minimo:
  - usuario responsavel;
  - tipo da acao;
  - data e hora;
  - entidade afetada;
  - identificador da entidade afetada;
  - resumo legivel da acao.
- A consulta da auditoria deve ser exclusiva da direcao.
- Apoio de gestao nao consulta auditoria.
- Auditoria nao deve expor senha, token, resposta de frase de recuperacao ou
  qualquer segredo.
- Eventos de auditoria nao devem ser editados pela interface da V0.

### Eventos Minimos

- Cadastro de usuario.
- Redefinicao administrativa de senha.
- Definicao ou remocao de apoio de gestao.
- Marcacao de necessidade como resolvida.
- Cancelamento de necessidade.
- Exportacao de seguranca.
- Restauracao de seguranca.
- Transferencia de direcao.

### Criterios de Aceite

- Toda acao sensivel gera evento de auditoria.
- Usuario comum nao acessa auditoria.
- Apoio de gestao nao acessa auditoria.
- Direcao consegue consultar eventos em ordem cronologica.
- Auditoria nao revela senhas, tokens ou respostas secretas.

### Testes Minimos

- Teste unitario para garantir que cada acao sensivel gera evento.
- Teste unitario para negar consulta de auditoria a usuario comum.
- Teste unitario para negar consulta de auditoria a apoio de gestao.
- Teste de persistencia para gravar e ler eventos de auditoria.
- Teste garantindo ausencia de segredo nos dados auditados.

## 2. Sessao e Bloqueio por Inatividade

### Objetivo

Proteger o uso em computador compartilhado sem tornar a experiencia pesada para
pessoas nao tecnicas.

### Regras da V0

- Deve existir acao visivel para sair da conta.
- A sessao deve bloquear apos 30 minutos de inatividade.
- A tela bloqueada deve pedir a senha do usuario atual.
- O desbloqueio deve preservar o contexto quando possivel.
- Trocar de usuario deve exigir sair da conta e fazer novo login.
- O sistema deve orientar a pessoa a sair da conta ao terminar o uso.
- A V0 nao precisa ter bloqueio de conta por tentativas erradas.
- A V0 nao precisa sincronizar sessao entre computadores.

### Estados Necessarios

- Sessao ativa.
- Sessao bloqueada por inatividade.
- Senha incorreta no desbloqueio.
- Logout manual.
- Retorno ao login.

### Criterios de Aceite

- Usuario consegue sair da conta por botao visivel.
- Apos 30 minutos sem atividade, a sessao bloqueia.
- Para desbloquear, o usuario precisa informar a propria senha.
- Usuario diferente nao assume a sessao bloqueada.
- Depois do logout, dados da tela anterior nao ficam expostos.

### Testes Minimos

- Teste unitario da regra de inatividade.
- Teste de interface para logout manual.
- Teste de interface para bloqueio por inatividade.
- Teste de interface para senha incorreta no desbloqueio.
- Teste de interface para retorno ao contexto quando possivel.

## 3. Equipamentos

### Objetivo

Permitir que necessidades operacionais sejam vinculadas a equipamentos quando
isso ajudar a escola a entender recorrencia e historico.

### Regras da V0

- Equipamento e cadastro basico, nao patrimonio completo.
- Vinculo de equipamento em necessidade deve ser opcional.
- Campos minimos:
  - nome;
  - local;
  - patrimonio ou identificacao;
  - estado atual;
  - observacoes.
- A V0 deve permitir listar equipamentos.
- A V0 deve permitir vincular uma necessidade a um equipamento existente.
- A V0 pode permitir editar dados simples do equipamento.
- Exclusao definitiva deve ser evitada quando houver necessidade vinculada.

### Fora da V0

- Controle completo de patrimonio.
- Depreciacao.
- Responsavel patrimonial formal.
- Anexos, fotos ou notas fiscais.
- Inventario avancado.
- Etiquetas ou QR Code.

### Criterios de Aceite

- Usuario autorizado cadastra equipamento basico.
- Equipamento aparece na listagem.
- Necessidade pode ser criada com equipamento vinculado.
- Historico da necessidade preserva o equipamento relacionado.
- Equipamento com necessidade vinculada nao desaparece sem cuidado.

### Testes Minimos

- Teste unitario de validacao de equipamento.
- Teste de persistencia para criar e ler equipamento.
- Teste de persistencia para vincular necessidade e equipamento.
- Teste de interface para selecionar equipamento ao registrar necessidade.

## 4. Transferencia de Direcao

### Objetivo

Permitir continuidade quando a pessoa responsavel principal muda, sem depender
de procedimento tecnico improvisado.

### Regras da V0

- Apenas a direcao atual pode transferir a responsabilidade principal.
- A nova direcao deve ser uma pessoa cadastrada.
- A transferencia deve exigir confirmacao clara.
- A transferencia deve registrar auditoria.
- A pessoa que deixa a direcao nao deve ser apagada.
- Apoios de gestao existentes devem ser revisados pela nova direcao.
- Exportacao/restauracao de seguranca continua exclusiva da direcao atual apos a
  transferencia.
- A V0 nao deve permitir multiplas direcoes simultaneas.

### Confirmacao Forte

A interface deve deixar claro:

- quem e a direcao atual;
- quem sera a nova direcao;
- quais permissoes serao transferidas;
- que a acao sera registrada em auditoria.

### Criterios de Aceite

- Usuario comum nao consegue transferir direcao.
- Apoio de gestao nao consegue transferir direcao.
- Direcao atual consegue transferir para pessoa cadastrada.
- A nova direcao passa a acessar acoes exclusivas da direcao.
- A direcao anterior perde as acoes exclusivas, salvo se tambem for apoio de
  gestao.
- A transferencia gera evento de auditoria.

### Testes Minimos

- Teste unitario de permissao para transferencia.
- Teste unitario de troca de responsavel principal.
- Teste de auditoria da transferencia.
- Teste de interface da confirmacao forte.

## 5. Testes Automatizados

### Objetivo

Garantir confiabilidade das regras criticas sem criar uma suite artificial que
so existe para aumentar numero de cobertura.

### Regra de Cobertura

Cobertura deve seguir risco, nao porcentagem.

Areas que sempre exigem teste quando alteradas:

- autenticacao;
- primeiro acesso;
- recuperacao de acesso;
- cadastro de usuarios;
- apoio de gestao;
- necessidades;
- envolvidos;
- resolucao;
- auditoria;
- exportacao/restauracao;
- transferencia de direcao;
- sessao e bloqueio;
- persistencia SQLite.

### Tipos de Teste

- Testes unitarios para regras puras.
- Testes de persistencia para SQLite.
- Testes de exportacao e restauracao CSV.
- Testes de interface para fluxos principais.
- Smoke test desktop quando o Tauri estiver pronto.

### Criterios de Aceite

- Toda regra critica tem pelo menos um teste automatizado.
- Bugs corrigidos recebem teste de regressao quando possivel.
- PR que altera area critica sem teste deve justificar a ausencia.
- Testes devem ser executaveis localmente.
- CI deve rodar o conjunto minimo confiavel.

## 6. Acessibilidade e Linguagem PT-BR

### Objetivo

Fazer o Radar Escola parecer um software de trabalho simples para escola, nao
uma ferramenta tecnica para equipe de TI.

### Regras de Linguagem

- Interface em Portugues Brasileiro.
- Evitar termos como:
  - ticket;
  - chamado;
  - service desk;
  - incidente;
  - workflow;
  - dashboard.
- Preferir linguagem de intencao:
  - Tenho algo para resolver.
  - Quero ver o que esta parado.
  - Quero acompanhar uma necessidade.
  - Quero marcar como resolvido.
- Erros devem explicar o que aconteceu e o que a pessoa pode fazer.
- Confirmacoes devem usar linguagem direta.

### Regras de Acessibilidade

- Fluxos principais devem funcionar com teclado.
- Campos devem ter rotulos claros.
- Botoes devem ter nomes compreensiveis.
- Foco visual deve ser perceptivel.
- Estados vazios devem orientar a proxima acao.
- Contraste deve ser suficiente para leitura em computador de escola.
- Textos nao devem depender apenas de cor para transmitir status.

### Criterios de Aceite

- Pessoa nao tecnica entende o proximo passo em cada tela principal.
- Campos obrigatorios sao claros.
- Erros de validacao aparecem perto do campo.
- Acoes destrutivas ou sensiveis pedem confirmacao.
- Status importantes nao dependem apenas de cor.

### Testes Minimos

- Testes de interface para rotulos e mensagens criticas.
- Testes de navegacao por teclado nos fluxos principais.
- Revisao manual de linguagem antes de fechar telas centrais.
- Checagem visual de contraste quando houver design final.

## 7. Criterios de Aceite do MVP Completo

### Objetivo

Definir quando a V0 deixa de ser apenas scaffold e passa a ser uma entrega
testavel com valor real para uma escola.

### Fluxo Narrativo Obrigatorio

A V0 deve permitir demonstrar:

```text
configurar escola
-> criar direcao
-> cadastrar pessoa
-> primeiro acesso privado da pessoa
-> registrar necessidade
-> ver no Radar de Necessidades
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido pela gestao
-> consultar historico
```

### Criterios de Aceite Globais

- App roda localmente em ambiente de desenvolvimento.
- Existe caminho claro para empacotamento desktop Windows.
- Escola consegue configurar primeiro uso.
- Pessoas conseguem acessar com usuario e senha.
- Senha temporaria `123456` exige troca obrigatoria.
- Necessidade pode ser registrada, acompanhada e resolvida.
- Usuario comum nao marca necessidade como resolvida.
- Direcao ou apoio de gestao marca necessidade como resolvida.
- Historico preserva andamento e resolucao.
- Auditoria registra acoes sensiveis.
- Exportacao/restauracao CSV funciona para direcao.
- Restauracao substitui os dados atuais com confirmacao forte.
- Sessao bloqueia apos inatividade.
- Testes automatizados cobrem os fluxos criticos.
- Documentacao explica como executar, testar e validar.

## Como Transformar em Issues

Cada bloco deve gerar pelo menos:

- uma issue de especificacao detalhada;
- uma issue de implementacao;
- uma issue de testes;
- uma issue de validacao documental ou QA.

Issues de implementacao devem ter:

- escopo pequeno;
- criterio de aceite verificavel;
- testes esperados;
- indicacao de regra relacionada;
- impacto esperado na experiencia da pessoa usuaria.

## Guardrail Final

Blocos transversais nao devem virar desculpa para inflar a V0.

Eles existem para proteger o fluxo principal:

```text
cadastrar pessoa
-> registrar necessidade
-> ver no radar
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido
-> consultar historico
```

Se uma regra transversal nao protege esse fluxo, ela deve ser reavaliada ou
movida para backlog futuro.
