# Detalhamento de Requisitos V1

Este documento detalha os requisitos executaveis do MVP do Radar Escola em
estilo RUP simplificado.

Objetivo: permitir que uma pessoa desenvolvedora junior leia, implemente e teste
um bloco pequeno sem precisar inferir regra de negocio. Tambem deve permitir que
uma pessoa de QA junior valide o comportamento esperado, incluindo cenarios de
erro e excecao.

Este documento nao cria issues reais. Ele prepara o conteudo para a
`MATRIZ_ISSUES_V1.md`.

## Escopo da V1

A V1 detalha o MVP local, desktop e Windows-first do Radar Escola.

O fluxo minimo continua sendo:

```text
cadastrar pessoa
-> registrar necessidade
-> ver no radar
-> marcar envolvidos
-> atualizar andamento
-> marcar como resolvido
-> consultar historico
```

Funcionalidades administrativas entram apenas quando protegem esse fluxo:

- primeiro uso;
- login;
- primeiro acesso com troca de senha;
- salvaguarda local;
- apoio de gestao;
- equipamentos basicos;
- auditoria;
- exportacao/restauracao;
- sessao e bloqueio.

## Atores

### Direcao

Pessoa responsavel principal pela escola no Radar Escola.

Pode:

- configurar a escola no primeiro uso;
- cadastrar pessoas;
- cadastrar cargos/funcoes;
- definir ate duas pessoas como apoio de gestao;
- redefinir senha de usuario comum para `123456`;
- registrar necessidades;
- atualizar andamento;
- marcar envolvidos;
- cancelar/corrigir necessidades;
- marcar necessidades como resolvidas;
- cadastrar equipamentos;
- exportar/restaurar dados de seguranca;
- consultar auditoria;
- transferir direcao.

### Apoio de gestao

Pessoa delegada pela direcao. Limite maximo: duas pessoas alem da direcao.

Pode:

- cadastrar pessoas;
- cadastrar cargos/funcoes;
- registrar necessidades;
- atualizar andamento;
- marcar envolvidos;
- cancelar/corrigir necessidades;
- marcar necessidades como resolvidas;
- cadastrar equipamentos.

Nao pode:

- exportar/restaurar dados de seguranca;
- consultar auditoria;
- transferir direcao;
- redefinir a propria direcao;
- definir outros apoios de gestao, salvo decisao futura.

### Usuario comum

Pessoa cadastrada para acompanhar necessidades.

Pode:

- entrar com usuario e senha;
- trocar senha no primeiro acesso;
- configurar salvaguarda local;
- registrar necessidades;
- consultar o Radar de Necessidades;
- visualizar historico;
- marcar envolvidos quando permitido pela tela;
- atualizar andamento;
- solicitar fechamento tecnico;
- cadastrar equipamento quando o fluxo permitir.

Nao pode:

- marcar necessidade como resolvida;
- cancelar necessidade sem permissao de gestao;
- exportar/restaurar dados;
- consultar auditoria;
- transferir direcao;
- redefinir senha de terceiros.

### Sistema

Ator automatico.

Responsavel por:

- validar campos;
- bloquear sessao por inatividade;
- registrar auditoria;
- preservar historico;
- impedir acoes proibidas;
- aplicar regras de primeiro acesso;
- impedir exposicao de segredos.

## Glossario

- **Necessidade**: algo operacional que a escola precisa resolver.
- **Radar de Necessidades**: tela principal que mostra necessidades em andamento,
  paradas e resolvidas recentemente.
- **Andamento**: registro textual de uma atualizacao feita em uma necessidade.
- **Envolvido**: pessoa cadastrada que deve acompanhar ou agir em uma
  necessidade.
- **Apoio de gestao**: pessoa delegada pela direcao para acoes operacionais de
  gestao.
- **Salvaguarda local**: token ou frase de recuperacao usados sem internet.
- **Token de recuperacao**: codigo exibido uma unica vez durante configuracao da
  salvaguarda.
- **Frase de recuperacao**: pergunta simples escolhida para ajudar recuperacao
  local.
- **Resolvido**: estado final aprovado por direcao ou apoio de gestao.
- **Fechamento tecnico**: sinalizacao de usuario comum dizendo que a necessidade
  parece resolvida, sem encerrar oficialmente.
- **Cancelado**: necessidade registrada por engano ou que nao deve seguir no
  fluxo.

## Matriz de Permissoes

| Acao | Direcao | Apoio de gestao | Usuario comum |
| --- | --- | --- | --- |
| Configurar escola | Sim | Nao | Nao |
| Entrar no sistema | Sim | Sim | Sim |
| Cadastrar cargo/funcao | Sim | Sim | Nao |
| Cadastrar pessoa | Sim | Sim | Nao |
| Redefinir senha de usuario comum | Sim | Nao | Nao |
| Definir apoio de gestao | Sim | Nao | Nao |
| Registrar necessidade | Sim | Sim | Sim |
| Ver Radar de Necessidades | Sim | Sim | Sim |
| Marcar envolvidos | Sim | Sim | Sim |
| Atualizar andamento | Sim | Sim | Sim |
| Solicitar fechamento tecnico | Sim | Sim | Sim |
| Marcar como resolvido | Sim | Sim | Nao |
| Cancelar/corrigir necessidade | Sim | Sim | Solicitar correcao |
| Consultar historico | Sim | Sim | Sim |
| Cadastrar equipamento | Sim | Sim | Sim |
| Exportar/restaurar seguranca | Sim | Nao | Nao |
| Consultar auditoria | Sim | Nao | Nao |
| Transferir direcao | Sim | Nao | Nao |
| Sair da conta | Sim | Sim | Sim |

## Padrao de Caso de Uso

Cada caso de uso usa este formato:

- **Objetivo**: resultado esperado para a pessoa usuaria.
- **Atores**: quem participa.
- **Pre-condicoes**: o que precisa existir antes.
- **Pos-condicoes**: o que deve ser verdade depois.
- **Fluxo principal**: caminho feliz.
- **Fluxos alternativos**: caminhos validos diferentes.
- **Fluxos de excecao**: erros, bloqueios e guardrails acionados.
- **Regras de negocio**: regras testaveis.
- **Mensagens de UX**: textos ou intencoes de texto.
- **Criterios de aceite**: validacao objetiva.
- **Testes minimos**: testes esperados.
- **Issues minimas sugeridas**: blocos pequenos para futura matriz.

## UC-001 Configurar escola no primeiro uso

### Objetivo

Criar a configuracao local inicial para que a escola possa usar o Radar Escola.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Banco local esta vazio ou sem escola configurada.
- Aplicativo foi aberto pela primeira vez.

### Pos-condicoes

- Escola cadastrada.
- Direcao criada.
- Conta da direcao criada.
- Salvaguarda da direcao configurada.
- Usuario entra no Radar de Necessidades.

### Fluxo principal

1. Sistema detecta ausencia de escola configurada.
2. Sistema exibe tela de boas-vindas simples.
3. Direcao informa nome da escola.
4. Direcao informa seu nome.
5. Direcao escolhe usuario.
6. Direcao cria senha.
7. Sistema orienta sobre importancia de guardar acesso e salvaguarda.
8. Sistema gera token de recuperacao.
9. Direcao define frase e resposta de recuperacao.
10. Sistema salva escola, pessoa, conta, salvaguarda e auditoria inicial.
11. Sistema leva direcao ao Radar de Necessidades.

### Fluxos alternativos

- Nome da escola pode ser editado antes de concluir.
- Direcao pode voltar etapas antes de confirmar.

### Fluxos de excecao

- Nome da escola vazio: bloquear avancar e mostrar mensagem.
- Usuario vazio ou ja reservado: bloquear criacao.
- Senha fraca ou vazia: bloquear criacao.
- Erro ao salvar banco local: exibir erro claro e permitir tentar novamente.

### Regras de negocio

- Deve existir apenas uma escola ativa na V1.
- Primeira pessoa criada deve ser direcao.
- Senha deve ser armazenada apenas como hash.
- Token deve ser exibido no momento de configuracao.
- Resposta de recuperacao nao deve ser salva em texto claro.

### Mensagens de UX

- "Guarde seu usuario, senha e salvaguarda em local seguro."
- "Se essas informacoes forem perdidas, o acesso administrativo pode ser
  perdido."
- "O token sera exibido apenas agora."

### Criterios de aceite

- Escola e direcao sao criadas no primeiro uso.
- Apos concluir, o Radar de Necessidades abre.
- Senha nao aparece em texto claro no banco.
- Token e exibido uma vez durante configuracao.

### Testes minimos

- Criacao inicial com dados validos.
- Bloqueio de campos obrigatorios.
- Persistencia da escola e direcao.
- Hash de senha.
- Registro de auditoria inicial.

### Issues minimas sugeridas

- Requisito: validar fluxo de primeiro uso.
- Model: modelar escola e direcao inicial.
- Persistencia: criar tabelas iniciais de escola, pessoa e conta.
- Application: implementar caso de uso de configuracao inicial.
- View: criar tela de primeiro uso.
- QA: validar primeiro uso feliz e erros de campos.

## UC-002 Entrar com usuario e senha

### Objetivo

Permitir que pessoa cadastrada acesse o Radar Escola.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Escola configurada.
- Conta de usuario ativa.

### Pos-condicoes

- Sessao ativa para a conta autenticada.
- Usuario chega ao destino adequado.

### Fluxo principal

1. Usuario abre aplicativo.
2. Sistema exibe tela de login.
3. Usuario informa usuario e senha.
4. Sistema valida credenciais.
5. Sistema verifica se a conta exige primeiro acesso.
6. Se nao exigir, sistema cria sessao local.
7. Sistema abre Radar de Necessidades.

### Fluxos alternativos

- Se conta exige primeiro acesso, redirecionar para UC-003.
- Se sessao anterior estava bloqueada, redirecionar para desbloqueio.

### Fluxos de excecao

- Usuario inexistente: mostrar erro generico.
- Senha incorreta: mostrar erro generico.
- Conta inativa: bloquear acesso.
- Banco indisponivel: mostrar erro operacional.

### Regras de negocio

- Erro de login nao deve revelar se usuario existe.
- Senha deve ser comparada por hash.
- Conta com senha temporaria nao entra no Radar antes de trocar senha.

### Mensagens de UX

- "Usuario ou senha invalidos."
- "Antes de continuar, voce precisa trocar sua senha inicial."

### Criterios de aceite

- Login valido cria sessao.
- Login invalido nao cria sessao.
- Primeiro acesso redireciona para troca de senha.

### Testes minimos

- Login valido.
- Login invalido.
- Conta inativa.
- Conta em primeiro acesso.

### Issues minimas sugeridas

- Model: regra de autenticacao.
- Application: caso de uso de login.
- View: tela de login.
- QA: cenarios de login.

## UC-003 Fazer primeiro acesso com senha temporaria

### Objetivo

Obrigar pessoa cadastrada com senha `123456` a criar senha propria e
salvaguarda privada antes de usar o sistema.

### Atores

- Usuario comum.
- Apoio de gestao.
- Sistema.

### Pre-condicoes

- Pessoa foi cadastrada com senha temporaria.
- Conta esta marcada como primeiro acesso.
- Usuario autenticou com a senha temporaria.

### Pos-condicoes

- Senha temporaria substituida.
- Salvaguarda local configurada.
- Conta deixa estado de primeiro acesso.
- Usuario entra no Radar de Necessidades.

### Fluxo principal

1. Sistema informa que o primeiro acesso deve ser privado.
2. Usuario cria nova senha.
3. Usuario confirma nova senha.
4. Sistema gera token de recuperacao.
5. Usuario escolhe frase de recuperacao.
6. Usuario informa resposta.
7. Sistema orienta a anotar token e apagar foto temporaria se houver.
8. Usuario confirma que guardou a salvaguarda.
9. Sistema salva senha com hash, salvaguarda e remove estado de primeiro acesso.
10. Sistema abre Radar de Necessidades.

### Fluxos alternativos

- Usuario pode cancelar e voltar ao login.
- Usuario pode escolher apenas token ou frase conforme regra final do dominio,
  desde que pelo menos uma salvaguarda valida exista.

### Fluxos de excecao

- Nova senha igual a `123456`: bloquear.
- Senha e confirmacao diferentes: bloquear.
- Frase sem resposta: bloquear.
- Tentativa de pular salvaguarda: bloquear.

### Regras de negocio

- Direcao nao deve ver nova senha, token, frase ou resposta.
- Token nao deve ser regenerado depois.
- Resposta da frase nao deve ser salva em texto claro.
- Primeiro acesso deve terminar antes de qualquer uso normal.

### Mensagens de UX

- "Este passo deve ser feito em privacidade."
- "Nao mostre sua nova senha nem sua salvaguarda para outra pessoa."
- "Anote o token em local seguro. Ele nao sera exibido novamente."

### Criterios de aceite

- Conta com primeiro acesso nao entra no Radar sem trocar senha.
- Senha temporaria nao pode continuar como senha normal.
- Salvaguarda e obrigatoria.
- Token nao reaparece em consulta normal.

### Testes minimos

- Primeiro acesso completo.
- Bloqueio de senha temporaria repetida.
- Bloqueio de salvaguarda ausente.
- Privacidade dos dados de recuperacao.

### Issues minimas sugeridas

- Requisito: validar privacidade do primeiro acesso.
- Model: estado de primeiro acesso.
- Application: troca obrigatoria de senha.
- View: tela de primeiro acesso.
- QA: validar bloqueios e mensagens.

## UC-004 Recuperar acesso por salvaguarda local

### Objetivo

Permitir recuperacao local de acesso sem e-mail e sem internet, quando usuario
lembra nome/usuario e salvaguarda.

### Atores

- Direcao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Conta existe.
- Salvaguarda foi configurada.

### Pos-condicoes

- Usuario consegue definir nova senha quando salvaguarda e valida.
- Evento sensivel e registrado quando aplicavel.

### Fluxo principal

1. Usuario escolhe "Esqueci meu acesso".
2. Sistema pede usuario ou nome.
3. Sistema apresenta opcoes de recuperacao disponiveis.
4. Usuario informa token ou resposta da frase.
5. Sistema valida salvaguarda.
6. Sistema permite criar nova senha.
7. Sistema salva nova senha com hash.
8. Sistema orienta fazer login novamente.

### Fluxos alternativos

- Usuario comum sem salvaguarda pode procurar direcao para reset
  administrativo.
- Direcao sem salvaguarda deve receber mensagem sobre risco de perda de acesso
  e procedimento tecnico futuro, se houver.

### Fluxos de excecao

- Usuario nao encontrado: mensagem generica.
- Token invalido: bloquear recuperacao.
- Resposta incorreta: bloquear recuperacao.
- Nova senha invalida: bloquear.

### Regras de negocio

- Recuperacao nao usa e-mail.
- Recuperacao nao depende de internet.
- Token nao deve ser exibido novamente.
- Resposta deve ser comparada por hash ou mecanismo equivalente.

### Mensagens de UX

- "Nao foi possivel recuperar com essas informacoes."
- "Se voce perdeu senha e salvaguarda, procure a direcao."

### Criterios de aceite

- Token valido permite redefinir senha.
- Resposta valida permite redefinir senha.
- Dados invalidos nao revelam informacoes sensiveis.

### Testes minimos

- Recuperacao por token.
- Recuperacao por frase.
- Tentativas invalidas.
- Senha redefinida como hash.

### Issues minimas sugeridas

- Model: regras de salvaguarda.
- Application: recuperar acesso.
- View: tela de recuperacao.
- QA: cenarios positivos e negativos.

## UC-005 Cadastrar cargo ou funcao

### Objetivo

Permitir organizar pessoas por cargo ou funcao sem criar perfil complexo.

### Atores

- Direcao.
- Apoio de gestao.
- Sistema.

### Pre-condicoes

- Usuario autenticado com permissao.

### Pos-condicoes

- Cargo/funcao disponivel para cadastro de pessoa.

### Fluxo principal

1. Usuario acessa cadastro de cargos/funcoes.
2. Informa nome do cargo ou funcao.
3. Sistema valida duplicidade.
4. Sistema salva cargo/funcao ativo.
5. Sistema mostra cargo/funcao na lista.

### Fluxos alternativos

- Durante cadastro de pessoa, se cargo nao existir, usuario cria cargo na hora e
  retorna ao formulario de pessoa com cargo selecionado.

### Fluxos de excecao

- Nome vazio: bloquear.
- Nome duplicado: bloquear ou orientar usar existente.
- Usuario sem permissao: bloquear.

### Regras de negocio

- Cargo/funcao organiza pessoas, mas nao cria permissao complexa.
- Permissoes especiais dependem de direcao ou apoio de gestao, nao do texto do
  cargo.

### Mensagens de UX

- "Esse cargo ou funcao ja existe."
- "Cargo ou funcao ajuda a organizar pessoas, nao altera permissoes por si so."

### Criterios de aceite

- Direcao cadastra cargo.
- Apoio de gestao cadastra cargo.
- Usuario comum nao cadastra cargo.
- Cargo criado durante cadastro de pessoa fica selecionado.

### Testes minimos

- Criacao valida.
- Duplicidade.
- Permissao.
- Fluxo embutido no cadastro de pessoa.

### Issues minimas sugeridas

- Model: entidade cargo.
- Persistencia: CRUD de cargo ativo.
- View: fluxo embutido de novo cargo.
- QA: validar excecao de cargo ausente.

## UC-006 Cadastrar pessoa ou usuario

### Objetivo

Permitir que direcao ou apoio de gestao cadastre pessoas que poderao acompanhar
necessidades.

### Atores

- Direcao.
- Apoio de gestao.
- Sistema.

### Pre-condicoes

- Escola configurada.
- Usuario autenticado com permissao.
- Cargo/funcao existe ou sera criado no fluxo.

### Pos-condicoes

- Pessoa cadastrada.
- Conta criada com senha temporaria `123456`.
- Conta marcada como primeiro acesso.

### Fluxo principal

1. Usuario abre cadastro de pessoa.
2. Informa nome.
3. Informa usuario de acesso.
4. Seleciona cargo/funcao.
5. Sistema informa que senha inicial sera `123456`.
6. Usuario confirma cadastro.
7. Sistema cria pessoa ativa.
8. Sistema cria conta com hash da senha temporaria.
9. Sistema marca conta como primeiro acesso.
10. Sistema registra auditoria.

### Fluxos alternativos

- Cargo/funcao nao existe: criar cargo no fluxo e continuar.
- Usuario pode cadastrar pessoa sem marcar como apoio de gestao.

### Fluxos de excecao

- Nome vazio: bloquear.
- Usuario vazio: bloquear.
- Usuario duplicado: bloquear.
- Cargo ausente: pedir selecao ou criacao.
- Usuario comum tenta cadastrar: bloquear.

### Regras de negocio

- Senha temporaria so vale para primeiro acesso.
- Pessoa cadastrada deve trocar senha antes de usar sistema.
- Direcao nao deve definir nem ver senha final da pessoa.

### Mensagens de UX

- "A senha inicial sera 123456 e devera ser trocada no primeiro acesso."
- "A pessoa deve fazer o primeiro acesso em privacidade."

### Criterios de aceite

- Pessoa cadastrada aparece na lista.
- Conta criada exige primeiro acesso.
- Usuario duplicado nao e permitido.
- Auditoria registra cadastro.

### Testes minimos

- Cadastro valido.
- Usuario duplicado.
- Cargo criado no fluxo.
- Auditoria de cadastro.

### Issues minimas sugeridas

- Model: pessoa e conta.
- Application: cadastrar pessoa.
- View: formulario de pessoa.
- QA: cadastro e primeiro acesso.

## UC-007 Definir apoio de gestao

### Objetivo

Permitir que direcao delegue acoes operacionais para ate duas pessoas.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Direcao autenticada.
- Pessoa candidata ja cadastrada.

### Pos-condicoes

- Pessoa passa a ter delegacao de apoio de gestao.
- Auditoria registra definicao.

### Fluxo principal

1. Direcao acessa lista de pessoas.
2. Seleciona pessoa.
3. Escolhe definir como apoio de gestao.
4. Sistema mostra explicacao das permissoes delegadas.
5. Direcao confirma.
6. Sistema valida limite de ate duas pessoas.
7. Sistema salva delegacao.
8. Sistema registra auditoria.

### Fluxos alternativos

- Direcao pode remover delegacao existente.
- Direcao pode substituir apoio de gestao removendo um antes de adicionar outro.

### Fluxos de excecao

- Ja existem dois apoios ativos: bloquear novo apoio.
- Usuario comum tenta definir apoio: bloquear.
- Apoio de gestao tenta definir outro apoio: bloquear.
- Pessoa inativa: bloquear.

### Regras de negocio

- Limite maximo: duas pessoas alem da direcao.
- Delegacao e unica: cadastrar usuarios, corrigir/cancelar necessidades e
  marcar como resolvido.
- Delegacao nao inclui exportacao, restauracao, auditoria ou transferencia de
  direcao.

### Mensagens de UX

- "Apoio de gestao podera cadastrar pessoas e marcar necessidades como
  resolvidas."
- "Apoio de gestao nao acessa auditoria nem exportacao de seguranca."
- "O limite de dois apoios de gestao ja foi atingido."

### Criterios de aceite

- Direcao define apoio quando ha vaga.
- Terceiro apoio e bloqueado.
- Apoio nao recebe permissoes exclusivas da direcao.
- Auditoria registra alteracao.

### Testes minimos

- Definir apoio.
- Bloquear terceiro apoio.
- Bloquear usuario sem permissao.
- Auditoria.

### Issues minimas sugeridas

- Model: delegacao de apoio.
- Application: definir/remover apoio.
- View: controle de apoio na pessoa.
- QA: limite e permissoes.

## UC-008 Registrar necessidade

### Objetivo

Registrar uma necessidade operacional da escola em linguagem simples.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Usuario autenticado.

### Pos-condicoes

- Necessidade criada.
- Necessidade aparece no Radar.
- Historico inicial criado.

### Fluxo principal

1. Usuario escolhe "Tenho algo para resolver".
2. Sistema abre formulario de necessidade.
3. Usuario informa titulo.
4. Usuario informa descricao.
5. Usuario informa local.
6. Usuario escolhe prioridade.
7. Usuario seleciona envolvidos, se ja souber.
8. Usuario vincula equipamento, se existir.
9. Usuario salva.
10. Sistema cria necessidade com status `nova`.
11. Sistema cria andamento inicial.
12. Sistema mostra necessidade no Radar.

### Fluxos alternativos

- Necessidade pode ser criada sem equipamento.
- Envolvidos podem ser adicionados depois.
- Prioridade pode assumir valor padrao `normal`.

### Fluxos de excecao

- Titulo vazio: bloquear.
- Descricao vazia: bloquear ou pedir resumo minimo.
- Local vazio: bloquear se definido como obrigatorio final.
- Prioridade invalida: bloquear.
- Equipamento inexistente: pedir selecionar outro ou criar equipamento.

### Regras de negocio

- Necessidade nao deve conter dados identificaveis de estudante.
- Status inicial: `nova`.
- Criacao deve preservar autor e data.
- Criacao deve gerar historico.

### Mensagens de UX

- "Descreva o que sua escola precisa resolver."
- "Evite informar nomes de estudantes."
- "Voce pode adicionar envolvidos depois."

### Criterios de aceite

- Necessidade valida aparece no Radar.
- Campos obrigatorios sao validados.
- Historico inicial e criado.
- Dados de estudante sao desencorajados pela interface.

### Testes minimos

- Criacao valida.
- Campos obrigatorios.
- Necessidade sem equipamento.
- Historico inicial.

### Issues minimas sugeridas

- Model: entidade necessidade.
- Application: registrar necessidade.
- Persistencia: insert e query inicial.
- View: formulario de necessidade.
- QA: criacao e validacoes.

## UC-009 Ver Radar de Necessidades

### Objetivo

Mostrar o que a escola precisa acompanhar agora.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Usuario autenticado.

### Pos-condicoes

- Usuario visualiza necessidades organizadas por situacao.

### Fluxo principal

1. Usuario entra no sistema.
2. Sistema carrega necessidades ativas.
3. Sistema separa em andamento e paradas.
4. Sistema carrega resolvidas recentemente.
5. Sistema exibe lista ou cards com informacoes essenciais.
6. Usuario abre detalhe de uma necessidade.

### Fluxos alternativos

- Sem necessidades: mostrar estado vazio com acao para registrar.
- Sem paradas: mostrar mensagem tranquila, sem ocupar espaco demais.
- Sem resolvidas recentes: ocultar secao ou exibir estado simples.

### Fluxos de excecao

- Erro ao consultar banco: mostrar erro operacional.
- Sessao expirada/bloqueada: redirecionar para desbloqueio.

### Regras de negocio

- Todo usuario autenticado pode ver necessidades.
- Necessidades canceladas nao aparecem como ativas.
- Necessidades resolvidas aparecem em secao recente por periodo definido.
- Necessidades paradas devem ficar visiveis.

### Mensagens de UX

- "Veja o que sua escola precisa resolver."
- "Nada parado agora."
- "Nenhuma necessidade registrada ainda."

### Criterios de aceite

- Necessidades ativas aparecem.
- Necessidades paradas sao destacadas.
- Resolvidas recentes aparecem separadas.
- Estado vazio orienta proxima acao.

### Testes minimos

- Radar com necessidades.
- Radar vazio.
- Classificacao de parada.
- Resolvidas recentes.

### Issues minimas sugeridas

- Query: buscar radar.
- Application: montar visao do radar.
- View: tela Radar de Necessidades.
- QA: estados do radar.

## UC-010 Marcar envolvidos

### Objetivo

Indicar pessoas cadastradas que devem acompanhar uma necessidade.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe e nao esta resolvida/cancelada.
- Pessoas cadastradas existem.

### Pos-condicoes

- Envolvidos vinculados a necessidade.
- Historico registra alteracao relevante.

### Fluxo principal

1. Usuario abre detalhe da necessidade.
2. Escolhe alterar envolvidos.
3. Sistema lista pessoas ativas.
4. Usuario seleciona uma ou mais pessoas.
5. Sistema salva vinculos.
6. Sistema registra historico da alteracao.

### Fluxos alternativos

- Usuario remove envolvido.
- Usuario salva sem envolvidos, se a regra permitir.

### Fluxos de excecao

- Pessoa inativa: nao permitir selecionar.
- Necessidade resolvida: bloquear alteracao ou exigir reabertura futura fora da
  V1.
- Necessidade cancelada: bloquear.

### Regras de negocio

- Envolvido deve ser pessoa cadastrada.
- Nao ha notificacao externa.
- Envolvido acompanha entrando no computador com usuario e senha.

### Mensagens de UX

- "Selecione quem deve acompanhar esta necessidade."
- "As pessoas envolvidas devem consultar o Radar Escola neste computador."

### Criterios de aceite

- Envolvidos selecionados aparecem no detalhe.
- Pessoas inativas nao aparecem.
- Alteracao aparece no historico.

### Testes minimos

- Adicionar envolvido.
- Remover envolvido.
- Bloquear pessoa inativa.
- Historico de alteracao.

### Issues minimas sugeridas

- Model: vinculo necessidade-pessoa.
- Application: marcar envolvidos.
- View: seletor de envolvidos.
- QA: inclusao/remocao.

## UC-011 Atualizar andamento

### Objetivo

Registrar o que aconteceu com a necessidade para manter memoria operacional.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe.
- Necessidade nao esta resolvida/cancelada.
- Usuario autenticado.

### Pos-condicoes

- Andamento registrado.
- Necessidade atualizada.
- Historico exibe andamento.

### Fluxo principal

1. Usuario abre detalhe da necessidade.
2. Escolhe registrar andamento.
3. Informa texto do andamento.
4. Opcionalmente altera status operacional.
5. Sistema valida texto e status.
6. Sistema salva andamento.
7. Sistema atualiza data de ultima movimentacao.
8. Sistema mostra andamento no historico.

### Fluxos alternativos

- Usuario informa que problema parece tecnicamente resolvido, acionando
  solicitacao de fechamento tecnico.
- Usuario altera status para `aguardando material` ou `aguardando autorizacao`.

### Fluxos de excecao

- Texto vazio: bloquear.
- Status invalido: bloquear.
- Necessidade resolvida/cancelada: bloquear andamento.

### Regras de negocio

- Andamento deve ter autor e data.
- Andamento nao fecha necessidade sozinho.
- Usuario comum pode registrar resolucao tecnica, mas nao marcar como resolvida.

### Mensagens de UX

- "Conte o que mudou ou foi tentado."
- "Isso registra o andamento, mas nao encerra a necessidade."

### Criterios de aceite

- Andamento aparece no historico.
- Autor e data aparecem.
- Usuario comum nao encerra necessidade por andamento.

### Testes minimos

- Registrar andamento.
- Bloquear texto vazio.
- Atualizar ultima movimentacao.
- Solicitar fechamento tecnico.

### Issues minimas sugeridas

- Model: andamento.
- Application: registrar andamento.
- View: formulario de andamento.
- QA: andamento e historico.

## UC-012 Registrar plano de acao simples

### Objetivo

Permitir combinar proximos passos sem criar gerenciador complexo de tarefas.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe e esta ativa.

### Pos-condicoes

- Plano de acao simples associado a necessidade.

### Fluxo principal

1. Usuario abre necessidade.
2. Escolhe adicionar item de plano.
3. Informa descricao do passo.
4. Opcionalmente informa responsavel.
5. Sistema salva item em aberto.
6. Sistema mostra item no detalhe.

### Fluxos alternativos

- Usuario marca item como concluido.
- Usuario edita texto simples de item ainda ativo.

### Fluxos de excecao

- Descricao vazia: bloquear.
- Necessidade encerrada: bloquear novo item.

### Regras de negocio

- Plano de acao e simples.
- Nao tem prazo complexo, calendario, alerta ou notificacao na V1.
- Item concluido deve preservar autor/data quando possivel.

### Mensagens de UX

- "Combine um proximo passo."
- "Sem notificacoes automaticas nesta versao."

### Criterios de aceite

- Item aparece no detalhe.
- Item pode ser marcado como concluido.
- Necessidade resolvida nao aceita novo item.

### Testes minimos

- Criar item.
- Concluir item.
- Bloquear item vazio.

### Issues minimas sugeridas

- Model: item de plano.
- Application: manter plano simples.
- View: lista de proximos passos.
- QA: criacao/conclusao.

## UC-013 Solicitar fechamento tecnico

### Objetivo

Permitir que usuario comum indique que a necessidade parece resolvida, sem
encerrar oficialmente.

### Atores

- Usuario comum.
- Direcao.
- Apoio de gestao.
- Sistema.

### Pre-condicoes

- Necessidade ativa.

### Pos-condicoes

- Necessidade sinalizada para revisao de gestao.
- Historico registra solicitacao.

### Fluxo principal

1. Usuario abre necessidade.
2. Escolhe informar que parece resolvida.
3. Sistema pede descricao do que foi feito.
4. Usuario informa descricao.
5. Sistema registra andamento de fechamento tecnico.
6. Sistema destaca necessidade para revisao da gestao.

### Fluxos alternativos

- Direcao ou apoio pode converter solicitacao em resolucao oficial.
- Direcao ou apoio pode registrar que ainda precisa continuar.

### Fluxos de excecao

- Texto vazio: bloquear.
- Necessidade cancelada/resolvida: bloquear.

### Regras de negocio

- Solicitacao tecnica nao altera status final para `resolvida`.
- Somente direcao/apoio encerram oficialmente.

### Mensagens de UX

- "A gestao ainda precisa marcar como resolvido."
- "Descreva o que foi feito."

### Criterios de aceite

- Usuario comum consegue solicitar fechamento.
- Necessidade continua nao resolvida ate gestao confirmar.
- Historico mostra solicitacao.

### Testes minimos

- Solicitacao por usuario comum.
- Conversao por gestao.
- Bloqueio sem descricao.

### Issues minimas sugeridas

- Model: estado de fechamento tecnico.
- Application: solicitar fechamento.
- View: acao de solicitar fechamento.
- QA: usuario comum nao encerra.

## UC-014 Marcar necessidade como resolvida

### Objetivo

Encerrar oficialmente uma necessidade com validacao da gestao.

### Atores

- Direcao.
- Apoio de gestao.
- Sistema.

### Pre-condicoes

- Necessidade ativa.
- Usuario tem permissao de gestao.

### Pos-condicoes

- Necessidade fica resolvida.
- Historico preserva resolucao.
- Auditoria registra acao.

### Fluxo principal

1. Direcao ou apoio abre necessidade.
2. Escolhe marcar como resolvida.
3. Sistema pede descricao da solucao.
4. Usuario informa solucao.
5. Sistema mostra confirmacao.
6. Usuario confirma.
7. Sistema altera status para `resolvida`.
8. Sistema salva data, autor e descricao de resolucao.
9. Sistema registra historico e auditoria.
10. Necessidade sai das ativas e aparece em resolvidas recentes.

### Fluxos alternativos

- Se havia fechamento tecnico solicitado, sistema mostra essa informacao na
  confirmacao.
- Usuario pode cancelar confirmacao e voltar ao detalhe.

### Fluxos de excecao

- Usuario comum tenta resolver: bloquear.
- Descricao vazia: bloquear.
- Necessidade cancelada: bloquear.
- Necessidade ja resolvida: informar estado atual.

### Regras de negocio

- Resolucao passa pelo olhar da gestao.
- Resolucao nao deve apagar andamentos anteriores.
- Resolucao deve gerar auditoria.

### Mensagens de UX

- "Marcar como resolvido encerra esta necessidade."
- "A solucao ficara registrada no historico."
- "Apenas direcao ou apoio de gestao podem fazer isso."

### Criterios de aceite

- Direcao resolve.
- Apoio resolve.
- Usuario comum nao resolve.
- Resolucao aparece no historico.
- Auditoria e registrada.

### Testes minimos

- Resolver com direcao.
- Resolver com apoio.
- Bloquear usuario comum.
- Auditoria e historico.

### Issues minimas sugeridas

- Model: transicao para resolvida.
- Application: marcar resolvida.
- View: confirmacao de resolucao.
- QA: permissoes de resolucao.

## UC-015 Cancelar ou corrigir necessidade

### Objetivo

Permitir corrigir erro de cadastro ou cancelar necessidade registrada por
engano, preservando memoria operacional.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe.

### Pos-condicoes

- Necessidade corrigida ou cancelada.
- Historico registra alteracao.
- Auditoria registra cancelamento.

### Fluxo principal de correcao

1. Usuario com permissao abre necessidade.
2. Escolhe corrigir dados.
3. Altera campos permitidos.
4. Sistema valida alteracoes.
5. Sistema salva e registra historico.

### Fluxo principal de cancelamento

1. Direcao ou apoio abre necessidade.
2. Escolhe cancelar.
3. Sistema pede motivo.
4. Usuario informa motivo.
5. Sistema mostra confirmacao.
6. Usuario confirma.
7. Sistema muda status para `cancelada`.
8. Sistema registra historico e auditoria.

### Fluxos alternativos

- Usuario comum pode solicitar correcao por andamento, sem alterar campos
  sensiveis.

### Fluxos de excecao

- Usuario comum tenta cancelar: bloquear.
- Motivo vazio: bloquear.
- Necessidade resolvida: bloquear cancelamento ou exigir regra futura.

### Regras de negocio

- Delete fisico deve ser evitado.
- Cancelamento preserva historico.
- Correcao relevante deve ficar rastreavel.

### Mensagens de UX

- "Cancelar remove esta necessidade do acompanhamento ativo, mas preserva o
  historico."
- "Informe o motivo do cancelamento."

### Criterios de aceite

- Direcao cancela com motivo.
- Apoio cancela com motivo.
- Usuario comum nao cancela.
- Cancelada nao aparece nas ativas.

### Testes minimos

- Corrigir dados permitidos.
- Cancelar com gestao.
- Bloquear usuario comum.
- Historico e auditoria.

### Issues minimas sugeridas

- Model: cancelamento.
- Application: corrigir/cancelar.
- View: confirmacao de cancelamento.
- QA: cancelamento e rastreabilidade.

## UC-016 Consultar historico

### Objetivo

Permitir que a escola veja o que aconteceu com uma necessidade.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe.

### Pos-condicoes

- Historico exibido sem alterar dados.

### Fluxo principal

1. Usuario abre detalhe da necessidade.
2. Sistema carrega andamentos, envolvidos, plano e resolucao.
3. Sistema mostra eventos em ordem cronologica.
4. Usuario consulta informacoes.

### Fluxos alternativos

- Historico de necessidade resolvida mostra solucao final.
- Historico de cancelada mostra motivo do cancelamento.

### Fluxos de excecao

- Necessidade inexistente: mostrar mensagem.
- Erro de leitura: mostrar erro operacional.

### Regras de negocio

- Todos usuarios autenticados podem consultar historico de necessidades.
- Historico nao mostra segredos.
- Historico e diferente de auditoria administrativa.

### Mensagens de UX

- "Historico da necessidade."
- "Ainda nao ha atualizacoes alem do registro inicial."

### Criterios de aceite

- Historico mostra andamentos.
- Resolucao aparece.
- Cancelamento aparece.
- Auditoria administrativa nao aparece para usuario comum.

### Testes minimos

- Historico de ativa.
- Historico de resolvida.
- Historico de cancelada.

### Issues minimas sugeridas

- Query: historico da necessidade.
- View: timeline/historico.
- QA: consulta por perfis.

## UC-017 Cadastrar equipamento

### Objetivo

Cadastrar equipamento basico para vinculo com necessidades.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Usuario autenticado.

### Pos-condicoes

- Equipamento cadastrado e disponivel para vinculo.

### Fluxo principal

1. Usuario abre cadastro de equipamento.
2. Informa nome.
3. Informa local.
4. Informa patrimonio ou identificacao, se houver.
5. Informa estado atual.
6. Informa observacoes opcionais.
7. Sistema valida e salva.

### Fluxos alternativos

- Durante registro de necessidade, usuario pode criar equipamento simples e
  voltar ao formulario.

### Fluxos de excecao

- Nome vazio: bloquear.
- Local vazio: bloquear se definido como obrigatorio final.
- Identificacao duplicada: alertar e pedir confirmacao ou bloquear conforme
  regra final.

### Regras de negocio

- Equipamento nao e patrimonio completo.
- Vinculo com necessidade e opcional.
- Equipamento com historico nao deve sumir sem cuidado.

### Mensagens de UX

- "Cadastro simples para ajudar a encontrar historico de problemas."

### Criterios de aceite

- Equipamento cadastrado aparece na lista.
- Equipamento pode ser vinculado a necessidade.
- Campos obrigatorios validados.

### Testes minimos

- Cadastro valido.
- Campos obrigatorios.
- Duplicidade de identificacao.

### Issues minimas sugeridas

- Model: equipamento.
- Persistencia: equipamento.
- View: cadastro simples.
- QA: equipamento e vinculo.

## UC-018 Vincular equipamento a necessidade

### Objetivo

Relacionar necessidade a equipamento para facilitar historico recorrente.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Necessidade existe.
- Equipamento existe.

### Pos-condicoes

- Necessidade referencia equipamento.

### Fluxo principal

1. Usuario abre necessidade.
2. Escolhe vincular equipamento.
3. Sistema lista equipamentos.
4. Usuario seleciona equipamento.
5. Sistema salva vinculo.
6. Sistema registra historico.

### Fluxos alternativos

- Usuario remove vinculo quando foi marcado por engano.
- Usuario cria equipamento durante o fluxo.

### Fluxos de excecao

- Equipamento inativo: bloquear.
- Necessidade resolvida/cancelada: bloquear alteracao.

### Regras de negocio

- Uma necessidade pode ter zero ou um equipamento na V1.
- Equipamento pode ter varias necessidades ao longo do tempo.

### Mensagens de UX

- "Vincule apenas se isso ajudar a entender o problema."

### Criterios de aceite

- Vinculo aparece no detalhe.
- Historico preserva alteracao.
- Consultas futuras podem filtrar por equipamento.

### Testes minimos

- Vincular.
- Remover vinculo.
- Criar equipamento no fluxo.

### Issues minimas sugeridas

- Application: vincular equipamento.
- Query: necessidades por equipamento.
- View: seletor de equipamento.
- QA: vinculo opcional.

## UC-019 Exportar dados de seguranca

### Objetivo

Permitir que direcao gere copia de seguranca restauravel e legivel.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Direcao autenticada.
- Banco local acessivel.

### Pos-condicoes

- Arquivos CSV gerados.
- Auditoria registra exportacao.

### Fluxo principal

1. Direcao acessa area de seguranca.
2. Escolhe exportar dados.
3. Sistema explica que arquivo deve ser salvo fora do computador principal.
4. Direcao escolhe destino.
5. Sistema gera CSVs com dados restauraveis.
6. Sistema inclui hashes de senha, nunca senhas em texto claro.
7. Sistema registra auditoria.
8. Sistema informa sucesso.

### Fluxos alternativos

- Direcao cancela escolha de destino.
- Sistema permite exportar novamente.

### Fluxos de excecao

- Usuario sem permissao: bloquear.
- Destino indisponivel: mostrar erro e permitir tentar outro.
- Erro de escrita: mostrar erro.

### Regras de negocio

- Exportacao e exclusiva da direcao.
- Apoio de gestao nao exporta.
- CSV deve permitir restauracao.
- CSV nao deve incluir senha em texto claro.

### Mensagens de UX

- "Salve esta copia em pendrive, pasta de rede ou outra maquina."
- "Esta exportacao contem dados de acesso com senhas protegidas por hash."

### Criterios de aceite

- Direcao exporta.
- Apoio e usuario comum nao exportam.
- CSVs contem dados essenciais.
- Senhas em texto claro nao aparecem.
- Auditoria registrada.

### Testes minimos

- Exportacao valida.
- Bloqueio por perfil.
- Conteudo sem senha clara.
- Erro de caminho.

### Issues minimas sugeridas

- Application: exportar seguranca.
- Infra: gerar CSVs.
- View: fluxo de exportacao.
- QA: validar arquivo e permissao.

## UC-020 Restaurar dados de seguranca

### Objetivo

Permitir restaurar dados exportados pelo proprio Radar Escola, substituindo os
dados locais atuais.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Direcao autenticada.
- Arquivos CSV validos disponiveis.

### Pos-condicoes

- Dados atuais substituidos pelos dados importados.
- Auditoria ou registro de restauracao preservado quando possivel.

### Fluxo principal

1. Direcao acessa area de seguranca.
2. Escolhe restaurar dados.
3. Sistema explica que restauracao substitui dados atuais.
4. Direcao seleciona arquivos CSV.
5. Sistema valida estrutura e origem esperada.
6. Sistema mostra confirmacao forte.
7. Direcao confirma.
8. Sistema substitui dados locais.
9. Sistema informa sucesso e pede novo login se necessario.

### Fluxos alternativos

- Direcao cancela antes de confirmar.
- Sistema pode criar copia tecnica temporaria antes de substituir, se simples e
  local.

### Fluxos de excecao

- Usuario sem permissao: bloquear.
- CSV invalido: bloquear.
- CSV incompleto: bloquear.
- Erro durante restauracao: informar falha e preservar estado anterior quando
  tecnicamente possivel.

### Regras de negocio

- Restauracao sempre substitui.
- Nao ha mescla na V1.
- Importacao em massa fora do formato do Radar Escola fica fora da V1.

### Mensagens de UX

- "Os dados atuais serao substituidos."
- "Nao existe mescla nesta versao."
- "Confirme somente se voce tem certeza."

### Criterios de aceite

- Direcao restaura arquivo valido.
- Arquivo invalido nao altera banco.
- Usuario sem permissao nao restaura.
- Restauracao substitui, nao mescla.

### Testes minimos

- Restauracao valida.
- CSV invalido.
- Bloqueio por perfil.
- Substituicao total.

### Issues minimas sugeridas

- Application: restaurar seguranca.
- Infra: parser/validador CSV.
- Persistencia: transacao de substituicao.
- QA: restauracao e falhas.

## UC-021 Consultar auditoria

### Objetivo

Permitir que direcao consulte eventos sensiveis.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Direcao autenticada.
- Eventos de auditoria existem ou nao.

### Pos-condicoes

- Eventos exibidos sem alterar dados.

### Fluxo principal

1. Direcao acessa auditoria.
2. Sistema valida perfil.
3. Sistema lista eventos em ordem recente.
4. Direcao pode filtrar por tipo ou periodo simples.

### Fluxos alternativos

- Sem eventos: mostrar estado vazio.

### Fluxos de excecao

- Apoio de gestao tenta acessar: bloquear.
- Usuario comum tenta acessar: bloquear.

### Regras de negocio

- Auditoria e exclusiva da direcao.
- Auditoria nao mostra senhas, tokens ou respostas.
- Eventos nao sao editaveis pela UI.

### Mensagens de UX

- "Registro de acoes sensiveis."
- "Apenas a direcao pode consultar esta area."

### Criterios de aceite

- Direcao acessa.
- Apoio nao acessa.
- Usuario comum nao acessa.
- Eventos nao revelam segredos.

### Testes minimos

- Consulta como direcao.
- Bloqueio como apoio.
- Bloqueio como usuario comum.
- Conteudo sem segredo.

### Issues minimas sugeridas

- Query: listar auditoria.
- View: tela simples de auditoria.
- QA: permissao e conteudo.

## UC-022 Transferir direcao

### Objetivo

Permitir continuidade quando a pessoa responsavel principal muda.

### Atores

- Direcao.
- Sistema.

### Pre-condicoes

- Direcao atual autenticada.
- Nova direcao ja e pessoa cadastrada e ativa.

### Pos-condicoes

- Nova pessoa assume papel de direcao.
- Direcao anterior perde a exclusividade da direcao.
- Auditoria registra transferencia.

### Fluxo principal

1. Direcao acessa configuracoes da escola.
2. Escolhe transferir direcao.
3. Sistema lista pessoas ativas.
4. Direcao escolhe nova pessoa responsavel.
5. Sistema mostra confirmacao forte.
6. Direcao confirma.
7. Sistema altera responsavel principal.
8. Sistema registra auditoria.
9. Sistema orienta revisar apoios de gestao.

### Fluxos alternativos

- Direcao cancela antes de confirmar.

### Fluxos de excecao

- Usuario comum tenta transferir: bloquear.
- Apoio tenta transferir: bloquear.
- Pessoa candidata inativa: bloquear.
- Direcao tenta transferir para si mesma: informar que ja e responsavel.

### Regras de negocio

- So existe uma direcao principal.
- Transferencia nao apaga pessoa anterior.
- Exportacao/restauracao passam para nova direcao.

### Mensagens de UX

- "Esta acao transfere a responsabilidade principal da escola."
- "A nova direcao tera acesso a auditoria e seguranca."

### Criterios de aceite

- Direcao transfere.
- Nova direcao acessa acoes exclusivas.
- Antiga direcao perde acoes exclusivas, salvo outra delegacao.
- Auditoria registrada.

### Testes minimos

- Transferencia valida.
- Bloqueio sem permissao.
- Permissoes apos transferencia.
- Auditoria.

### Issues minimas sugeridas

- Model: responsavel principal.
- Application: transferir direcao.
- View: confirmacao forte.
- QA: antes/depois da transferencia.

## UC-023 Sair da conta

### Objetivo

Permitir encerrar sessao em computador compartilhado.

### Atores

- Direcao.
- Apoio de gestao.
- Usuario comum.
- Sistema.

### Pre-condicoes

- Usuario autenticado.

### Pos-condicoes

- Sessao encerrada.
- Tela de login exibida.
- Dados anteriores nao ficam visiveis.

### Fluxo principal

1. Usuario aciona sair.
2. Sistema encerra sessao local.
3. Sistema limpa estado sensivel da tela.
4. Sistema retorna ao login.

### Fluxos alternativos

- Se ha formulario com dados nao salvos, sistema pode pedir confirmacao.

### Fluxos de excecao

- Erro ao limpar estado: forcar retorno ao login e nao exibir dados sensiveis.

### Regras de negocio

- Botao sair deve ser visivel.
- Computador compartilhado e premissa da V1.

### Mensagens de UX

- "Sair da conta."
- "Ao terminar, saia da conta para proteger as informacoes da escola."

### Criterios de aceite

- Usuario sai da conta.
- Volta ao login.
- Nao ve dados sem login.

### Testes minimos

- Logout em cada perfil.
- Dados ocultos apos logout.

### Issues minimas sugeridas

- Application: encerrar sessao.
- View: acao de sair.
- QA: computador compartilhado.

## UC-024 Bloquear e desbloquear sessao por inatividade

### Objetivo

Reduzir risco de sessao aberta em computador compartilhado.

### Atores

- Usuario autenticado.
- Sistema.

### Pre-condicoes

- Sessao ativa.

### Pos-condicoes

- Sessao bloqueada apos 30 minutos sem atividade.
- Usuario atual pode desbloquear com senha.

### Fluxo principal

1. Sistema monitora atividade local.
2. Apos 30 minutos sem atividade, sistema bloqueia tela.
3. Sistema mostra nome do usuario atual.
4. Usuario informa senha.
5. Sistema valida senha.
6. Sistema desbloqueia e tenta preservar contexto.

### Fluxos alternativos

- Usuario escolhe sair em vez de desbloquear.
- Contexto nao pode ser preservado: sistema volta ao Radar.

### Fluxos de excecao

- Senha incorreta: manter bloqueado.
- Conta inativa durante bloqueio: encerrar sessao.

### Regras de negocio

- Desbloqueio e com senha do usuario atual.
- Outro usuario deve sair e fazer login proprio.
- Bloqueio nao depende de internet.

### Mensagens de UX

- "Sessao bloqueada por inatividade."
- "Digite sua senha para continuar."
- "Para usar outra conta, saia e entre novamente."

### Criterios de aceite

- Bloqueia apos 30 minutos.
- Senha correta desbloqueia.
- Senha incorreta nao desbloqueia.
- Logout a partir da tela bloqueada funciona.

### Testes minimos

- Timer de inatividade.
- Desbloqueio valido.
- Erro de senha.
- Logout bloqueado.

### Issues minimas sugeridas

- Model: regra de sessao.
- Application: bloquear/desbloquear.
- View: tela bloqueada.
- QA: inatividade.

## UC-025 Validar MVP completo

### Objetivo

Confirmar que a V1 especificada entrega uma experiencia minima coerente para a
escola.

### Atores

- QA.
- Dev.
- Direcao.
- Usuario comum.

### Pre-condicoes

- Fluxos principais implementados.
- Banco local funcional.

### Pos-condicoes

- MVP validado ou lista de lacunas criada.

### Fluxo principal

1. QA inicia app em ambiente limpo.
2. Configura escola.
3. Cria direcao.
4. Cadastra cargo.
5. Cadastra usuario comum.
6. Usuario comum faz primeiro acesso.
7. Direcao registra necessidade.
8. Direcao marca usuario como envolvido.
9. Usuario registra andamento.
10. Usuario solicita fechamento tecnico.
11. Direcao marca como resolvida.
12. Direcao consulta historico.
13. Direcao exporta dados.
14. Direcao restaura dados em ambiente controlado.
15. QA valida auditoria e bloqueios por perfil.

### Fluxos de excecao

- Qualquer etapa falha: registrar lacuna com caso de uso relacionado.

### Regras de negocio

- Validacao deve usar dados ficticios.
- Nao usar dados de estudante.

### Criterios de aceite

- Fluxo narrativo completo passa.
- Permissoes criticas passam.
- Exportacao/restauracao passam.
- Testes automatizados criticos passam.

### Testes minimos

- Smoke test E2E.
- Teste manual guiado.
- Checklist de QA.

### Issues minimas sugeridas

- QA: roteiro MVP completo.
- QA: matriz de regressao.
- Docs: guia de validacao local.

## Regras Gerais de Mensagem

- Mensagem deve ser curta e orientada a acao.
- Erro deve dizer o que aconteceu e como corrigir quando possivel.
- Termos tecnicos devem ficar fora da experiencia principal.
- Evitar `ticket`, `chamado`, `service desk`, `incidente`, `workflow` e
  `dashboard`.

## Regras Gerais de Teste

- Todo caso de uso com regra de permissao deve ter teste positivo e negativo.
- Toda acao sensivel deve ter teste de auditoria.
- Toda validacao de campo obrigatorio deve ter teste.
- Todo fluxo de excecao critico deve ter teste ou justificativa no PR.
- Teste deve usar dados ficticios e nao identificar estudantes.

## Criterio Para Abrir Issue Real

Uma issue real so deve ser aberta depois que:

- caso de uso estiver revisado;
- regra de dominio correspondente estiver mapeada;
- camada tecnica estiver identificada;
- criterio de aceite estiver claro;
- teste esperado estiver definido;
- dependencia estiver conhecida.
