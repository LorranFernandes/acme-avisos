### Aluno

- **Lorran Fernandes da Cunha Parreira**

### Pré-requisitos

- [PHP 8.0+](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/)

### Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone git@gitlab.com:cefet-nf/pis-2025-2/final/lorran.git
### Configure as variáveis de ambiente

#### Backend
    
    cp backend/.env.example backend/.env


#### Frontend (se houver)
    
    cp frontend/.env.example frontend/.env


---

### Instale as dependências

#### Backend
    cd backend
    composer install

#### Frontend (em outro terminal)
    cd /frontend
    npm install

Configure o banco de dados Certifique-se de que o serviço MySQL esteja rodando (via XAMPP, Workbench ou terminal).


## Dentro do MySQL, execute:
CREATE DATABASE acme_avisos;

USE acme_avisos;

Cole o conteudo do arquivo estrutura.sql;

Cole o conteudo do arquivo dados.sql;


# Inicia servidor na porta 8000
    cd backend
    php -S localhost:8000

Terminal 2 (Frontend):

    cd frontend
    npm run dev

# Navegue até a pasta backend
    cd backend

# PHPStan (Análise Estática)
    composer stan

# Kahlan (Testes de Unidade/Integração)
    composer kahlan

# Navegue até a pasta frontend
    cd frontend

# Vitest (Testes Unitários)
    pnpm run test

# Playwright (Testes E2E)
    pnpm run test:e2e

### Referências
- Bootstrap: Bootstrap Documentation v5.3 - Acesso em: 15 dez. 2025

- Kahlan: Kahlan Documentation - Acesso em: 15 dez. 2025

- Page.js: Page.js GitHub - Acesso em: 15 dez. 2025

- PHPStan: PHPStan User Guide - Acesso em: 15 dez. 2025

- Playwright: Playwright Documentation - Acesso em: 15 dez. 2025

- Vitest: Vitest Documentation - Acesso em: 15 dez. 2025