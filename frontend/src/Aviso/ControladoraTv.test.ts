import { VisaoAviso } from "./VisaoAviso";
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ControladoraTV } from './ControladoraTv';
import { ServicoAviso } from './ServicoAviso';
import { Aviso } from './Aviso';

export class VisaoAvisoTeste implements VisaoAviso{
    public ultimoRender: any[] = [];
    public totalItens: number = 0;
    public timerAtual: number = 0;
    public tvInicializada: boolean = false;

    inicializarTV(): void {
        this.tvInicializada = true;
    }

    renderizarTV(avisos: any[], total: number, timer: number): void {
        this.ultimoRender = avisos;
        this.totalItens = total;
        this.timerAtual = timer;
    }

    atualizarTimer(tempo: number): void {
        this.timerAtual = tempo;
    }

    mostrarListagemECadastro(avisos: Aviso[]): void{}

    mostrarTV(avisos: Aviso[]): void{} 
}

describe('logica dos timers e fila da tv', () => {
    let controladora: ControladoraTV;
    let visaoTeste: VisaoAvisoTeste;
    const listarAvisosOriginal = ServicoAviso.listarAvisos;

    const dadosFicticios = [
        { id: 1, titulo: 'Aviso Teste 1' },
        { id: 2, titulo: 'Aviso Teste 2' },
        { id: 3, titulo: 'Aviso Teste 3' },
        { id: 4, titulo: 'Aviso Teste 4' }
    ];

    beforeEach(() => {
        visaoTeste = new VisaoAvisoTeste();
        
        // Substitui o retorno de listar avisos pelos dados ficticios
        ServicoAviso.listarAvisos = async () => {
            return JSON.parse(JSON.stringify(dadosFicticios)); 
        };

        vi.useFakeTimers();

        controladora = new ControladoraTV(visaoTeste);
    });

    afterEach(() => {
        controladora.parar();
        ServicoAviso.listarAvisos = listarAvisosOriginal;
        vi.useRealTimers();
    });

    it('deve inicializar e exibir os dados ficticios', async () => {
        await controladora.iniciar();
        expect(visaoTeste.tvInicializada).toBe(true);

        //Verifica o total de 4 avisos
        expect(visaoTeste.totalItens).toBe(4);
        
        // Verifica se mostra os 3 primeiros
        expect(visaoTeste.ultimoRender).toHaveLength(3);

        // Verifica se o primeiro da lista é o aviso teste 1
        expect(visaoTeste.ultimoRender[0].titulo).toBe('Aviso Teste 1');
    });

    it('deve atualizar o timer na visão Teste', async () => {
        await controladora.iniciar();

        vi.advanceTimersByTime(1000);//1s

        //Verifica se o timer esta em 29s
        expect(visaoTeste.timerAtual).toBe(29);
    });

    it('deve rotacionar os dados ficticios após 30 segundos', async () => {
        await controladora.iniciar();

        vi.advanceTimersByTime(30000);//30s

        expect(visaoTeste.ultimoRender[0].id).toBe(2);
        expect(visaoTeste.ultimoRender[1].id).toBe(3);
        expect(visaoTeste.ultimoRender[2].id).toBe(4);
    });
});