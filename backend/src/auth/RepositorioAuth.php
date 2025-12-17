<?php

namespace Auth;

interface RepositorioAuth
{
    public function buscarPorEmail(string $email): ?Usuario;
}