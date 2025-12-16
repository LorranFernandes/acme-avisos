CREATE DATABASE IF NOT EXISTS acme_avisos;
USE acme_avisos;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, -- Deve terminar em @acme.br
    senha_hash VARCHAR(255) NOT NULL, -- SHA-512
    sal VARCHAR(255) NOT NULL, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE setores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cor_hex VARCHAR(7) NOT NULL
);

CREATE TABLE periodos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL
);

CREATE TABLE avisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    urgente BOOLEAN DEFAULT FALSE,
    validade DATETIME NOT NULL,
    publico_alvo VARCHAR(100) NOT NULL, -- Ex: Alunos, Todos
    setor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setor_id) REFERENCES setores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE aviso_periodos (
    aviso_id INT NOT NULL,
    periodo_id INT NOT NULL,
    PRIMARY KEY (aviso_id, periodo_id),
    FOREIGN KEY (aviso_id) REFERENCES avisos(id) ON DELETE CASCADE,
    FOREIGN KEY (periodo_id) REFERENCES periodos(id)
);

-- Dados iniciais
INSERT INTO periodos (nome, hora_inicio, hora_fim) VALUES 
('Manhã', '00:00:00', '12:59:59'),
('Tarde', '13:00:00', '17:59:59'),
('Noite', '18:00:00', '23:59:59');
