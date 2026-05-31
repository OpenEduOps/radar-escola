# Entrega Final Testavel

Este documento define a linha de chegada testavel da V0 do Radar Escola.

Ele deve orientar implementacao, issues, testes e criterios de aceite antes de
expandir escopo.

## Workflow Alvo

```text
instalar app
  -> abrir
  -> configurar escola e direcao
  -> entrar
  -> cadastrar pessoa
  -> primeiro acesso da pessoa
  -> registrar necessidade
  -> marcar envolvidos
  -> registrar andamento
  -> marcar como resolvido
  -> consultar historico
  -> exportar seguranca
  -> restaurar em ambiente limpo
```

## Fronteira da Fonte

O projeto recebe como entrada a rotina operacional da escola.

Ele nao resolve fisicamente os problemas da escola. Ele registra, organiza,
acompanha e preserva memoria operacional.

## Capacidades Obrigatorias

### Instalar / Abrir

Expectativas de aceite:

- instalador Windows existe;
- aplicativo abre sem erro critico;
- banco local e criado quando necessario;
- tela inicial orienta primeiro uso.

### Configurar

Expectativas de aceite:

- escola e direcao sao cadastradas;
- senha e hash sao gerados corretamente;
- salvaguarda local e definida;
- perda de credenciais e risco explicito para a direcao.

### Entrar

Expectativas de aceite:

- login funciona com usuario e senha;
- erros sao claros;
- logout existe;
- sessao bloqueia apos inatividade.

### Cadastrar Pessoas

Expectativas de aceite:

- direcao cadastra pessoa com cargo/funcao;
- cargo/funcao pode ser criado no fluxo;
- senha temporaria obriga troca no primeiro acesso;
- apoio de gestao respeita limite de duas pessoas.

### Registrar Necessidade

Expectativas de aceite:

- necessidade e criada com campos minimos;
- aparece no Radar de Necessidades;
- detalhe mostra dados principais.

### Marcar Envolvidos

Expectativas de aceite:

- envolvidos vem de pessoas cadastradas;
- envolvidos aparecem no detalhe da necessidade;
- usuario comum pode consultar necessidades.

### Acompanhar Andamento

Expectativas de aceite:

- atualizacoes sao registradas;
- plano simples pode ser descrito;
- historico preserva eventos.

### Resolver / Cancelar

Expectativas de aceite:

- usuario comum nao marca como resolvido;
- direcao ou apoio de gestao marca como resolvido;
- cancelamento preserva historico;
- acoes sensiveis registram auditoria.

### Exportar / Restaurar

Expectativas de aceite:

- direcao exporta CSV restauravel;
- exportacao inclui dados necessarios para restaurar o app;
- senhas nunca aparecem em texto claro;
- restauracao substitui dados atuais apos confirmacao forte;
- ambiente restaurado permite login com dados restaurados.

## Criterios de Aceite

### Aceite Funcional

1. A V0 instala e abre no Windows.
2. A escola configura primeiro uso sem internet.
3. A direcao cadastra pelo menos uma pessoa.
4. A pessoa cadastrada troca senha inicial e define salvaguarda.
5. Uma necessidade e registrada.
6. Envolvidos sao marcados.
7. Andamento e registrado.
8. Direcao ou apoio de gestao marca como resolvido.
9. Historico mostra a necessidade resolvida.
10. Exportacao e restauracao preservam os dados.

### Aceite de Validacao

1. `npm ci` passa.
2. `npm run typecheck` passa.
3. `npm run build` passa.
4. Testes de dominio passam.
5. Testes de persistencia passam.
6. Testes de exportacao/restauracao passam.
7. Smoke test desktop passa.
8. CI e Security passam no GitHub.

### Aceite de Seguranca

1. Nenhuma senha e salva em texto claro.
2. Exportacao nao contem senha em texto claro.
3. Restauracao exige confirmacao forte.
4. Auditoria registra acoes sensiveis.
5. Apenas direcao consulta auditoria.
6. Apoio de gestao nao exporta/restaura dados.
7. Sessao bloqueia apos inatividade.

## Cenario de Teste End-to-End

Fixture de teste:

```text
Escola: Escola Municipal Exemplo
Direcao: Maria Direcao
Pessoa: Ana Coordenacao
Cargo: Coordenacao
Necessidade: Computador da secretaria nao liga
Local: Secretaria
Equipamento: PC Secretaria 01
```

Cenario:

1. iniciar app sem banco;
2. configurar escola e direcao;
3. cadastrar cargo e pessoa;
4. executar primeiro acesso da pessoa;
5. criar equipamento;
6. registrar necessidade vinculada ao equipamento;
7. marcar pessoa envolvida;
8. registrar andamento;
9. marcar como resolvido com direcao ou apoio de gestao;
10. consultar historico;
11. exportar CSV;
12. restaurar em banco limpo;
13. validar que necessidade, pessoa, equipamento e historico existem.

## Smoke Test Manual

Comandos atuais do scaffold:

```text
npm ci
npm run typecheck
npm run build
```

Comando futuro de release:

```text
npm run tauri -- build --ci --no-sign
```

O comando Tauri completo depende de Rust, Cargo e toolchain Windows.

## Fora de Escopo da Entrega Final

- notificacoes externas;
- e-mail automatico;
- WhatsApp;
- mobile;
- nuvem;
- multiunidade;
- dashboards analiticos;
- anexos;
- fotos;
- IA;
- controle pedagogico;
- dados pessoais de estudantes.

## Checklist de Prontidao

- [ ] capacidades obrigatorias implementadas;
- [ ] criterios de aceite passam;
- [ ] docs refletem comportamento;
- [ ] testes E2E passam;
- [ ] smoke test real passa;
- [ ] repo limpo;
- [ ] remoto atualizado.
