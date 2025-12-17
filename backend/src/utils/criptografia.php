<?php

namespace Utils;

use Config\Configuracao;

class Criptografia
{
    private static string $algoritmo = 'sha512';

    public static function gerarSalt(): string
    {
        return bin2hex(random_bytes(16));
    }

    public static function hashSenha(string $senha, string $salt): string
    {
        $pepper = Configuracao::getPepper();
        $senhaComPimenta = $senha . $pepper;
        $senhaComSal = $salt . $senhaComPimenta;
        
        return hash(self::$algoritmo, $senhaComSal);
    }

    public static function verificarSenha(string $senha, string $hash, string $salt): bool
    {
        $hashCalculado = self::hashSenha($senha, $salt);
        return hash_equals($hash, $hashCalculado);
    }

    public static function gerarTokenSessao(): string
    {
        return bin2hex(random_bytes(64));
    }

    /**
     * @param array<string, mixed> $dados
     */
    public static function limparDadosSensiveis(array &$dados): void
    {
        unset($dados['senha'], $dados['senha_hash'], $dados['salt']);
    }
}