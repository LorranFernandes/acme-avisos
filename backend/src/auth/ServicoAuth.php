<?php

namespace Auth;

use Exception;
use Utils\Criptografia; 

class ServicoAuth
{
    public function __construct(
        private RepositorioAuth $repositorio,
        private Sessao $sessao
    ) {
    }

    public function login(string $email, string $senha): ?array
    {
        if (!str_ends_with($email, '@acme.br')) {
            throw new Exception("O email deve ser institucional (@acme.br).");
        }

        $usuario = $this->repositorio->buscarPorEmail($email);
        if (!$usuario) {
            return null;
        }

        if (Criptografia::verificarSenha($senha, $usuario->getSenhaHash(), $usuario->getSalt())) {
            $this->sessao->registrarUsuario($usuario);
            
            $dadosUsuario = $usuario->toArray();
            Criptografia::limparDadosSensiveis($dadosUsuario);
            
            return $dadosUsuario;
        }

        return null;
    }

    public function logout(): void
    {
        $this->sessao->logout();
    }

    public function obterUsuarioDaSessao(): ?array
    {
        return $this->sessao->obterDadosUsuario();
    }
}