<?php

namespace Aviso;

use PDO;

class RepositorioAvisoEmBDR implements RepositorioAviso {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function adicionar(Aviso $aviso): Aviso {
        $this->pdo->beginTransaction();

        try {
            $sql = "INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) 
                    VALUES (:titulo, :texto, :urgente, :validade, :publico, :setor, :usuario)";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':titulo' => $aviso->getTitulo(),
                ':texto' => $aviso->getTexto(),
                ':urgente' => $aviso->isUrgente() ? 1 : 0,
                ':validade' => $aviso->getValidade()->format('Y-m-d H:i:s'),
                ':publico' => $aviso->getPublicoAlvo(),
                ':setor' => $aviso->getSetorId(),
                ':usuario' => $aviso->getUsuarioId()
            ]);

            $idAviso = (int) $this->pdo->lastInsertId();
            $aviso->setId($idAviso);

            $stmtPeriodo = $this->pdo->prepare("SELECT id FROM periodos WHERE nome = ?");
            $stmtInsertRel = $this->pdo->prepare("INSERT INTO aviso_periodos (aviso_id, periodo_id) VALUES (?, ?)");

            foreach ($aviso->getPeriodos() as $nomePeriodo) {
                $stmtPeriodo->execute([$nomePeriodo]);
                $idPeriodo = $stmtPeriodo->fetchColumn();
                
                if ($idPeriodo) {
                    $stmtInsertRel->execute([$idAviso, $idPeriodo]);
                }
            }

            $this->pdo->commit();
            return $aviso;

        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function listar(bool $apenasValidos = false): array {
        $sql = "SELECT DISTINCT a.*, s.nome as nome_setor, s.cor_hex, u.nome as nome_autor 
                FROM avisos a
                JOIN setores s ON a.setor_id = s.id
                JOIN usuarios u ON a.usuario_id = u.id";

        if ($apenasValidos) {
            $sql .= " JOIN aviso_periodos ap ON a.id = ap.aviso_id
                      JOIN periodos p ON ap.periodo_id = p.id";

            // O aviso não pode estar vencido
            // A hora atual do servidor deve estar dentro do período (Manhã/Tarde/Noite)
            $sql .= " WHERE a.validade >= NOW() 
                      AND CURTIME() BETWEEN p.hora_inicio AND p.hora_fim";
        
            $sql .= " ORDER BY a.urgente DESC, a.data_criacao DESC";
        } else {
            $sql .= " ORDER BY a.data_criacao DESC";
        }

        $stmt = $this->pdo->query($sql);
        $avisosData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $avisosObjetos = [];

        $stmtPeriodos = $this->pdo->prepare(
            "SELECT p.nome FROM periodos p 
             JOIN aviso_periodos ap ON p.id = ap.periodo_id 
             WHERE ap.aviso_id = ?"
        );

        foreach ($avisosData as $dado) {
            $stmtPeriodos->execute([$dado['id']]);
            $periodos = $stmtPeriodos->fetchAll(PDO::FETCH_COLUMN);

            $aviso = new Aviso(
                $dado['id'],
                $dado['titulo'],
                $dado['texto'],
                (bool) $dado['urgente'],
                new \DateTime($dado['validade']),
                $dado['publico_alvo'],
                $dado['setor_id'],
                $dado['usuario_id'],
                $periodos
            );

            $aviso->setDadosExibicao($dado['nome_setor'], $dado['cor_hex'], $dado['nome_autor']);
            
            $avisosObjetos[] = $aviso->toArray();
        }

        return $avisosObjetos;
    }

    public function listarSetores(): array {
        $stmt = $this->pdo->query("SELECT id, nome FROM setores ORDER BY nome");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}