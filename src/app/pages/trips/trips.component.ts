import { Component, OnInit, ViewChild } from '@angular/core';
import { viagem } from '../../types/models.type';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-trips',
  imports: [InputIcon, IconField, InputTextModule, TableModule, Tag, CommonModule, DialogModule, SelectButtonModule, FormsModule
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;

  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];
  viagens: viagem[] = [
    { id: 1, origem: 'São Paulo', destino: 'Rio de Janeiro', data_inicio: '01/01/2021', data_fim: '05/01/2021', status: 'Em andamento', cliente: 'Cliente A', valor: 1000 },
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
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
  ];

  selectedViagem: viagem[] = []

  ngOnInit(): void {
    console.log(this.selectedViagem)
  }

  viagessm(viagem: any) {
    console.log(viagem)
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

    console.log(this.selectedViagem)

  }

  exportToExcel() {
    console.log('Exportando para Excel...');

    // Verifica se selectedViagem está vazio e usa viagens como fallback
    const dadosExportacao = this.selectedViagem.length > 0 ? this.selectedViagem : this.viagens;

    // Verifica os dados para exportação
    console.log('Dados para exportação:', dadosExportacao);

    // Cria uma planilha vazia
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Adiciona um título na primeira linha
    XLSX.utils.sheet_add_aoa(worksheet, [['Relatório de Viagens']], { origin: 'A1' });

    // Adiciona cabeçalhos personalizados
    XLSX.utils.sheet_add_aoa(worksheet, [['ID', 'Origem', 'Destino', 'Data Início', 'Data Fim', 'Status', 'Cliente', 'Valor (R$)']], { origin: 'A2' });

    // Adiciona os dados à planilha
    XLSX.utils.sheet_add_json(worksheet, dadosExportacao, {
      header: ['id', 'origem', 'destino', 'data_inicio', 'data_fim', 'status', 'cliente', 'valor'],
      skipHeader: true, // Não adiciona o cabeçalho novamente
      origin: 'A3' // Começa a adicionar os dados a partir da linha 3
    });

    // Adiciona uma fórmula para somar os valores na coluna "valor"
    const totalRow = dadosExportacao.length + 3; // +3 para pular o título e os cabeçalhos
    XLSX.utils.sheet_add_aoa(worksheet, [['Total', , , , , , , { f: `SUM(H3:H${totalRow})` }]], { origin: `A${totalRow + 1}` });

    // Mescla células para o título
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } } // Mescla da coluna A até H na primeira linha
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
    for (let col = 0; col < 8; col++) {
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
    for (let row = 2; row <= totalRow; row++) {
      for (let col = 0; col < 8; col++) {
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

          // Formata a coluna "Valor (R$)" como moeda
          if (col === 7) {
            cell.z = 'R$ #,##0.00';
          }
        }
      }
    }

    // Aplica estilos à linha de total
    const totalCell = worksheet[XLSX.utils.encode_cell({ r: totalRow + 1, c: 7 })];
    if (totalCell) {
      totalCell.s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'F2F2F2' } }, // Cor de fundo cinza claro
        numFmt: 'R$ #,##0.00' // Formato de moeda
      };
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
    XLSX.writeFile(workbook, 'relatorio_viagens.xlsx');
  }

  applyFilterGlobal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filtrando por:', filterValue); // Verifique se o valor está sendo capturado
    this.dt1.filterGlobal(filterValue, 'contains');
  }

}