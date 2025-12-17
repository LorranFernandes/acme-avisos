export interface UsuarioData {
    id: number;
    nome: string;
    email: string;
}

export class Usuario {
    public id: number;
    public nome: string;
    public email: string;

    constructor(id: number, nome: string, email: string) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public getPrimeiroNome(): string {
        const nomes = this.nome.split(' ');
        return nomes[0];
    }

    public toJSON(): UsuarioData {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email
        };
    }

    public static fromJSON(data: UsuarioData): Usuario {
        return new Usuario(data.id, data.nome, data.email);
    }

}