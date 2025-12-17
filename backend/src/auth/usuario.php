<?php

namespace Auth;

class Usuario
{
    public function __construct(
        private int $id,
        private string $nome,
        private string $email,
        private string $senhaHash,
        private string $salt
    ) {
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getSenhaHash(): string
    {
        return $this->senhaHash;
    }

    public function getSalt(): string
    {
        return $this->salt;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email
        ];
    }
}