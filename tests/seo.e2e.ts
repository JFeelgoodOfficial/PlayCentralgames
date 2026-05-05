import { test, expect } from '@playwright/test'

const pages = ['/']

for (const route of pages) {
  test.describe(`SEO — ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route)
    })

    test('has meta description', async ({ page }) => {
      const desc = page.locator('meta[name="description"]')
      await expect(desc).toHaveCount(1)
      const content = await desc.getAttribute('content')
      expect(content).not.toBeNull()
      expect(content!.length).toBeGreaterThan(10)
    })

    test('has og:title', async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    })

    test('has og:description', async ({ page }) => {
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(1)
    })

    test('has og:image', async ({ page }) => {
      const ogImage = page.locator('meta[property="og:image"]')
      await expect(ogImage).toHaveCount(1)
      const content = await ogImage.getAttribute('content')
      expect(content).toMatch(/^https?:\/\//)
    })

    test('has canonical link', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveCount(1)
      const href = await canonical.getAttribute('href')
      expect(href).toContain('playcentralgames.com')
    })

    test('page title contains Play Central Games', async ({ page }) => {
      await expect(page).toHaveTitle(/Play Central Games/i)
    })
  })
}
