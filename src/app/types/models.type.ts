export type viagem = {
    origem: string;
    cliente: string;
    destino: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    valor: number;
    id: any;
    descricao: string;
    nomeFormatado?: string
}

export type registro = {
    id: number;
    viagem_id: number;
    tipo: string;
    data: string;
    hora: string;
    descricao: string;
    foto: string;
    viagem_nome: string;
}

export type faturamentos = {
    mesReferente: string;
    anoReferente: string;
    total: string
}