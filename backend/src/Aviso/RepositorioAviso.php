<?php

namespace Aviso;

interface RepositorioAviso {
    public function adicionar(Aviso $aviso): Aviso;
    /** 
     * @return Aviso[] 
     * */
    public function listar(bool $apenasValidos = false): array;
        /** 
     * @return Setores[] 
     * */
    public function listarSetores(): array;
}