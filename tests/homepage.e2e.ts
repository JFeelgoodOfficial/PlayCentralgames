import { test, expect } from '@playwright/test'

test.describe('Play Central Games — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page title contains Play Central Games', async ({ page }) => {
    await expect(page).toHaveTitle(/Play Central Games/i)
  })

  test('hero heading renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Games Worth Gathering For/i })).toBeVisible()
  })

  test('Bunny Warren section heading renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Bunny Warren Card Game/i })).toBeVisible()
  })

  test('nav links are present and not broken', async ({ page }) => {
    const navLinks = page.locator('nav a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href')
      expect(href).not.toBe('#')
      expect(href).not.toBeNull()
    }
  })

  test('no image has a broken src', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src')
      expect(src).not.toBeNull()
      expect(src).not.toBe('')
    }
  })

  test('zero console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    expect(errors).toHaveLength(0)
  })

  test('rules section is visible', async ({ page }) => {
    await page.locator('#rules').scrollIntoViewIfNeeded()
    await expect(page.locator('#rules')).toBeVisible()
    await expect(page.getByRole('heading', { name: /How to Play/i })).toBeVisible()
  })

  test('buy section renders', async ({ page }) => {
    await page.locator('#buy').scrollIntoViewIfNeeded()
    await expect(page.locator('#buy')).toBeVisible()
  })

  test('about section renders', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Why We Make Games/i })).toBeVisible()
  })
})
