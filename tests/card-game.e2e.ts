import { test, expect } from '@playwright/test'

test.describe('Bunny Warren — Online Card Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#play')
  })

  test('play section is present', async ({ page }) => {
    await expect(page.locator('#play')).toBeVisible()
  })

  test('online game UI renders on desktop', async ({ page }) => {
    await page.locator('#play').scrollIntoViewIfNeeded()
    await expect(
      page.getByRole('heading', { name: /Bunny Warren.*Online/i })
    ).toBeVisible()
  })

  test('online game UI renders on mobile touch viewport', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')
    await page.locator('#play').scrollIntoViewIfNeeded()
    await expect(page.locator('#play')).toBeVisible()
  })

  test('no interactive element inside play section has href="#"', async ({ page }) => {
    const anchors = page.locator('#play a')
    const count = await anchors.count()
    for (let i = 0; i < count; i++) {
      const href = await anchors.nth(i).getAttribute('href')
      expect(href).not.toBe('#')
    }
  })
})
