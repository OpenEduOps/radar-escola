# Release Desktop do Radar Escola

Este documento define a esteira alvo de CI/CD ponta a ponta para o futuro app
desktop do Radar Escola.

## Objetivo Final

O objetivo final da CI/CD e permitir que uma pessoa usuaria consiga:

1. abrir a pagina de release do projeto;
2. baixar o instalador Windows;
3. instalar o Radar Escola na maquina desktop;
4. abrir o aplicativo;
5. usar um banco local;
6. validar que a experiencia basica funciona sem depender de infraestrutura
   tecnica externa.

Essa e a materializacao da regra de UX definida para o produto:

> A pessoa usuaria final deve ver instalar, abrir, cadastrar, acompanhar,
> marcar como resolvido, consultar historico e exportar seguranca.

Ela nao deve precisar saber que existem Tauri, React, TypeScript, Rust, SQLite,
CI, GitHub Actions ou banco de dados.

## Estado Atual

O repositorio `OpenEduOps/radar-escola` contem a documentacao de produto e o
scaffold tecnico minimo executavel.

O workflow `.github/workflows/desktop-release.yml` ja consegue gerar um
instalador Windows tecnico do scaffold atual por execucao manual.

Esse instalador ainda nao representa a V0 funcional completa. Ele valida a
casca desktop, o carregamento do frontend empacotado, o menu nativo Playground
e o CRUD de referencia usado por pessoas desenvolvedoras.

## Contrato Minimo do App

Para ativar a esteira desktop, o repositorio do app precisara conter:

```text
package.json
package-lock.json
src-tauri/Cargo.toml
scripts/smoke-windows.ps1
```

Esses arquivos ja existem no scaffold minimo atual.

O projeto tambem deve expor scripts locais claros:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run tauri build
```

Scripts podem ser ajustados conforme o scaffold real, mas a intencao deve ser
preservada: qualquer pessoa mantenedora precisa conseguir reproduzir localmente
o que a CI executa.

## Scaffold Atual

O scaffold atual contem:

- app React/TypeScript minimo;
- Vite para build frontend;
- Tauri 2 como casca desktop;
- janela inicial do Radar Escola;
- menu nativo `Playground > Iniciar playground`;
- CRUD playground master-detail como referencia tecnica;
- icone Windows exigido pelo empacotamento Tauri;
- capability Tauri `core:default` para a janela principal;
- script de smoke check para localizar artefatos Windows;
- `package-lock.json` para dependencias npm reproduziveis.

Ele nao contem regra de negocio, banco local ou fluxos de usuario. Isso e
intencional para manter o scaffold honesto.

## Esteira Ponta a Ponta

O workflow `Desktop Release` deve cobrir:

1. preflight do scaffold desktop;
2. instalacao de Node e Rust;
3. instalacao de dependencias;
4. lint, typecheck, testes e build do frontend;
5. `cargo fmt`, `cargo clippy` e `cargo test` na camada Tauri/Rust;
6. build do instalador Windows;
7. smoke test do instalador em runner Windows;
8. coleta de `.exe` ou `.msi`;
9. geracao de SHA-256;
10. upload de artefato baixavel no GitHub Actions;
11. publicacao em GitHub Release quando houver tag `v*`.

## Smoke Test Windows

O arquivo `scripts/smoke-windows.ps1` valida o minimo necessario
para confiar que o instalador nao esta quebrado.

Ele testa hoje:

- instalador encontrado;

Ele deve evoluir para testar tambem:

- instalacao sem erro;
- aplicativo abre sem crash imediato;
- banco local e criado no local esperado;
- aplicacao encerra corretamente;
- desinstalacao ou limpeza do runner quando aplicavel.

O smoke test nao substitui teste de UX humano, mas reduz o risco de publicar um
instalador que sequer abre.

## Artefatos Esperados

Cada build de release deve produzir:

```text
Radar-Escola-<versao>-windows-x64.exe
Radar-Escola-<versao>-windows-x64.exe.sha256
```

Enquanto nao houver assinatura de codigo, a documentacao da release deve avisar
que o Windows pode exibir alerta de origem desconhecida.

## Publicacao

Pull requests e pushes comuns devem validar qualidade e build.

Tags `v*` devem publicar release com artefatos baixaveis.

Exemplo futuro:

```text
v0.1.0
```

## Comportamento Enquanto o App Ainda E Scaffold

O workflow `Desktop Release` pode ser executado manualmente para conferir o
estado da esteira.

O scaffold minimo do app ja existe no repositorio para validar a esteira sem
criar funcionalidade falsa de MVP. Ele contem uma tela tecnica simples do Radar
Escola, menu nativo Playground e CRUD playground de referencia, sem fluxo de
cadastro escolar, banco local ou regras de negocio da V0.

Enquanto o app ainda for apenas scaffold, a execucao manual gera um instalador
tecnico minimo, mas ele deve ser tratado apenas como validacao da casca desktop,
do carregamento web empacotado e do pipeline de release.

Se alguem tentar publicar uma tag `v*` antes do scaffold existir, o preflight
deve falhar. Uma release versionada nao pode ser publicada sem artefato real.

## Pendencias Que Dependem do App

Ainda nao e possivel entregar a experiencia completa de produto porque faltam:

- fluxo funcional do MVP;
- banco SQLite local;
- persistencia real;
- autenticacao local;
- cadastro de pessoas/usuarios;
- registro e acompanhamento de necessidades;
- exportacao/restauracao de seguranca;
- `Cargo.lock` gerado por ambiente Rust valido;
- teste automatizado na CI que instale e abra o app de forma verificavel no
  Windows;
- decisao futura sobre assinatura de codigo.

Essas pendencias devem ser resolvidas neste repositorio quando o app Radar
Escola evoluir para alem do scaffold.

## Limitacao Local Observada

No ambiente local atual, `npm ci`, `npm run typecheck`, `npm run build` e
`npm run tauri -- info` foram executados.

O build Tauri completo nao foi executado localmente porque Rust, Cargo e Visual
Studio Build Tools/MSVC nao estao instalados nesta maquina. O workflow de
release usa runner Windows do GitHub Actions e instala Rust antes do build.

Mesmo assim, o contrato de CI/CD ja deixa claro qual sera o caminho de entrega
do produto para a pessoa usuaria final.

## Instalador Gerado Em CI

Como o ambiente local ainda nao tem toolchain Rust/MSVC, o instalador foi
gerado pelo workflow `Desktop Release` em runner Windows do GitHub Actions.

Validacao realizada:

- workflow `Desktop Release` concluido com sucesso;
- artefato `Radar Escola_0.0.0_x64-setup.exe` publicado pelo workflow;
- arquivo `.sha256` gerado e conferido localmente;
- instalacao silenciosa local executada com codigo `0`;
- executavel instalado em
  `C:\Users\silva-dev\AppData\Local\Radar Escola\radar-escola.exe`;
- aplicativo abriu sem crash imediato;
- UI do Radar Escola renderizou no executavel instalado;
- item nativo `Playground > Iniciar playground` foi acionado por comando Win32;
- tela `Master detalhe` do playground apareceu no executavel instalado.

Correcoes necessarias para chegar nesse estado:

- adicionar `src-tauri/icons/icon.ico`;
- configurar `base: "./"` no Vite para assets relativos no app empacotado;
- adicionar capability Tauri `core:default` para permitir a ponte de eventos da
  janela principal.

## Tentativa Local De Build Tauri

O comando abaixo foi executado localmente:

```text
npm run tauri -- build
```

Resultado:

```text
failed to run 'cargo metadata' ... program not found
```

Conclusao:

- o build web do scaffold esta valido;
- os testes automatizados do CRUD passam;
- o instalador pode ser gerado no GitHub Actions;
- o instalador ainda nao pode ser gerado diretamente nesta maquina;
- a pendencia local imediata e instalar Rust/Cargo;
- a pendencia nativa seguinte e instalar Visual Studio Build Tools/MSVC com as
  ferramentas C++ exigidas pelo Tauri no Windows.

Quando a toolchain nativa estiver disponivel, o caminho esperado para gerar o
instalador continua sendo:

```text
npm run tauri -- build
scripts/smoke-windows.ps1
```
