import { Aviso } from "./Aviso";

export interface VisaoAviso {
    mostrarListagemECadastro(avisos: Aviso[]): void;
    inicializarTV(): void;
    renderizarTV(avisosVisiveis: Aviso[], totalFila: number, tempoRestante: number): void;
    atualizarTimer?(tempo: number): void;
    mostrarTV(avisos: Aviso[]): void; 
}