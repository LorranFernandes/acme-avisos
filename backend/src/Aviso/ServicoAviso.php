<?php

namespace Aviso;

use DateTime;
use Exception;

class ServicoAviso {
    private RepositorioAviso $repositorio;

    public function __construct(RepositorioAviso $repositorio) {
        $this->repositorio = $repositorio;
    }

    public function criarAviso(array $dados): array {

        if (empty($dados['titulo']) || empty($dados['texto'])) {
            throw new Exception("Título e texto são obrigatórios.");
        }

        if (empty($dados['periodos']) || !is_array($dados['periodos'])) {
            throw new Exception("Selecione pelo menos um período de exibição.");
        }

        if (empty($dados['setor_id'])) {
             throw new Exception("O setor é obrigatório.");
        }

        $validade = new DateTime($dados['validade']);
        $agora = new DateTime();
        
        if ($validade <= $agora) {
            throw new Exception("A data de validade deve ser futura.");
        }

        $aviso = new Aviso(
            null,
            $dados['titulo'],
            $dados['texto'],
            isset($dados['urgente']) ? (bool) $dados['urgente'] : false,
            $validade,
            $dados['publico_alvo'] ?? 'Todos', 
            (int) $dados['setor_id'],         
            (int) ($dados['autor_id'] ?? 1),  
            $dados['periodos'],
            '',
            '', 
            '', 
            null
        );

        $avisoSalvo = $this->repositorio->adicionar($aviso);

        return $avisoSalvo->toArray();
    }

    public function listarAvisos(bool $modoTv = false): array {
        return $this->repositorio->listar($modoTv);
    }
    
    public function obterRecursosCadastro(): array {
        return [
            'setores' => $this->repositorio->listarSetores(),
            'publico_alvo' => ['Todos', 'Alunos', 'Professores', 'Funcionários']
        ];
    }
}