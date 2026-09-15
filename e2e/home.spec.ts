import { expect, test } from "@playwright/test";

test("home shows the supplements hero badge", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Premium Gym Supplements", { exact: true }),
  ).toBeVisible();
});
