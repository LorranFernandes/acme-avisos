import page from 'page';
import { VisaoAviso } from './VisaoAviso';
import { Aviso } from './Aviso';
import { ServicoAviso } from './ServicoAviso';
import { ServicoAuth } from '../Auth/ServicoAuth';
import * as bootstrap from 'bootstrap'; 

export class VisaoAvisoEmDOM implements VisaoAviso {

    inicializarTV(): void {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="container-fluid bg-light text-dark vh-100 d-flex flex-column p-0 overflow-hidden">
                
                <div class="row m-0 bg-primary text-white p-4 shadow mb-4">
                    <div class="col-12 text-center">
                        <h1 class="display-4 fw-bold text-uppercase ls-2 mb-0">Quadro de Avisos</h1>
                        <p class="lead opacity-75 mb-0">Universidade ACME</p>
                    </div>
                </div>

                <div id="area-avisos" class="row g-4 flex-grow-1 align-content-center justify-content-center px-5">
                    <div class="col-12 text-center mt-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2 text-muted">Carregando avisos...</p>
                    </div>
                </div>

                <div class="row mx-0 mt-auto border-top bg-white py-3 align-items-center shadow-lg">
                    <div class="col-md-4 d-flex align-items-center px-4">
                        <a href="/login" class="btn btn-outline-primary px-4">
                            <i class="bi bi-person-circle me-2"></i>Fazer Login
                        </a>
                    </div>
                    
                    <div class="col-md-4 text-center">
                         <span class="badge bg-primary fs-5 shadow-sm">Próximo aviso em: <span id="timer-regressivo">--</span>s</span>
                    </div>
                    
                    <div class="col-md-4 text-end px-4">
                        <span class="fs-4 fw-bold d-block text-dark" id="contador-paginacao">--</span>
                        <small class="text-muted">Atualizado às: <span id="hora-att">--:--</span></small>
                    </div>
                </div>
            </div>
        `;
    }

    renderizarTV(avisosVisiveis: Aviso[], totalFila: number, tempoRestante: number): void {
        const container = document.getElementById('area-avisos');
        const contadorEl = document.getElementById('contador-paginacao');
        const timerEl = document.getElementById('timer-regressivo');
        const horaEl = document.getElementById('hora-att');
        
        if (!container) return;
        if (contadorEl) contadorEl.innerText = `${avisosVisiveis.length} de ${totalFila}`;
        if (timerEl) timerEl.innerText = tempoRestante.toString();
        if (horaEl) horaEl.innerText = new Date().toLocaleTimeString();

        if (avisosVisiveis.length === 0) {
            container.innerHTML = `<div class="col-12 alert alert-info text-center fs-3 opacity-75">Não há avisos para este horário.</div>`;
            return;
        }

        container.innerHTML = avisosVisiveis.map(a => this.gerarCardHTML(a)).join('');
    }

    atualizarTimer(tempo: number): void {
        const timerEl = document.getElementById('timer-regressivo');
        if (timerEl) timerEl.innerText = tempo.toString();
    }

    private gerarCardHTML(aviso: Aviso): string {
        const icone = aviso.urgente ? '<i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>' : '';
        
        const periodosTexto = aviso.periodos.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');

        return `
        <div class="col-12 col-md-4 d-flex">
            <div class="card w-100 bg-white border-0 shadow text-dark">
                
                <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-4">
                    <span class="badge" style="background-color: ${aviso.corSetor}">${aviso.setor}</span>
                    ${aviso.urgente ? '<span class="badge bg-danger animate-pulse shadow-sm">URGENTE</span>' : ''}
                </div>
                
                <div class="card-body d-flex flex-column px-4">
                    <h4 class="card-title fw-bold mb-3 text-dark">${icone}${aviso.titulo}</h4>
                    <p class="card-text fs-5 flex-grow-1 text-secondary" style="white-space: pre-wrap;">${aviso.texto}</p>
                </div>
                
                <div class="card-footer bg-light border-top text-muted small pb-3 px-4">
                    <div class="row g-2">
                        <div class="col-6">
                            <i class="bi bi-people-fill me-1 text-primary"></i> <strong>Público:</strong> ${aviso.publicoAlvo}
                        </div>
                        <div class="col-6 text-end">
                            <i class="bi bi-clock-history me-1 text-primary"></i> <strong>Exibição:</strong> ${periodosTexto}
                        </div>

                        <div class="col-12 border-top my-1"></div> <div class="col-6">
                            Criado em: ${new Date(aviso.dataCriacao).toLocaleDateString('pt-BR')}
                        </div>
                        <div class="col-6 text-end text-danger fw-bold">
                            Válido até: ${new Date(aviso.validade).toLocaleDateString('pt-BR')}
                        </div>

                        <div class="col-12 text-center mt-1 fst-italic opacity-75">
                            Autor: ${aviso.nomeAutor}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    mostrarTV(avisos: Aviso[]) {}

    async mostrarListagemECadastro(avisos: Aviso[]): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;
        const recursos = await ServicoAviso.obterRecursos();
        const usuario = ServicoAuth.obterUsuarioLogado();

        app.innerHTML = `
            <nav class="navbar navbar-dark bg-primary mb-4">
              <div class="container">
                <span class="navbar-brand mb-0 h1">Avisos</span>
                <div class="d-flex align-items-center gap-3">
                    <span class="text-white small">Olá, ${usuario ? usuario.nome : 'Usuário'}</span>
                    <button id="btn-logout" class="btn btn-light btn-sm">Sair</button>
                </div>
              </div>
            </nav>

            <div class="container">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2>Listagem de Avisos</h2>
                <button class="btn btn-success" id="btn-novo-aviso">+ Novo Aviso</button>
              </div>

              <div class="card shadow-sm">
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>Título</th>
                            <th>Setor</th>
                            <th>Períodos</th>
                            <th>Público</th>
                            <th>Urgente</th>
                            <th>Validade</th>
                        </tr>
                        </thead>
                        <tbody id="tabela-corpo"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal fade" id="modalAviso" tabindex="-1">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Novo Aviso</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">
                    <form id="form-aviso">
                      <div class="row">
                        <div class="col-md-8 mb-3">
                          <label class="form-label">Título</label>
                          <input type="text" id="titulo" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                           <label class="form-label">Setor</label>
                           <select id="setor" class="form-select">
                              ${recursos.setores.map(s => `<option value="${s.id}">${s.nome}</option>`).join('')}
                           </select>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Texto do Aviso</label>
                        <textarea id="texto" class="form-control" rows="4" required></textarea>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Validade</label>
                          <input type="datetime-local" id="validade" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Público-Alvo</label>
                           <select id="publico" class="form-select">
                              ${recursos.publico_alvo.map(p => `<option value="${p}">${p}</option>`).join('')}
                           </select>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label d-block">Períodos</label>
                        <div class="form-check form-check-inline"><input class="form-check-input chk-periodo" type="checkbox" value="manha" checked> Manhã</div>
                        <div class="form-check form-check-inline"><input class="form-check-input chk-periodo" type="checkbox" value="tarde" checked> Tarde</div>
                        <div class="form-check form-check-inline"><input class="form-check-input chk-periodo" type="checkbox" value="noite" checked> Noite</div>
                      </div>
                      <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="urgente">
                        <label class="form-check-label text-danger fw-bold" for="urgente">Marcar como URGENTE</label>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btn-salvar">Salvar Aviso</button>
                  </div>
                </div>
              </div>
            </div>
        `;

        this.renderizarTabelaAdmin(avisos);
        this.configurarEventosAdmin();
    }

    private renderizarTabelaAdmin(avisos: Aviso[]) { 
        const tbody = document.getElementById('tabela-corpo');
        if (!tbody) return;
        if (avisos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4">Nenhum aviso cadastrado.</td></tr>';
            return;
        }
        
        tbody.innerHTML = avisos.map(aviso => {
            const periodos = aviso.periodos.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');

            return `
            <tr>
                <td>${aviso.titulo}</td>
                <td><span class="badge" style="background-color: ${aviso.corSetor}">${aviso.setor}</span></td>
                <td>${periodos}</td>
                <td>${aviso.publicoAlvo}</td>
                <td>${aviso.urgente ? '<span class="badge bg-danger">Sim</span>' : '<span class="badge bg-light text-dark border">Não</span>'}</td>
                <td>${new Date(aviso.validade).toLocaleDateString('pt-BR')}</td>
            </tr>
            `;
        }).join('');
    }

    private configurarEventosAdmin() { 
        const modalEl = document.getElementById('modalAviso');
        const modal = modalEl ? new bootstrap.Modal(modalEl) : null;

        document.getElementById('btn-novo-aviso')?.addEventListener('click', () => {
            modal?.show();
        });

        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            if (confirm('Deseja realmente sair?')) {
                await ServicoAuth.logout();
                page('/login');
            }
        });

        document.getElementById('btn-salvar')?.addEventListener('click', async () => {
            const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
            const texto = (document.getElementById('texto') as HTMLTextAreaElement).value;
            const setorId = (document.getElementById('setor') as HTMLSelectElement).value;
            const validade = (document.getElementById('validade') as HTMLInputElement).value;
            const publico = (document.getElementById('publico') as HTMLSelectElement).value;
            const urgente = (document.getElementById('urgente') as HTMLInputElement).checked;

            const periodos: string[] = [];
            document.querySelectorAll('.chk-periodo:checked').forEach((el) => {
                periodos.push((el as HTMLInputElement).value);
            });

            if (!titulo || !texto || !validade) {
                alert("Preencha os campos obrigatórios!");
                return;
            }

            const dados = {
                titulo,
                texto, 
                setor_id: parseInt(setorId), 
                validade, 
                publico_alvo: publico,
                periodos: periodos, 
                urgente: urgente
            };

            const sucesso = await ServicoAviso.criarAviso(dados);

            if (sucesso) {
                alert("Aviso criado com sucesso!");
                modal?.hide();
                window.location.reload(); 
            } else {
                alert("Erro ao criar aviso. Verifique se a data de validade é futura");
            }
        });
    }
}