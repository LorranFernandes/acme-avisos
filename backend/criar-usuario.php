<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/connection/conexao.php'; 

use Utils\Criptografia;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Ususario Criado
$usuario = [
    'nome' => 'Funcionario Teste',
    'email' => 'teste@acme.br',
    'senha' => '123456'
];

try {
    $pdo = conectarBanco();
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$usuario['email']]);
    
    if ($stmt->fetch()) {
        echo "Aviso: O usuário {$usuario['email']} já existe na base de dados." . PHP_EOL;
        exit;
    }

    $salt = Criptografia::gerarSalt(); 
    $hash = Criptografia::hashSenha($usuario['senha'], $salt); 

    $sql = "INSERT INTO usuarios (nome, email, senha_hash, sal) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$usuario['nome'], $usuario['email'], $hash, $salt]);

    echo "Sucesso: Usuário [{$usuario['email']}] criado." . PHP_EOL;

} catch (Exception $e) {
    die("Erro ao criar usuario: " . $e->getMessage() . PHP_EOL);
}