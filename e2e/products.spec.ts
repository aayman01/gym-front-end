import { expect, test } from "@playwright/test";

test("products catalog loads and can open a product", async ({ page }) => {
  await page.goto("/products");
  await expect(
    page.getByRole("heading", { name: "All Supplements" }),
  ).toBeVisible();

  const viewProduct = page.getByRole("link", { name: "View Product" }).first();
  if ((await viewProduct.count()) === 0) {
    return;
  }

  await viewProduct.click();
  await expect(page).toHaveURL(/\/products\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
