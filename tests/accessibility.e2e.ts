import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility — WCAG 2.1 AA', () => {
  test('homepage passes axe audit', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    if (results.violations.length > 0) {
      console.error(
        'Axe violations:\n',
        results.violations
          .map(
            v =>
              `[${v.impact}] ${v.id}: ${v.description}\n  ${v.nodes.map(n => n.target).join(', ')}`
          )
          .join('\n')
      )
    }

    expect(results.violations).toHaveLength(0)
  })
})
