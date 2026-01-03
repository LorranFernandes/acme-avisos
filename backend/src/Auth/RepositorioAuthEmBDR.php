<?php

namespace Auth;

use PDO;

class RepositorioAuthEmBDR implements RepositorioAuth
{
    public function __construct(
        private PDO $pdo
    ) {
    }

    public function buscarPorEmail(string $email): ?Usuario
    {
        $sql = "SELECT id, nome, email, senha_hash, sal FROM usuarios WHERE email = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$email]);
        
        $dados = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$dados) {
            return null;
        }

        return new Usuario(
            (int)$dados['id'],
            $dados['nome'],
            $dados['email'],
            $dados['senha_hash'],
            $dados['sal'] 
        );
    }
}