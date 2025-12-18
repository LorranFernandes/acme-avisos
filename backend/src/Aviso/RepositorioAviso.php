<?php

namespace Aviso;

interface RepositorioAviso {
    public function adicionar(Aviso $aviso): Aviso;
    /** * 
     * @return array<int, array<string, mixed>> 
     */
    public function listar(bool $apenasValidos = false): array;
    /** * 
     * @return array<int, array<string, mixed>> 
     */
    public function listarSetores(): array;
}