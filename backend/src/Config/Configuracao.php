<?php

namespace Config;

class Configuracao
{
    public static function get(string $chave, mixed $padrao = null): mixed
    {
        if (array_key_exists($chave, $_ENV)) {
            return $_ENV[$chave];
        }
        $valor = getenv($chave);
        return ($valor !== false) ? $valor : $padrao;
    }

    public static function getPepper(): string
    {
        $pepper = self::get('ACME_PEPPER');
        if (empty($pepper) || !is_string($pepper)) {
            throw new \Exception('ACME_PEPPER não configurado');
        }
        return $pepper;
    }

    /**
     * @return array{lifetime: int, cookie_name: string, secure: bool, httponly: bool, samesite: string}
     */
    public static function getSessionConfig(): array
    {
        $lifetime = self::get('SESSION_LIFETIME', 3600);
        if (is_string($lifetime)) {
            $lifetimeInt = filter_var($lifetime, FILTER_VALIDATE_INT);
            $lifetime = ($lifetimeInt !== false) ? $lifetimeInt : 3600;
        } elseif (!is_int($lifetime)) {
            $lifetime = 3600;
        }
        
        $cookieName = self::get('SESSION_COOKIE_NAME', 'quiz_session');
        $secure = self::get('SESSION_COOKIE_SECURE', 'false');
        $httponly = self::get('SESSION_COOKIE_HTTPONLY', 'true');
        $samesite = self::get('SESSION_COOKIE_SAMESITE', 'Lax');
        
        if (!is_string($cookieName) || !is_string($secure) && !is_bool($secure) || !is_string($httponly) && !is_bool($httponly) || !is_string($samesite)) {
            throw new \RuntimeException('Configuração de sessão inválida');
        }
        
        return [
            'lifetime' => $lifetime,
            'cookie_name' => $cookieName,
            'secure' => is_bool($secure) ? $secure : ($secure === 'true'),
            'httponly' => is_bool($httponly) ? $httponly : ($httponly !== 'false'),
            'samesite' => $samesite
        ];
    }
}
