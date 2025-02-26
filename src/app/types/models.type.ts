export type viagem = {
    origem: string;
    cliente: string;
    destino: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    valor: number;
    id: number;
    descricao: string;
}

export type registro = {
    viagem_id: number;
    tipo: string;
    data: string;
    hora: string;
    descricao: string;
    img: string;
    viagem_nome: string;
}