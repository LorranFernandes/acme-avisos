<?php


function conectarBanco(): PDO {
    try {
        $dbName = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'acme_avisos';
        $dbHost = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
        $port = $_ENV['DB_PORT'];
        $dbUser = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
        $dbPass = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: 'root';
        $dbCharset = $_ENV['DB_CHARSET'] ?? getenv('DB_CHARSET') ?: 'utf8mb4';

        $dsn = sprintf('mysql:dbname=%s;host=%s;port=%s;charset=%s', $dbName, $dbHost, $port, $dbCharset);
        
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        error_log($e->getMessage()); 
        die('Erro crítico de conexão com o banco de dados.');
    }
}