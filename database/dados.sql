USE acme_avisos;

INSERT INTO setores (nome, cor_hex) VALUES 
('Secretaria', '#0d6efd'),
('Biblioteca', '#198754'),
('Estágios', '#6f42c1'),
('Infraestrutura', '#fd7e14'),
('Assistência Social', '#dc3545');

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('MANUTENÇÃO DE REDE ELÉTRICA', 'Atenção: Haverá desligamento programado de energia no Bloco C hoje às 15h. Salvem seus trabalhos.', 1, '2026-12-31 23:59:59', 'Todos', 4, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Renovação de Livros', 'O sistema da biblioteca estará indisponível neste fim de semana para atualização.', 0, '2026-12-31 23:59:59', 'Alunos', 2, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Vaga de Estágio - Google', 'Oportunidade para alunos de Sistemas de Informação. Enviar currículo até dia 20.', 0, '2026-12-31 23:59:59', 'Alunos', 3, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Prazo Final de Rematrícula', 'Último dia para realizar a rematrícula online. Não perca o prazo para evitar trancamento.', 1, '2026-12-31 23:59:59', 'Alunos', 1, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Edital de Bolsas de Estudo', 'O edital para bolsas já estão disponíveis no site da instituição.', 0, '2026-12-31 23:59:59', 'Alunos', 5, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Entrega de Diplomas', 'Atenção formandos: A retirada dos diplomas será realizada na secretaria acadêmica apenas no turno da noite.', 0, '2026-12-31 23:59:59', 'Alunos', 1, 1);

INSERT INTO avisos (titulo, texto, urgente, validade, publico_alvo, setor_id, usuario_id) VALUES 
('Pintura do Estacionamento', 'O estacionamento estará parcialmente interditado para pintura das faixas.', 1, '2026-12-31 23:59:59', 'Todos', 4, 1);

SET @id_aviso1 = (SELECT id FROM avisos WHERE titulo LIKE 'MANUTENÇÃO%');
SET @id_aviso2 = (SELECT id FROM avisos WHERE titulo LIKE 'Renovação%');
SET @id_aviso3 = (SELECT id FROM avisos WHERE titulo LIKE 'Vaga%');
SET @id_aviso4 = (SELECT id FROM avisos WHERE titulo LIKE 'Prazo Final%');
SET @id_aviso5 = (SELECT id FROM avisos WHERE titulo LIKE 'Edital de Bolsas%');
SET @id_aviso6 = (SELECT id FROM avisos WHERE titulo LIKE 'Entrega de Diplomas%');
SET @id_aviso7 = (SELECT id FROM avisos WHERE titulo LIKE 'Pintura do Estacionamento%');

-- Períodos (1=Manhã, 2=Tarde, 3=Noite)
INSERT INTO aviso_periodos (aviso_id, periodo_id) VALUES
(@id_aviso1, 1), (@id_aviso1, 2), (@id_aviso1, 3),
(@id_aviso2, 1), (@id_aviso2, 2), (@id_aviso2, 3),
(@id_aviso3, 1), (@id_aviso3, 2), (@id_aviso3, 3),
(@id_aviso4, 1),                  
(@id_aviso5, 2), (@id_aviso5, 3),
(@id_aviso6, 3),
(@id_aviso7, 1), (@id_aviso7, 2);

SELECT * FROM avisos;