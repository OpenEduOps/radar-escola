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
scaffold tecnico minimo.

Por isso, a esteira completa de release desktop ainda nao consegue gerar um
instalador real.

O workflow `.github/workflows/desktop-release.yml` ja existe como contrato
tecnico, mas sua etapa de preflight falha intencionalmente enquanto o scaffold
do app nao existir.

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

O arquivo futuro `scripts/smoke-windows.ps1` deve validar o minimo necessario
para confiar que o instalador nao esta quebrado.

Ele deve testar:

- instalador encontrado;
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

## Comportamento Enquanto o App Nao Existe

O workflow `Desktop Release` pode ser executado manualmente para conferir o
estado da esteira.

O scaffold minimo do app ja existe no repositorio para validar a esteira sem
criar funcionalidade falsa de MVP. Ele contem uma tela tecnica simples do Radar
Escola, sem fluxo de cadastro, banco local ou regras de negocio.

Enquanto o app ainda for apenas scaffold, a execucao manual pode gerar um
instalador tecnico minimo, mas ele deve ser tratado apenas como validacao da
casca desktop e do pipeline de release.

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
- teste automatizado que instale e abra o app de forma verificavel no Windows;
- definicao final de formato de instalador;
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
