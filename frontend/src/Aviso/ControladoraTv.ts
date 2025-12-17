import { Aviso } from "./Aviso";
import { ServicoAviso } from "./ServicoAviso";
import { VisaoAviso } from "./VisaoAviso";

export class ControladoraTV {
    private visao: VisaoAviso;

    private filaAvisos: Aviso[] = [];
    private intervaloBusca: any = null;
    private intervaloRelogio: any = null;

    private tempoParaTroca: number = 30; // 30s
    private contadorAtual: number = 30;
    private itensPorPagina: number = 3;

    constructor(visao: VisaoAviso) {
        this.visao = visao;
    }

    public async iniciar(): Promise<void> {
        this.visao.inicializarTV();

        await this.atualizarFilaDoServidor();
        this.atualizarView();

        this.iniciarTimers();
    }

    public parar(): void {
        if (this.intervaloBusca) clearInterval(this.intervaloBusca);
        if (this.intervaloRelogio) clearInterval(this.intervaloRelogio);
    }

    private iniciarTimers(): void {
        this.parar(); 

        this.intervaloBusca = setInterval(async () => {
            await this.atualizarFilaDoServidor();
            this.atualizarView(); 
        }, 10000);

        this.contadorAtual = this.tempoParaTroca;
        this.intervaloRelogio = setInterval(() => {
            this.contadorAtual--;
            
            if (this.visao.atualizarTimer) {
                this.visao.atualizarTimer(this.contadorAtual);
            }

            if (this.contadorAtual <= 0) {
                this.rotacionarFila();
                this.atualizarView();
                this.contadorAtual = this.tempoParaTroca;
            }
        }, 1000);
    }

    private async atualizarFilaDoServidor(): Promise<void> {
        try {
            const novosAvisos = await ServicoAviso.listarAvisos(true);

            this.filaAvisos = this.filaAvisos.filter(local => 
                novosAvisos.some(novo => novo.id === local.id)
            );

            novosAvisos.forEach(novo => {
                const index = this.filaAvisos.findIndex(local => local.id === novo.id);
                if (index === -1) {
                    this.filaAvisos.push(novo);
                } else {
                    this.filaAvisos[index] = novo;
                }
            });
        } catch (error) {
            console.error("Erro na ControladoraTV", error);
        }
    }

    private rotacionarFila(): void {
        if (this.filaAvisos.length > 1) {
            const primeiro = this.filaAvisos.shift();
            if (primeiro) this.filaAvisos.push(primeiro);
        }
    }

    private atualizarView(): void {
        // Pega os 3 primeiros para exibir
        const visiveis = this.filaAvisos.slice(0, this.itensPorPagina);
        const total = this.filaAvisos.length;
        
        this.visao.renderizarTV(visiveis, total, this.contadorAtual);
    }
}