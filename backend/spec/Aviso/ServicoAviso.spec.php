<?php

use Aviso\ServicoAviso;
use Aviso\RepositorioAviso;
use Kahlan\Plugin\Double;

use function Kahlan\beforeEach;
use function Kahlan\describe;
use function Kahlan\expect;
use function Kahlan\it;

describe("ServicoAviso", function() {

    beforeEach(function() {
        // Cria um repositório simulado para testar o serviço, sem acessar o banco de dados
        $this->repositorio = Double::instance(['implements' => RepositorioAviso::class]);
        
        $this->servico = new ServicoAviso($this->repositorio);
    });

    describe("validacao para criar aviso", function() {

        it("lança exceção se título ou texto estiverem vazios", function() {
            $dadosInvalidos = ['titulo' => '', 'texto' => 'texto'];
            
            expect(function() use ($dadosInvalidos) {
                $this->servico->criarAviso($dadosInvalidos);
            })->toThrow(new Exception("Título e texto são obrigatórios."));
        });

        it("lança exceção se o período for vazio", function() {
            $dados = ['titulo' => 'Teste', 'texto' => 'Teste', 'periodos' => []];

            expect(function() use ($dados) {
                $this->servico->criarAviso($dados);
            })->toThrow(new Exception("Selecione pelo menos um período de exibição."));
        });

        it("lança exceção se o id do setor for vazio", function() {
            $dados = [
                'titulo' => 'Teste', 
                'texto' => 'Teste', 
                'periodos' => ['M'],
                'setor_id' => ''
            ];

            expect(function() use ($dados) {
                $this->servico->criarAviso($dados);
            })->toThrow(new Exception("O setor é obrigatório."));
        });

        it("lança exceção se a data de validade estiver no passado", function() {
            $ontem = (new DateTime('-1 day'))->format('Y-m-d H:i:s');
            
            $dados = [
                'titulo' => 'Teste',
                'texto' => 'Teste',
                'periodos' => ['M'],
                'setor_id' => 1,
                'validade' => $ontem
            ];

            expect(function() use ($dados) {
                $this->servico->criarAviso($dados);
            })->toThrow(new Exception("A data de validade deve ser futura."));
        });
    });

});