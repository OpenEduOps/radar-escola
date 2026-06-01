import { expect, test } from "@playwright/test";

test("executa o CRUD do playground com status relacionado", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Iniciar playground" }).click();

  await expect(page.getByRole("heading", { name: "Master detalhe" })).toBeVisible();
  await expect(page.getByText("Tabela: playground")).toBeVisible();
  await expect(page.getByText("Tabela: status_playground")).toBeVisible();
  await expect(page.locator(".master-header")).toContainText("Nome");
  await expect(page.locator(".master-header")).toContainText("Status");
  await expect(page.locator(".master-header")).toContainText("Acoes");

  const firstRow = page.locator(".master-row").filter({ hasText: "Primeiro uso" });
  await firstRow.getByRole("button", { name: "Editar" }).click();
  await expect(page.locator("article.detail-panel form.detail-form")).toBeVisible();

  await page
    .locator(".master-row")
    .filter({ hasText: "Radar inicial" })
    .locator(".master-select")
    .click();
  await expect(page.locator("article.detail-panel form.detail-form")).toHaveCount(0);

  await firstRow.locator(".master-select").click();
  await expect(page.locator("article.detail-panel form.detail-form")).toHaveCount(0);

  await page.getByLabel("Status playground").selectOption({ label: "Status B" });
  await expect(page.getByText("Selecionado: Status B")).toBeVisible();

  await page.getByRole("button", { name: "Cadastrar status" }).click();
  await page.getByLabel("Nome do status").fill("Status E2E");
  await page.getByRole("button", { name: "Salvar status" }).click();
  await expect(page.getByText("Selecionado: Status E2E")).toBeVisible();

  await page.getByRole("button", { name: "Cadastrar playground" }).click();
  const createForm = page.locator("form.playground-create-form");
  await createForm.getByLabel("Nome").fill("Registro E2E");
  await createForm
    .getByLabel("Descricao")
    .fill("Criado por teste E2E do playground.");
  await createForm.getByLabel("Status").selectOption({ label: "Status E2E" });
  await createForm.getByRole("button", { name: "Salvar playground" }).click();

  const createdRow = page
    .locator(".master-row")
    .filter({ hasText: "Registro E2E" });
  await expect(createdRow).toBeVisible();
  await expect(createdRow).toContainText("Status E2E");

  await createdRow.getByRole("button", { name: "Editar" }).click();
  const editForm = page.locator("article.detail-panel form.detail-form");
  await editForm.getByLabel("Nome").fill("Registro E2E editado");
  await editForm
    .getByLabel("Descricao")
    .fill("Editado por teste E2E do playground.");
  await editForm.getByLabel("Status").selectOption({ label: "Status C" });
  await editForm.getByRole("button", { name: "Salvar" }).click();

  const editedRow = page
    .locator(".master-row")
    .filter({ hasText: "Registro E2E editado" });
  await expect(editedRow).toBeVisible();
  await expect(editedRow).toContainText("Status C");
  await expect(page.getByText("codigo_status")).toBeVisible();
  await expect(page.getByText("SP-003")).toBeVisible();

  await editedRow.getByRole("button", { name: "Excluir" }).click();
  await expect(editedRow).toHaveCount(0);
});
