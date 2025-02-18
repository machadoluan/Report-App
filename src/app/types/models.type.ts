export type viagem = {
    origem: string,
    destino: string, 
    data_inicio: string,
    data_fim: string,
    status: string,
    id: number
}

export type registro = {
    viagem_id: number,  
    tipo: string,
    data: string,
    hora: string,
    descricao: string
}