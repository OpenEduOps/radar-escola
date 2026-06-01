import { expect, test } from "@playwright/test";

test("executa fluxo utilizavel do Radar Escola", async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 760 });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Configurar escola" }),
  ).toBeVisible();
  await page.getByLabel("Nome da escola").fill("Escola Municipal Esperanca");
  await page.getByLabel("Nome da direcao").fill("Maria Direcao");
  await page.getByLabel("Usuario da direcao").fill("direcao");
  await page.getByLabel("Senha da direcao").fill("senha-direcao");
  await page.getByLabel("Resposta de recuperacao").fill("Centro");
  await page.getByRole("button", { name: "Configurar escola" }).click();

  await expect(
    page.getByText("O Radar de Necessidades ja pode ser usado."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Radar de Necessidades" }),
  ).toBeVisible();

  await page.getByLabel("Nome da pessoa").fill("Ana Coordenacao");
  await page.getByLabel("Usuario da pessoa").fill("ana");
  await page.getByLabel("Cargo ou funcao").fill("Coordenacao pedagogica");
  await page.getByLabel("Perfil").selectOption({ label: "Usuario comum" });
  await page.getByRole("button", { name: "Cadastrar pessoa" }).click();
  await expect(
    page.getByText("Pessoa cadastrada com senha temporaria 123456."),
  ).toBeVisible();

  await page
    .getByLabel("Titulo da necessidade")
    .fill("Computador da secretaria nao liga");
  await page
    .getByLabel("Descricao da necessidade")
    .fill("Equipamento usado para atendimento esta parado.");
  await page.getByLabel("Local").fill("Secretaria");
  await page.getByLabel("Prioridade").selectOption({ label: "Alta" });
  await page.getByLabel("Envolver Ana Coordenacao").check();
  await page.getByRole("button", { name: "Registrar necessidade" }).click();

  await expect(page.getByText("Necessidade registrada no Radar.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Computador da secretaria nao liga/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await page.getByLabel("Usuario").fill("ana");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(
    page.getByRole("heading", { name: "Ana Coordenacao" }),
  ).toBeVisible();
  await page.getByLabel("Nova senha").fill("senha-ana");
  await page.getByLabel("Resposta de recuperacao").fill("Vila Nova");
  await page.getByRole("button", { name: "Concluir primeiro acesso" }).click();

  await expect(page.getByText("Primeiro acesso concluido.")).toBeVisible();
  await page
    .getByLabel("Atualizacao de andamento")
    .fill("Fonte foi testada e precisa de troca.");
  await page.getByRole("button", { name: "Registrar andamento" }).click();
  await expect(page.getByText("Andamento registrado.")).toBeVisible();
  await expect(
    page.getByText("Fonte foi testada e precisa de troca."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marcar como resolvido" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Sair" }).click();
  await page.getByLabel("Usuario").fill("direcao");
  await page.getByLabel("Senha").fill("senha-direcao");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page
    .getByLabel("Resumo da resolucao")
    .fill("Fonte substituida e atendimento retomado.");
  await page.getByRole("button", { name: "Marcar como resolvido" }).click();

  await expect(
    page.getByText("Necessidade marcada como resolvida."),
  ).toBeVisible();
  await expect(page.getByText("Resolvida por Maria Direcao")).toBeVisible();
});
