# Contexto Inicial

Este documento registra uma fotografia inicial do raciocinio estrategico do
OpenEduOps. Ele nao pretende ser definitivo. A ideia e preservar o contexto como
esta agora, para que a organizacao possa evoluir suas decisoes com mais clareza
ao longo do tempo.

Atualizacao de estado apos a tag `v0.0.1`: o Radar Escola ja possui um scaffold
desktop tecnico publicado com instalador Windows e checksum. Essa release valida
a casca desktop, o empacotamento, a janela maximizada e o Playground de
referencia; ela ainda nao representa a V0 funcional para uso real em escola.

## Recorte do problema

Ao observar o contexto educacional brasileiro como um todo, especialmente a
realidade publica e mais precarizada, existe uma cadeia longa de desafios desde
a entrada do individuo no sistema educacional ate a saida da universidade.

Muitos desses desafios sao pedagogicos, sociais, economicos ou politicos. O
OpenEduOps, neste momento inicial, nao deve tentar resolver todos eles.

O ponto de partida mais saudavel parece estar na intersecao entre:

- dor institucional real;
- simplicidade tecnica;
- baixo custo de implantacao;
- utilidade imediata para escolas, institutos e universidades;
- potencial de formacao pratica para novos contribuidores;
- possibilidade de evolucao incremental.

Como a proposta inicial e operacional, a V0 nao deve depender de dados pessoais
de estudantes. O foco deve estar em necessidades da instituicao, equipamentos,
locais, pessoas cadastradas na operacao e historico de resolucao.

Por esse motivo, o primeiro foco recomendado nao esta na sala de aula, em
plataformas pedagogicas, em ambientes virtuais de aprendizagem ou em solucoes
baseadas em inteligencia artificial.

O primeiro foco recomendado esta na operacao basica das instituicoes
educacionais.

## Hipotese central

Instituicoes educacionais publicas e comunitarias frequentemente sofrem com
problemas operacionais invisiveis, mas essenciais:

- laboratorios de informatica quebrados ou subutilizados;
- computadores, projetores, roteadores, impressoras e notebooks sem inventario
  confiavel;
- manutencoes solicitadas por WhatsApp, papel, e-mail solto ou conversas
  informais;
- falta de historico sobre problemas recorrentes;
- disputa por salas, laboratorios e equipamentos compartilhados;
- equipes tecnicas pequenas e sobrecarregadas;
- direcoes sem dados simples para justificar compras, manutencoes ou
  prioridades;
- perda de continuidade quando servidores, tecnicos, coordenadores ou
  voluntarios saem da instituicao.

Esses problemas parecem administrativos, mas afetam diretamente a experiencia
educacional.

Um laboratorio sem manutencao pode significar aula cancelada. Um equipamento
sem controle pode significar recurso publico desperdicado. Um chamado esquecido
pode impedir um professor de executar uma atividade. A falta de historico torna
cada troca de equipe um recomeco.

## Ponto de partida recomendado

A aposta inicial do OpenEduOps deve ser uma solucao simples para registrar
necessidades, solicitar apoio, acompanhar andamento e preservar historico de
manutencao em instituicoes educacionais.

Uma formulacao possivel:

> Uma central operacional simples para escolas e instituicoes educacionais,
> combinando necessidades operacionais, apoio interno, inventario basico de
> equipamentos e historico de manutencao.

Esse recorte e promissor porque:

- resolve uma dor real e recorrente;
- pode ser demonstrado com facilidade;
- nao depende de integracoes externas complexas;
- nao exige acesso a sistemas institucionais sensiveis;
- pode funcionar em rede local ou infraestrutura simples;
- gera muitas oportunidades de contribuicao pequenas, reais e educativas;
- atende desde escolas pequenas ate departamentos universitarios;
- permite evolucao por modulos.

## Primeiro produto possivel

O primeiro produto escolhido para iniciar o OpenEduOps tem como nome publico
adotado por enquanto `Radar Escola`.

O Radar Escola representa uma central operacional simples para instituicoes
educacionais, com foco inicial em necessidades, apoio interno, equipamentos e
historico de manutencao.

Definicao curta:

> Radar Escola e um aplicativo desktop local para Windows que ajuda escolas a
> organizar necessidades, equipamentos e historico de manutencao, sem depender
> de internet, servidor ou equipe tecnica especializada.

Frase de produto:

> Um programa simples para escolas organizarem necessidades, equipamentos e
> manutencoes no proprio computador.

O principio de experiencia do Radar Escola deve ser:

> Instalar, abrir e registrar a primeira necessidade em poucos minutos.

## Por que comecar pelo produto Radar Escola

O primeiro produto, hoje tratado pelo nome Radar Escola, deve ser o ponto de
partida porque resolve uma dor comum em diferentes tipos de instituicao
educacional: pedidos de manutencao, equipamentos, laboratorios, salas e
problemas cotidianos que hoje frequentemente ficam espalhados em WhatsApp,
papel, e-mail solto ou memoria das pessoas.

Ele tambem e transversal. Pode ser util para:

- escola publica pequena;
- laboratorio de informatica;
- biblioteca;
- secretaria;
- coordenacao;
- setor administrativo;
- campus;
- setor tecnico.

Comecar por necessidades, apoio interno, equipamentos e manutencao permite gerar
valor rapido sem restringir demais o produto.

Outros recortes foram considerados, mas parecem menos adequados como primeiro
produto unico:

- `EduInventory` sozinho pode parecer apenas cadastro burocratico;
- `EduLab` e relevante, mas restringe o publico inicial a laboratorios;
- `EduRooms` depende mais de regras de agenda e organizacao institucional;
- `EduLibrary` entra em um dominio mais especifico.

O Radar Escola cria uma base operacional comum e permite que esses outros
produtos ou modulos aparecam depois de forma mais natural.

## Fluxo conceitual do Radar Escola

O Radar Escola deve tratar chamados como necessidades acompanhadas, nao como
tickets tecnicos.

A unidade central do produto deve ser a `necessidade`.

Uma necessidade representa algo que surgiu na rotina da instituicao e precisa de
atencao, apoio, cuidado, planejamento ou resolucao.

Exemplos:

- um equipamento que parou de funcionar;
- uma sala que precisa de manutencao;
- um laboratorio com computadores sem internet;
- uma impressora que nao imprime;
- uma solicitacao de apoio para uma atividade;
- uma necessidade de material, organizacao ou acompanhamento;
- um problema recorrente que precisa deixar de depender da memoria das pessoas.

Fluxo principal:

> Necessidade -> solicitar apoio ou ajuda -> marcar envolvidos -> plano de acao
> detalhado -> monitoramento conjunto no Radar Escola -> registrar como
> resolvido.

### Etapas do fluxo

#### Necessidade

Algo apareceu na rotina da escola e precisa ser registrado para nao se perder.

#### Solicitar apoio ou ajuda

A pessoa registra que precisa de apoio, acompanhamento ou resolucao. A linguagem
do produto deve evitar termos excessivamente tecnicos como ticket, service desk
ou incidente, exceto quando forem necessarios internamente.

#### Marcar envolvidos

A necessidade deve permitir indicar pessoas cadastradas que precisam acompanhar
o caso, como solicitante, responsavel, equipe tecnica, coordenacao, secretaria,
direcao ou outras funcoes operacionais da escola.

Na V0, isso exige cadastro local de pessoas/usuarios antes de marcar envolvidos.
Cada pessoa deve ter, no minimo, nome, usuario, cargo ou funcao e status de
primeiro acesso.

Cargo ou funcao deve funcionar como uma lista simples, para facilitar filtros e
leitura do Radar Escola. Se, durante o cadastro de uma pessoa, o cargo ou funcao
ainda nao existir, a direcao ou responsavel principal deve poder cadastrar essa
opcao na hora e continuar o cadastro sem sair do fluxo.

Na V0, cargo ou funcao nao deve criar uma matriz complexa de permissoes. Na
pratica, pessoas cadastradas podem ver as necessidades, historico, envolvidos e
andamentos. As excecoes devem ser acoes sensiveis da direcao ou responsavel
principal, especialmente exportacao de seguranca e gestao de acessos/senhas.

A direcao ou responsavel principal deve poder definir ate duas pessoas como
apoio de gestao. Essa delegacao deve ser explicita e preferencialmente usada
para coordenadores ou funcoes imediatamente abaixo da direcao, conforme a
hierarquia real da escola. Na V0, essa mesma delegacao permite cadastrar novos
usuarios, cancelar/corrigir necessidades e marcar necessidades como resolvidas.
Ela nao libera exportacao/restauracao de seguranca nem transferencia de direcao.

Pessoas cadastradas pela direcao ou responsavel principal podem receber a senha
inicial padrao `123456` apenas para o primeiro acesso. Ao entrar pela primeira
vez, a pessoa deve obrigatoriamente trocar a senha, definir sua salvaguarda
local de recuperacao e guardar token ou frase de recuperacao em local seguro.
O token de recuperacao deve ser exibido no momento de configuracao da
salvaguarda e nao deve ser regenerado depois.
Esse primeiro acesso deve ser tratado como privado: a direcao cria o usuario,
mas nao deve ver a nova senha, o token, a frase de recuperacao nem a resposta.
Preferencialmente, a pessoa deve fazer esse acesso sem a presenca da direcao ou
com distancia suficiente para proteger a tela.

Se uma pessoa cadastrada perder senha e salvaguarda, a direcao ou responsavel
principal podera redefinir sua senha para `123456`, obrigando nova troca no
proximo acesso. Essa redefinicao nao deve gerar novo token; ela apenas recupera
a entrada do usuario comum no sistema. Essa recuperacao administrativa vale para
usuarios comuns; a salvaguarda da direcao continua sendo critica.

#### Plano de acao detalhado

A necessidade pode evoluir para um plano com passos, responsaveis, prazos,
observacoes, materiais necessarios, impedimentos e proximas acoes.

O objetivo e evitar que o registro fique parado em "alguem precisa ver isso".

#### Monitorar andamento

O monitoramento deve ser conjunto, envolvendo as pessoas marcadas na necessidade.

O objetivo nao e apenas mostrar um status em uma lista. O objetivo e manter o
assunto visivel, acompanhado e "quente" ate que exista uma resolucao registrada.

O sistema deve permitir acompanhar se a necessidade esta nova, em analise, em
execucao, aguardando material, aguardando autorizacao, pausada, resolvida ou
cancelada.

Durante esse ciclo, os envolvidos devem consultar o Radar Escola no computador
em que o aplicativo esta instalado, usando seu usuario e senha, para acompanhar
mudancas importantes, comentarios, novas acoes, atrasos, atribuicoes ou
resolucao.

O produto deve ajudar a reduzir o risco de uma necessidade desaparecer depois do
primeiro registro. Para isso, a V0 deve tornar necessidades paradas muito
visiveis no Radar de Necessidades, sem depender de e-mail, WhatsApp, mensageria
ou notificacoes automaticas.

#### Registrar como resolvido

Ao resolver uma necessidade, a direcao ou apoio de gestao deve registrar
o que foi feito, por quem, quando, se houve equipamento relacionado,
observacoes finais e se ha necessidade de acompanhamento posterior.

Na V0, marcar como resolvido deve passar pelo olhar da gestao. Pessoas
cadastradas podem acompanhar e atualizar andamento, mas a resolucao final deve
ser feita pela direcao ou por pessoas definidas como apoio de gestao.

Esse fechamento cria memoria operacional para a instituicao.

### Auditoria minima

A V0 deve registrar historico interno simples para acoes sensiveis. O objetivo
nao e criar um dashboard de auditoria, mas preservar "quem fez o que e quando"
em eventos como cadastro de usuario, redefinicao de senha, definicao de apoio de gestao,
exportacao/importacao de seguranca, transferencia de direcao e marcacao de
necessidade como resolvida.

A consulta da auditoria deve ser exclusiva da direcao/responsavel principal.
Apoio de gestao pode executar acoes delegadas, mas nao deve consultar auditoria.

### Troca de direcao

A V0 deve prever fluxo para transferir a responsabilidade principal da escola
quando houver troca de direcao. Essa transferencia deve ser acao sensivel,
registrada em auditoria minima, e deve exigir confirmacao clara para evitar
perda acidental do controle administrativo.

### Computador compartilhado

Como o Radar Escola sera usado em computador compartilhado, a V0 deve ter fluxo
simples de sair da conta e orientar a pessoa a encerrar a sessao ao terminar o
uso. O produto nao deve assumir que o computador e pessoal.

### Edicao, cancelamento e exclusao

A V0 deve permitir corrigir erros sem apagar memoria operacional importante.
Necessidades cadastradas por engano devem poder ser editadas ou canceladas, mas
exclusao definitiva deve ser evitada ou restrita a direcao/responsavel
principal. O historico deve preservar alteracoes relevantes sempre que possivel.

## Linguagem de intencao do usuario

A interface deve priorizar frases que representem o que a pessoa quer fazer, em
vez de expor primeiro categorias tecnicas do sistema.

Um menu inicial ou conjunto de acoes pode seguir esta linguagem:

- Tenho algo para resolver;
- Preciso pedir ajuda;
- Quero ver o que esta acontecendo;
- Quero ver o que esta parado;
- Quero acompanhar um caso;
- Quero envolver outras pessoas;
- Quero combinar os proximos passos;
- Quero registrar uma atualizacao;
- Quero dizer que foi resolvido;
- Quero ver o historico;
- Quero cadastrar um equipamento;
- Quero exportar uma copia de seguranca.

Essa linguagem deve ajudar professoras, secretaria, coordenacao e equipes de
apoio a reconhecer rapidamente a acao desejada sem precisar entender termos como
ticket, chamado, incidente, workflow ou dashboard.

## Documentos complementares da V0

A concepcao da V0 deve ser lida junto com:

- `VISAO_PROTOTIPAL_V0.md`, que registra a primeira visao prototipal em baixa
  fidelidade;
- `REQUISITOS_V0.md`, que consolida requisitos funcionais, nao funcionais e
  criterios de aceite da V0;
- `GUARDRAILS_V0.md`, que define limites de escopo, privacidade, consulta
  manual pelos envolvidos, exportacao de seguranca, arquitetura, testes
  automatizados e criterios de aceite;
- `ESCOPO_V0.md`, que define a linha de corte do primeiro MVP executavel;
- `FLUXO_E2E_V0.md`, que consolida o ciclo ponta a ponta da V0.

### MVP inicial

O MVP deve priorizar:

- cadastro local de pessoas/usuarios com cargo ou funcao;
- primeiro acesso de pessoas cadastradas com senha temporaria `123456`, troca
  obrigatoria de senha e salvaguarda local;
- registro de necessidades;
- solicitacao de apoio ou ajuda;
- acompanhamento de andamento;
- cadastro basico de equipamentos;
- vinculo entre necessidade e equipamento;
- registro de manutencoes;
- comentarios e historico da necessidade;
- categorias e prioridades simples;
- papeis operacionais simples, como solicitante, tecnico, secretaria,
  coordenacao, direcao ou gestor;
- relatorios simples;
- exportacao em CSV;
- possibilidade de importar de volta os dados exportados, para recuperacao em
  caso de perda ou troca do computador;
- instalacao simples para Windows;
- banco de dados local;
- possibilidade de uso sem internet;
- uso em pt-BR;
- interface acessivel e responsiva.

## Estrategia de adocao desktop local

Uma evolucao importante da ideia inicial e priorizar a experiencia de uso
concreta de instituicoes com baixa maturidade tecnica.

Para muitas escolas publicas, bibliotecas, laboratorios e pequenos setores
administrativos, a melhor porta de entrada nao e um ambiente Docker, um servidor
Linux ou uma implantacao em nuvem.

A melhor porta de entrada tende a ser:

> Baixar, instalar e usar.

O OpenEduOps deve considerar como principio que seus primeiros produtos precisam
ser programas desktop locais, amigaveis para Windows e utilizaveis com banco de
dados local, sem depender de servicos externos, contas institucionais, internet
constante ou equipe tecnica especializada.

Essa direcao favorece uma experiencia de adocao mais proxima de softwares livres
tradicionais, como LibreOffice, VLC, GIMP, Audacity e 7-Zip: o usuario baixa,
instala, abre pelo icone e usa.

A aplicacao pode usar tecnologias modernas de interface internamente, caso isso
ajude na produtividade, na manutenibilidade e na formacao de contribuidores. No
entanto, a experiencia entregue ao usuario final deve ser a de um programa
desktop comum, nao a de um sistema que precisa ser implantado, hospedado ou
configurado.

Uma formulacao possivel:

> Experiencia do usuario final primeiro, tecnologia depois.

Outra formulacao complementar:

> Desktop local primeiro, infraestrutura depois.

## Modos de uso esperados

### Modo local individual

O usuario instala o sistema em uma maquina Windows, abre o aplicativo e comeca a
usar com banco local.

Esse modo favorece pilotos, testes, secretarias pequenas, bibliotecas,
laboratorios e setores que precisam experimentar a ferramenta sem depender de
uma implantacao institucional formal.

### Modo rede local

Uma maquina pode funcionar como ponto central dentro da escola, biblioteca ou
departamento, permitindo que outras maquinas acessem o sistema pela rede local.

Esse modo preserva a simplicidade, mas ja permite uso coletivo.

### Modo institucional

Instituicoes com equipe tecnica podem optar por uma instalacao mais robusta,
usando Docker, Linux, banco externo e processos formais de backup.

Esse modo deve existir como caminho avancado, nao como requisito inicial para
experimentar o produto.

## Diretriz de produto inicial

Para o primeiro MVP, uma direcao de produto coerente e:

- aplicacao desktop local;
- instalador amigavel para Windows;
- icone na area de trabalho e no menu iniciar;
- banco local, preferencialmente SQLite no inicio;
- exportacao CSV de seguranca;
- exportacao CSV de dados;
- uso sem internet obrigatoria;
- experiencia de abertura semelhante a um software comum;
- interface simples, direta e em Portugues Brasileiro;
- primeiro uso guiado;
- tecnologia interna escolhida em funcao da experiencia final;
- possibilidade de usar tecnologias modernas de interface internamente, desde
  que isso nao apareca como complexidade para o usuario;
- possibilidade futura de migracao para banco externo;
- Docker como opcao para desenvolvimento, testes e implantacoes tecnicas.

O objetivo nao e abandonar ambientes tecnicos mais robustos. O objetivo e nao
transforma-los em barreira de entrada.

## Regra arquitetural inicial

A arquitetura do primeiro produto deve preservar a experiencia desktop local e
manter a complexidade tecnica invisivel para o usuario final.

Stack escolhida para o primeiro produto:

> Tauri + React + TypeScript + SQLite.

Como regra inicial:

- React e TypeScript devem concentrar a experiencia de uso, telas, componentes,
  formularios, estados, validacoes e regras simples de aplicacao;
- SQLite deve ser o banco de dados local, gratuito e embutido;
- Tauri e Rust devem atuar como casca desktop e ponte nativa minima, cuidando
  apenas do que for necessario para janela, instalador, arquivos locais,
  integracao com o sistema operacional e acesso seguro aos recursos nativos.

Rust nao deve ser o centro da regra de negocio no inicio do projeto.

### Justificativa para React e TypeScript

React e TypeScript sao escolhidos para concentrar a experiencia de uso e a
maior parte da logica de interface do primeiro produto.

Essa escolha nao deve deslocar o foco para tecnologia. Ela deve servir a uma
experiencia final simples, consistente e acessivel para pessoas que precisam
abrir o aplicativo e resolver problemas operacionais sem treinamento complexo.

React ajuda a organizar a interface em componentes reutilizaveis, favorecendo a
criacao de telas previsiveis para necessidades, equipamentos, filtros,
formularios, tabelas, estados vazios, mensagens de erro e fluxos de primeiro
uso.

TypeScript ajuda a reduzir erros comuns, tornar contratos de dados mais claros,
facilitar refatoracoes e tornar o codigo mais compreensivel para quem esta
aprendendo a contribuir.

Essa combinacao tambem favorece a formacao de contribuidores iniciantes porque
oferece experiencia pratica em habilidades transferiveis para o mercado:

- construcao de interfaces;
- componentes reutilizaveis;
- formularios e validacoes;
- estados de tela;
- acessibilidade;
- testes de interface;
- organizacao de codigo por dominio;
- leitura e evolucao de codigo tipado;
- manutencao incremental de um produto real.

React e TypeScript devem ser usados com disciplina. O projeto deve evitar
componentes grandes, logica espalhada em telas, abstracoes prematuras e
dependencias desnecessarias. A arquitetura deve favorecer componentes pequenos,
pastas por dominio, validacoes centralizadas, testes focados e convencoes simples
de contribuicao.

### Justificativa para Rust e Tauri

O uso de Rust neste contexto e justificado principalmente por Tauri e pela
experiencia desktop Windows-first que o OpenEduOps deseja entregar.

Rust nao entra como tecnologia central de produto, nem como objetivo de
aprendizado inicial para todos os contribuidores. Ele entra como base nativa
para permitir que a aplicacao seja distribuida como um programa desktop leve,
instalavel e integrado ao Windows.

Essa escolha ajuda a sustentar a experiencia desejada:

- instalador para Windows;
- abertura por icone, sem expor navegador ou servidor local ao usuario;
- janela propria de aplicativo desktop;
- acesso controlado a arquivos locais;
- suporte a exportacao de seguranca;
- integracao com recursos do sistema operacional;
- menor peso em comparacao com alternativas desktop mais pesadas;
- possibilidade de manter a maior parte da experiencia e das regras simples em
  React e TypeScript.

Portanto, Rust deve permanecer como infraestrutura discreta. Seu papel e
viabilizar a experiencia "baixar, instalar, abrir e usar" no Windows, mantendo a
complexidade tecnica fora do caminho do usuario final.

O usuario final nao deve precisar saber que existem React, TypeScript, SQLite,
Tauri, Rust, banco de dados ou camadas internas. Ele deve perceber apenas um
programa instalado, simples de abrir e capaz de cadastrar, acompanhar, organizar,
salvar e exportar uma copia de seguranca.

## Formacao de contribuidores

O foco inicial deve ser a experiencia do usuario final. Depois disso, a
arquitetura e a tecnologia devem ser alinhadas para gerar boas oportunidades de
aprendizado para contribuidores iniciantes.

Isso significa que o projeto deve buscar um equilibrio entre:

- utilidade real para escolas e instituicoes educacionais;
- experiencia simples para pessoas nao tecnicas;
- codigo compreensivel;
- issues pequenas e bem descritas;
- testes acessiveis;
- documentacao clara;
- oportunidades de aprendizado em interface, regras de negocio, persistencia,
  acessibilidade, instalacao, empacotamento, exportacao de dados e qualidade.

A formacao dos contribuidores deve nascer de um produto util, nao de um exercicio
artificial de tecnologia.

## Sequencia possivel de produtos

O OpenEduOps pode evoluir em uma sequencia de projetos independentes, mas
relacionados.

### Radar Escola

Primeiro produto da fila.

Central desktop local para necessidades, equipamentos e historico de
manutencao.

Objetivo inicial:

- permitir que uma instituicao educacional instale o aplicativo no Windows;
- registre necessidades;
- cadastre equipamentos basicos;
- vincule necessidades a equipamentos;
- acompanhe status;
- mantenha historico de manutencao;
- exporte copias CSV de seguranca dos dados.

### EduInventory

Segundo produto ou modulo candidato.

Inventario mais completo de equipamentos, ativos e patrimonio operacional.

Pode evoluir a partir da base de equipamentos do Radar Escola quando houver
necessidade de controle mais detalhado de patrimonio, localizacao, responsaveis,
estado, identificadores e historico.

### EduLab

Terceiro produto ou modulo candidato.

Gestao de laboratorios de informatica, computadores, softwares instalados,
estado das maquinas, reservas e incidentes.

Pode nascer depois que a organizacao tiver clareza sobre os fluxos reais de
laboratorios e sobre quais dados do Radar Escola e do EduInventory devem ser
reaproveitados.

### EduRooms

Quarto produto ou modulo candidato.

Reserva e gestao de salas, laboratorios e equipamentos compartilhados.

Deve ser considerado depois, porque envolve regras de agenda, conflitos,
perfis de autorizacao e combinacoes institucionais que podem variar bastante.

### EduContinuity

Quinto produto ou modulo candidato.

Base de conhecimento operacional com procedimentos, contatos, checklists,
rotinas e documentacao institucional.

Pode complementar o Radar Escola ao transformar necessidades recorrentes,
manutencoes e solucoes em conhecimento institucional reutilizavel.

## Principios para o primeiro MVP

O primeiro MVP deve ser:

- simples de instalar;
- possivel de rodar em computador comum;
- utilizavel em rede local;
- acessivel por celular;
- independente de servicos pagos;
- independente de login institucional complexo;
- claro para contribuidores iniciantes;
- util para uma escola pequena;
- extensivel para institutos, universidades e bibliotecas;
- documentado em Portugues Brasileiro.

## Decisao inicial

O OpenEduOps deve comecar pelo "chao operacional" da educacao.

Antes de tentar transformar a experiencia pedagogica diretamente, o projeto deve
ajudar instituicoes a enxergar, organizar e manter os recursos que ja possuem.

Essa escolha permite impacto pratico, baixo custo inicial e um caminho saudavel
para formar uma comunidade tecnica em torno de problemas reais.
