<?php

namespace Aviso;

class Aviso implements \JsonSerializable {
    private ?int $id;
    private string $titulo;
    private string $texto;
    private bool $urgente;
    private \DateTime $validade;
    private string $publicoAlvo;
    private int $setorId;
    private int $usuarioId;
    private array $periodos; 
    
    private ?string $nomeSetor = null;
    private ?string $corSetor = null;
    private ?string $nomeAutor = null;

    public function __construct(
        ?int $id,
        string $titulo,
        string $texto,
        bool $urgente,
        \DateTime $validade,
        string $publicoAlvo,
        int $setorId,
        int $usuarioId,
        array $periodos = []
    ) {
        $this->id = $id;
        $this->titulo = $titulo;
        $this->texto = $texto;
        $this->urgente = $urgente;
        $this->validade = $validade;
        $this->publicoAlvo = $publicoAlvo;
        $this->setorId = $setorId;
        $this->usuarioId = $usuarioId;
        $this->periodos = $periodos;
    }

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): void { $this->id = $id; }
    public function getTitulo(): string { return $this->titulo; }
    public function getTexto(): string { return $this->texto; }
    public function isUrgente(): bool { return $this->urgente; }
    public function getValidade(): \DateTime { return $this->validade; }
    public function getPublicoAlvo(): string { return $this->publicoAlvo; }
    public function getSetorId(): int { return $this->setorId; }
    public function getUsuarioId(): int { return $this->usuarioId; }
    public function getPeriodos(): array { return $this->periodos; }
    
    public function getNomeSetor(): ?string { return $this->nomeSetor; }
    public function getCorSetor(): ?string { return $this->corSetor; }
    public function getNomeAutor(): ?string { return $this->nomeAutor; }

    public function setDadosExibicao(string $setor, string $cor, string $autor): void {
        $this->nomeSetor = $setor;
        $this->corSetor = $cor;
        $this->nomeAutor = $autor;
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'texto' => $this->texto,
            'urgente' => $this->urgente,
            'validade' => $this->validade->format('Y-m-d H:i:s'),
            'publico_alvo' => $this->publicoAlvo,
            'setor_id' => $this->setorId,
            'usuario_id' => $this->usuarioId,
            'periodos' => $this->periodos,

            'setor_nome' => $this->nomeSetor,
            'setor_cor' => $this->corSetor,
            'autor_nome' => $this->nomeAutor
        ];
    }

    public function jsonSerialize(): mixed {
        return $this->toArray();
    }
}