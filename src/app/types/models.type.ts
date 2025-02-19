export type viagem = {
    origem: string;
    cliente: string;
    destino: string;
    data_inicio: string;
    data_fim: string;
    status: string;
    valor: number;
    id: number;
}

export type registro = {
    viagem_id: number;
    tipo: string;
    data: string;
    hora: string;
    descricao: string;
    // img: string;
}