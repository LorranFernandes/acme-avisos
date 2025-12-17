import { Usuario } from "./Usuario";

const USUARIO_STORAGE_KEY = (import.meta as any).env?.VITE_USUARIO_STORAGE_KEY || "usuario_logado";
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

export class ServicoAuth {
  private static usuarioAtual: Usuario | null = null;

  static inicializar(): void {
    const dados = localStorage.getItem(USUARIO_STORAGE_KEY);
    if (dados) {
      try {
        const objetoLiteral = JSON.parse(dados);
        this.usuarioAtual = Usuario.fromJSON(objetoLiteral);
      } catch (e) {
        this.logout();
      }
    }
  }

  static async login(email: string, senha: string): Promise<boolean> {
    if (!email.endsWith("@acme.br")) {
        alert("O email deve ser institucional (@acme.br)");
        return false;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.usuario) {
            const usuario = Usuario.fromJSON(data.usuario);
            this.definirUsuario(usuario);
            return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/logout`, { 
          method: "POST",
          credentials: "include"
      });
    } catch (error) {
      console.error("Erro ao fazer logout na API", error);
    } finally {
      this.usuarioAtual = null;
      localStorage.removeItem(USUARIO_STORAGE_KEY);
    }
  }

  static async verificarSessao(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include'
      });

      if (response.ok) {
          const data = await response.json();
          if (data.usuario) {
              const usuario = Usuario.fromJSON(data.usuario);
              this.definirUsuario(usuario);
              return true;
          }
      }
      this.usuarioAtual = null;
      localStorage.removeItem(USUARIO_STORAGE_KEY);
      return false;

    } catch (error) {
      return false;
    }
  }

  static obterUsuarioLogado(): Usuario | null {
    return this.usuarioAtual;
  }

  static estaLogado(): boolean {
    return this.usuarioAtual !== null;
  }

  private static definirUsuario(usuario: Usuario): void {
    this.usuarioAtual = usuario;
    localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario.toJSON()));
  }
}