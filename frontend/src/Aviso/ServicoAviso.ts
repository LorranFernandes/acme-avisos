import { Aviso } from "./Aviso";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

export interface RecursosCadastro {
    setores: { id: number; nome: string }[];
    publico_alvo: string[];
}

export class ServicoAviso {
    
    static async listarAvisos(modoTv: boolean = false): Promise<Aviso[]> {
        try {
            const url = modoTv ? `${API_URL}/avisos?tv=1` : `${API_URL}/avisos`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao buscar avisos');
            
            const lista = await response.json();
            return lista.map((item: any) => Aviso.deObjeto(item));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async criarAviso(dados: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/avisos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify(dados)
            });

            if (response.status === 401 || response.status === 403) {
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = '/login';
                return false;
            }

            return response.ok;
        } catch (error) {
            console.error("Erro ao criar aviso:", error);
            return false;
        }
    }

    static async obterRecursos(): Promise<RecursosCadastro> {
        try {
            const response = await fetch(`${API_URL}/recursos`);
            if (!response.ok) throw new Error('Falha ao buscar recursos');
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar recursos:", error);
            return { setores: [], publico_alvo: [] };
        }
    }
}