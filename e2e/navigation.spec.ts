import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('Get Started button navigates to signup', async ({ page }) => {
    await page.goto('/')
    await page.locator('a[href="/auth/signup"]').first().click()
    await page.waitForURL(/\/auth\/signup/)
    expect(page.url()).toContain('/auth/signup')
  })

  test('Sign In button navigates to login', async ({ page }) => {
    await page.goto('/')
    await page.locator('a[href="/auth/login"]').first().click()
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })

  test('login form shows error with empty submission', async ({ page }) => {
    await page.goto('/auth/login')
    // Click sign in without entering credentials
    await page.locator('button[type="submit"]').click()
    // Browser should show HTML5 validation (required fields)
    const emailInput = page.locator('input[type="email"]')
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    )
    expect(isInvalid).toBe(true)
  })
})
