import { test, expect } from '@playwright/test'

test.describe('Authentication Pages', () => {
  test('login page loads with form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('signup page loads with form', async ({ page }) => {
    await page.goto('/auth/signup')
    await expect(page.getByText('Create your account')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/auth/login')
    const signupLink = page.locator('a[href="/auth/signup"]')
    await expect(signupLink).toBeVisible()
  })

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/auth/signup')
    const loginLink = page.locator('a[href="/auth/login"]')
    await expect(loginLink).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })

  test('learn page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/learn')
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })

  test('lesson page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/learn/1')
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })
})
