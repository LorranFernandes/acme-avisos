<?php

use Auth\ServicoAuth;
use Auth\RepositorioAuth;
use Auth\Sessao;
use Kahlan\Plugin\Double;
use Exception;

use function Kahlan\describe;
use function Kahlan\expect;
use function Kahlan\it;

describe("ServicoAuth", function() {

    beforeEach(function() {
        // Cria um repositório e sessao simulados para testar o serviço
        $this->repositorio = Double::instance(['implements' => RepositorioAuth::class]);
        // 'methods' foi usado para sobrescrever o construtor
        $this->sessao = Double::instance(['extends' => Sessao::class, 'methods' => ['__construct']]);

        $this->servico = new ServicoAuth($this->repositorio, $this->sessao);
    });

    describe("validao do login", function() {

        it("lança exceção se o email não for institucional (@acme.br)", function() {
            $emailInvalido = "usuario@gmail.com";
            
            expect(function() use ($emailInvalido) {
                $this->servico->login($emailInvalido, '123456');
            })->toThrow(new Exception("O email deve ser institucional (@acme.br)."));
        });

    });

});