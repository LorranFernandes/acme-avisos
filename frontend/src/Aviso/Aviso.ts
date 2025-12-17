export class Aviso {

    public id: number;
    public titulo: string;
    public setor: string;
    public texto: string;
    public validade: Date;
    public publicoAlvo: string;
    public periodos: string[];
    public urgente: boolean;
    public setorId: number;
    public usuarioId: number;
    public corSetor: string;
    public nomeAutor: string;
    public dataCriacao: Date;

    public constructor(
        id: number, titulo: string, setor: string, texto: string, 
        validade: Date, publicoAlvo: string, periodos: string[], 
        urgente: boolean, setorId: number, usuarioId: number,
        corSetor: string,
        nomeAutor: string,
        dataCriacao: Date
    ) {
        this.id = id;
        this.titulo = titulo;
        this.setor = setor;
        this.texto = texto;
        this.validade = validade;
        this.publicoAlvo = publicoAlvo;
        this.periodos = periodos;
        this.urgente = urgente;
        this.setorId = setorId;
        this.usuarioId = usuarioId;
        this.corSetor = corSetor;
        this.nomeAutor = nomeAutor;
        this.dataCriacao = dataCriacao;
    }

    static deObjeto(obj: any): Aviso {
        return new Aviso(
            obj.id,
            obj.titulo,
            obj.setor_nome || obj.setor || 'Geral', 
            obj.texto || obj.conteudo,
            new Date(obj.validade),
            obj.publico_alvo || obj.publicoAlvo || 'Todos',
            obj.periodos ? (typeof obj.periodos === 'string' ? JSON.parse(obj.periodos) : obj.periodos) : [],
            !!obj.urgente,
            obj.setor_id || obj.setorId,
            obj.autor_id || obj.usuario_id || obj.usuarioId,
            obj.setor_cor || obj.cor_hex || '#6c757d',
            obj.nome_autor || obj.autor_nome || 'Sistema',
            obj.data_criacao ? new Date(obj.data_criacao) : new Date()
        );
    }
}