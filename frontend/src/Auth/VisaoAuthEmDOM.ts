import page from 'page';
import { VisaoAuth } from './VisaoAuth';
import { ServicoAuth } from './ServicoAuth';

export class VisaoAuthEmDOM implements VisaoAuth {
    
    mostrarLogin(): void {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="container d-flex justify-content-center align-items-center vh-100 bg-light">
              <div class="card shadow p-4" style="max-width: 400px; width: 100%">
                <div class="card-body">
                  <h3 class="card-title text-center mb-4">Fazer Login</h3>
                  <form id="form-login">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email Institucional</label>
                      <input type="email" class="form-control" id="email" placeholder="usuario@acme.br" required>
                    </div>
                    <div class="mb-3">
                      <label for="senha" class="form-label">Senha</label>
                      <div class="input-group">
                        <input type="password" class="form-control" id="senha" placeholder="******" required>
                        <button class="btn btn-outline-secondary" type="button" id="btn-toggle-senha">Ver</button>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" id="btn-submit">Entrar</button>
                  </form>
                  <div class="mt-3 text-center">
                    <a href="/" class="text-decoration-none small">Voltar para a TV</a>
                  </div>
                </div>
              </div>
            </div>
        `;

        this.configurarEventos();
    }

    private configurarEventos(): void {
        const btnToggle = document.getElementById('btn-toggle-senha');
        const inputSenha = document.getElementById('senha') as HTMLInputElement;
        
        btnToggle?.addEventListener('click', () => {
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                btnToggle.textContent = 'Ocultar';
            } else {
                inputSenha.type = 'password';
                btnToggle.textContent = 'Ver';
            }
        });

        const form = document.getElementById('form-login');
        const inputEmail = document.getElementById('email') as HTMLInputElement;
        const btnSubmit = document.getElementById('btn-submit') as HTMLButtonElement;

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = inputEmail.value;
            const senha = inputSenha.value;

            const textoOriginal = btnSubmit.innerText;
            btnSubmit.disabled = true;
            btnSubmit.innerText = 'Autenticando...';

            const sucesso = await ServicoAuth.login(email, senha);

            if (sucesso) {
                page('/cadastro-avisos');
            } else {
                alert('Login falhou! Verifique email e senha.');
                btnSubmit.disabled = false;
                btnSubmit.innerText = textoOriginal;
            }
        });
    }
}