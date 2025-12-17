<?php

require_once 'vendor/autoload.php';
require_once 'src/connection/conexao.php';

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

use phputil\router\{Router, HttpRequest, HttpResponse};
use function phputil\cors\cors;

use Auth\Sessao; 
use Auth\ServicoAuth;
use Auth\RepositorioAuthEmBDR;
use Aviso\ServicoAviso;
use Aviso\RepositorioAvisoEmBDR;

$pdo = conectarBanco();

$sessao = new Sessao(); 
$repoAuth = new RepositorioAuthEmBDR($pdo);
$servicoAuth = new ServicoAuth($repoAuth, $sessao); 

$repoAviso = new RepositorioAvisoEmBDR($pdo);
$servicoAviso = new ServicoAviso($repoAviso);

$app = new Router();

$corsOrigin = getenv('CORS_ORIGIN') ?: 'http://localhost:5173';

$app->use(cors([
    'origin' => $corsOrigin,
    'credentials' => true, 
    'methods' => ['GET', 'POST', 'DELETE', 'OPTIONS'],
    'allowedHeaders' => ['Content-Type', 'Authorization']
]));

$app->post('/login', function (HttpRequest $req, HttpResponse $res) use ($servicoAuth) {
    try {
        $body = (array) $req->body();
        $email = $body['email'] ?? '';
        $senha = $body['senha'] ?? '';

        $usuario = $servicoAuth->login($email, $senha);

        if ($usuario) {
            $res->json([
                'success' => true,
                'usuario' => $usuario, 
                'mensagem' => 'Login realizado com sucesso'
            ]);
        } else {
            $res->status(401)->json(['success' => false, 'error' => 'Credenciais inválidas']);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        $res->status(500)->json(['error' => 'Erro interno no login']);
    }
});

$app->post('/logout', function (HttpRequest $req, HttpResponse $res) use ($servicoAuth) {
    $servicoAuth->logout();
    $res->json(['success' => true]);
});

$app->get('/me', function (HttpRequest $req, HttpResponse $res) use ($servicoAuth) {
    $usuario = $servicoAuth->obterUsuarioDaSessao();
    
    if ($usuario) {
        $res->json(['success' => true, 'usuario' => $usuario]);
    } else {
        $res->status(401)->json(['success' => false, 'error' => 'Sessão expirada']);
    }
});

$app->get('/avisos', function (HttpRequest $req, HttpResponse $res) use ($servicoAviso) {
    try {
        $modoTv = isset($_GET['tv']); 
        
        $avisos = $servicoAviso->listarAvisos($modoTv);
        $res->json($avisos);
    } catch (Exception $e) {
        $res->status(500)->json(['error' => 'Erro ao listar avisos']);
    }
});

$app->post('/avisos', function (HttpRequest $req, HttpResponse $res) use ($servicoAviso, $servicoAuth) {
    
    $usuarioLogado = $servicoAuth->obterUsuarioDaSessao();
    if (!$usuarioLogado) {
        $res->status(403)->json(['error' => 'Acesso negado. Faça login.']);
        return;
    }

    try {
        $dados = (array) $req->body();

        $dados['autor_id'] = $usuarioLogado['id']; 

        $novoAviso = $servicoAviso->criarAviso($dados);
        
        $res->status(201)->json(['success' => true, 'aviso' => $novoAviso]);
    } catch (Exception $e) {
        $res->status(400)->json(['error' => $e->getMessage()]);
    }
});

$app->get('/recursos', function (HttpRequest $req, HttpResponse $res) use ($servicoAviso) {
    try {
        $dados = $servicoAviso->obterRecursosCadastro();
        $res->json($dados);
    } catch (Exception $e) {
        $res->status(500)->json(['error' => 'Erro ao buscar recursos: ' . $e->getMessage()]);
    }
});

$app->listen();