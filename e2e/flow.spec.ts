import { expect, test } from "@playwright/test";

test.describe("Teenee shell", () => {
  test("profile home loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Profile|Salut/i).first()).toBeVisible();
  });

  test("navigation tabs work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL("/");

    await page.getByRole("link", { name: "Dump" }).click();
    await expect(page).toHaveURL(/\/dump/);

    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page).toHaveURL(/\/progress/);

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test("settings page shows conversation mode", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText("Conversation mode")).toBeVisible();
    await expect(page.getByText("Turn trigger phrases")).toBeVisible();
  });

  test("offline page loads", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: "Offline" })).toBeVisible();
  });
});

test.describe("Lesson flow", () => {
  test.skip(!process.env.OPENAI_API_KEY, "Requires OPENAI_API_KEY for parser");

  test("text dump to confirm screen", async ({ page }) => {
    const dumpText =
      "Today we learned greetings: bonjour, salut, comment ça va. Formal vs informal.";

    const dumpResponse = await page.request.post("/api/lessons/dump/text", {
      data: { text: dumpText },
    });
    expect(dumpResponse.ok()).toBeTruthy();

    const dumpPayload = (await dumpResponse.json()) as { lessonId: string };
    expect(dumpPayload.lessonId).toBeTruthy();

    await page.goto(`/lessons/${dumpPayload.lessonId}/confirm`);
    await expect(page.getByRole("heading", { name: /confirm/i })).toBeVisible({ timeout: 30_000 });
  });
});
