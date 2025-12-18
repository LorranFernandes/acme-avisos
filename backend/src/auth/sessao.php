<?php

namespace Auth;

use Config\Configuracao; // Importando sua classe

class Sessao
{
    public function __construct()
    {
        $this->iniciarSessao();
    }

    public function registrarUsuario(Usuario $usuario): void
    {
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = $usuario->getId();
        $_SESSION['usuario_nome'] = $usuario->getNome();
        $_SESSION['usuario_email'] = $usuario->getEmail();
    }

    public function obterUsuarioId(): ?int
    {
        return $_SESSION['usuario_id'] ?? null;
    }

    public function estaLogado(): bool
    {
        return isset($_SESSION['usuario_id']);
    }

    public function logout(): void
    {
        $_SESSION = [];
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        
        session_destroy();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function obterDadosUsuario(): ?array 
    {
        if (!$this->estaLogado()) return null;
        
        return [
            'id' => $_SESSION['usuario_id'],
            'nome' => $_SESSION['usuario_nome'],
            'email' => $_SESSION['usuario_email']
        ];
    }

    private function iniciarSessao(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $config = Configuracao::getSessionConfig();

            session_set_cookie_params([
                'lifetime' => $config['lifetime'],
                'path' => '/',
                'domain' => '',
                'secure' => $config['secure'],
                'httponly' => $config['httponly'],
                'samesite' => $config['samesite']
            ]);
            
            session_name($config['cookie_name']);
            
            session_start();
        }
    }
}