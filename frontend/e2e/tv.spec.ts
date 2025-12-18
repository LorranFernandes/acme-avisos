import { test, expect } from '@playwright/test';

test.describe('Usabilidade da TV', () => {
  
  test.beforeEach(async ({ page }) => {
    // Responde automaticamente um aviso no caso de acessar a rota de avisos
    // Necessario para mandar os dados falsos antes de pegar os dados reais no back
    await page.route('**/avisos*', async route => {
      const json = [
        { id: 1, titulo: 'Aviso Teste', texto: 'texto', urgente: true, periodos: ['manha'], corSetor: '#ff0000', setor: 'TI', dataCriacao: new Date(), validade: new Date(Date.now() + 86400000) }
      ];
      await route.fulfill({ json });
    });

    await page.goto('/');
  });

  test('deve carregar o título da Universidade', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Quadro de Avisos');
    await expect(page.getByText('Universidade ACME')).toBeVisible();
  });

  test('deve exibir o botão de login', async ({ page }) => {
    const btnLogin = page.locator('a[href="/login"]');
    await expect(btnLogin).toBeVisible();
    await expect(btnLogin).toHaveText('Fazer Login');
  });

  test('deve renderizar os avisos vindos da API', async ({ page }) => {
    await expect(page.getByText('Aviso Teste')).toBeVisible();
    await expect(page.getByText('URGENTE')).toBeVisible();
  });
});