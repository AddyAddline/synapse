import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('shows hero with branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Learn MATLAB')
    await expect(page).toHaveTitle(/Synapse/)
  })

  test('has Get Started and Sign In links', async ({ page }) => {
    await page.goto('/')
    const getStarted = page.locator('a[href="/auth/signup"]').first()
    const signIn = page.locator('a[href="/auth/login"]').first()
    await expect(getStarted).toBeVisible()
    await expect(signIn).toBeVisible()
  })

  test('shows feature cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Interactive Code Editor' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'AI Tutor' })).toBeVisible()
  })

  test('shows learning phases', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Fundamentals' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Neuroscience', exact: true })).toBeVisible()
  })
})
