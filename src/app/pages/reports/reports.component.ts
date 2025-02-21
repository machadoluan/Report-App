import { Component, OnInit, ViewChild } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { Table, TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  imports: [InputIcon, IconField, InputTextModule, TableModule, CommonModule, DialogModule, SelectButtonModule, FormsModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];
  registros: registro[] = [
    { viagem_id: 1, tipo: 'Inicio de jornada', data: '01/01/2021', hora: '08:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 2, tipo: 'Inicio de jornada', data: '10/02/2021', hora: '09:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 3, tipo: 'Inicio de jornada', data: '20/03/2021', hora: '10:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 4, tipo: 'Inicio de jornada', data: '05/04/2021', hora: '11:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 5, tipo: 'Inicio de jornada', data: '15/05/2021', hora: '12:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 6, tipo: 'Inicio de jornada', data: '25/06/2021', hora: '13:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 7, tipo: 'Inicio de jornada', data: '05/07/2021', hora: '14:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 8, tipo: 'Inicio de jornada', data: '15/08/2021', hora: '15:00', descricao: 'Inicio de jornada realizado com sucesso' },
    { viagem_id: 9, tipo: 'Inicio de jornada', data: '25/09/2021', hora: '16:00', descricao: 'Inicio de jornada realizado com sucesso' }
  ];

  viagens: viagem[] = [
    { id: 1, origem: 'São Paulo', destino: 'Rio de Janeiro', data_inicio: '01/01/2021', data_fim: '05/01/2021', status: 'Concluída', cliente: 'Cliente A', valor: 1000 },
    { id: 2, origem: 'Brasília', destino: 'Salvador', data_inicio: '10/02/2021', data_fim: '15/02/2021', status: 'Concluída', cliente: 'Cliente B', valor: 1500 },
    { id: 3, origem: 'Curitiba', destino: 'Porto Alegre', data_inicio: '20/03/2021', data_fim: '25/03/2021', status: 'Concluída', cliente: 'Cliente C', valor: 1200 },
    { id: 4, origem: 'Manaus', destino: 'Belém', data_inicio: '05/04/2021', data_fim: '10/04/2021', status: 'Concluída', cliente: 'Cliente D', valor: 1300 },
    { id: 5, origem: 'Fortaleza', destino: 'Recife', data_inicio: '15/05/2021', data_fim: '20/05/2021', status: 'Concluída', cliente: 'Cliente E', valor: 1400 },
    { id: 6, origem: 'Goiânia', destino: 'Campo Grande', data_inicio: '25/06/2021', data_fim: '30/06/2021', status: 'Concluída', cliente: 'Cliente F', valor: 1100 },
    { id: 7, origem: 'Florianópolis', destino: 'Joinville', data_inicio: '05/07/2021', data_fim: '10/07/2021', status: 'Concluída', cliente: 'Cliente G', valor: 1600 },
    { id: 8, origem: 'Vitória', destino: 'Belo Horizonte', data_inicio: '15/08/2021', data_fim: '20/08/2021', status: 'Concluída', cliente: 'Cliente H', valor: 1700 },
    { id: 9, origem: 'Natal', destino: 'João Pessoa', data_inicio: '25/09/2021', data_fim: '30/09/2021', status: 'Concluída', cliente: 'Cliente I', valor: 1800 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
  ];

  selectedRegistros: any[] = []

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.registros = this.registros.map(registro => ({
      ...registro,
      viagem_nome: this.getViagemNome(registro.viagem_id) // Adiciona o nome da viagem
  }));
  }


  getViagemNome(viagem_id: number): string {
    const viagem = this.viagens.find(v => v.id === viagem_id);
    return viagem ? `${viagem.origem} → ${viagem.destino}` : 'Desconhecido';
  }

  showDialog() {
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  export() {
    if (this.selectedFormat === 'pdf') {
      this.exportToPDF();
    } else if (this.selectedFormat === 'excel') {
      this.exportToExcel();
    }
    this.hideDialog();
  }

  exportToPDF() {
    console.log('Exportando para PDF...');
    // Lógica para exportar para PDF

    console.log(this.selectedRegistros)

  }

  exportToExcel() {
    console.log('Exportando para Excel...');
  
    // Verifica se selectedRelatorios está vazio e usa relatorios como fallback
    const dadosExportacao = this.selectedRegistros.length > 0 ? this.selectedRegistros : this.registros;
  
    // Mapeia os dados para substituir viagem_id pelo nome da viagem
    const dadosComNomeViagem = dadosExportacao.map(registro => ({
      ...registro,
      viagem_nome: this.getViagemNome(registro.viagem_id) // Adiciona o nome da viagem
    }));
  
    // Verifica os dados para exportação
    console.log('Dados para exportação:', dadosComNomeViagem);
  
    // Cria uma planilha vazia
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
  
    // Adiciona um título na primeira linha
    XLSX.utils.sheet_add_aoa(worksheet, [['Relatório de Início de Jornada']], { origin: 'A1' });
  
    // Adiciona cabeçalhos personalizados
    XLSX.utils.sheet_add_aoa(worksheet, [['Viagem', 'Tipo', 'Data', 'Hora', 'Descrição']], { origin: 'A2' });
  
    // Adiciona os dados à planilha
    XLSX.utils.sheet_add_json(worksheet, dadosComNomeViagem, {
      header: ['viagem_nome', 'tipo', 'data', 'hora', 'descricao'], // Usa viagem_nome no lugar de viagem_id
      skipHeader: true, // Não adiciona o cabeçalho novamente
      origin: 'A3' // Começa a adicionar os dados a partir da linha 3
    });
  
    // Mescla células para o título
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Mescla da coluna A até E na primeira linha
    ];
  
    // Aplica estilos ao título
    const titleCell = worksheet['A1'];
    if (titleCell) {
      titleCell.s = {
        font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: '4F81BD' } } // Cor de fundo azul
      };
    }
  
    // Aplica estilos aos cabeçalhos
    for (let col = 0; col < 5; col++) {
      const headerCell = worksheet[XLSX.utils.encode_cell({ r: 1, c: col })];
      if (headerCell) {
        headerCell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: '8DB4E2' } } // Cor de fundo azul claro
        };
      }
    }
  
    // Aplica estilos aos dados
    const totalRow = dadosComNomeViagem.length + 2; // +2 para pular o título e os cabeçalhos
    for (let row = 2; row <= totalRow; row++) {
      for (let col = 0; col < 5; col++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          cell.s = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            },
            alignment: { horizontal: 'center' }
          };
        }
      }
    }
  
    // Congela os cabeçalhos
    worksheet['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomRight' };
  
    // Autoajusta as colunas
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 15; // Largura mínima
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
      }
      worksheet['!cols'] = worksheet['!cols'] || [];
      worksheet['!cols'][col] = { wch: maxWidth };
    }
  
    // Cria um novo workbook e adiciona a planilha
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
  
    // Gera o arquivo Excel e faz o download
    XLSX.writeFile(workbook, 'relatorio_inicio_jornada.xlsx');
  }

  applyFilterGlobal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt1.filterGlobal(filterValue, 'contains');
  }

}

