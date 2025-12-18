    import { test, expect } from '@playwright/test';

    test.describe('Autenticação', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
        });

        test('deve permitir mudar a visibilidade da senha', async ({ page }) => {
            const inputSenha = page.locator('#senha');
            const btnVer = page.locator('#btn-toggle-senha');

            // Verifica se a senha a do tipo password
            await expect(inputSenha).toHaveAttribute('type', 'password');

            await btnVer.click();

            // Verifica se a senha a do tipo text
            await expect(inputSenha).toHaveAttribute('type', 'text');
            // Verifica se o botão mudou para Ocultar
            await expect(btnVer).toHaveText('Ocultar');
        });

        test('deve exibir erro (alert) ao falhar login', async ({ page }) => {
            // Responde automaticamente com erro 401 no caso de acessar a rota de login
            await page.route('**/login', async route => {
                await route.fulfill({ 
                    status: 401, body: JSON.stringify({ sucesso: false }) 
                });
            });

            await page.fill('#email', 'errado@acme.br');
            await page.fill('#senha', 'errado');

            // É necessario para o playwright encontrar o alert, pois senão 
            // o teste trava antes de conseguir ler o alert
            const dialogEspera = page.waitForEvent('dialog');

            await page.click('#btn-submit');

            const dialog = await dialogEspera;
            // Verifica se o alert apareceu
            expect(dialog.message()).toContain('Login falhou');
            await dialog.accept();
        });

        test('deve mudar para */cadastro-avisos após login com sucesso', async ({ page }) => {
            // Responde automaticamente com codigo 200 no caso de acessar a rota de login
            await page.route('**/login', async route => {
                await route.fulfill({ 
                    status: 200, json: { token: 'jwt', usuario: { nome: 'Usuario Test' } } 
                });
            });

            await page.fill('#email', 'teste@acme.br');
            await page.fill('#senha', '123456');
            await page.click('#btn-submit');

            // Verifica se a pagina mudou para */cadastro-avisos
            await expect(page).toHaveURL(/\/cadastro-avisos/);
            // Verifica se apareceu o nome do usuario
            await expect(page.getByText('Olá, Usuario Test')).toBeVisible();
        });
    });