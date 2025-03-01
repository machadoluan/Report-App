import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { Router } from '@angular/router';
import { ReportsService } from '../../service/reports.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmDialog } from 'primeng/confirmdialog';



@Component({
  selector: 'app-reports',
  imports: [InputIcon, IconField, InputTextModule, TableModule, CommonModule, DialogModule, SelectButtonModule, FormsModule, OverlayBadgeModule, CreateReportsComponent, ConfirmDialog],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;
  @ViewChild('dt1') dt1!: Table;
  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];

  registros: registro[] = [];

  viagens: viagem[] = [];

  selectedRegistros: any[] = [];
  filteredReports: any[] = [];
  selectedFilters: string[] = [];
  filter: boolean = false
  searchText: string = '';

  constructor(
    private router: Router,
    private reportService: ReportsService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,

  ) {

  }

  ngOnInit(): void {
    this.loadReports()
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (data: any) => {
        this.registros = data.reportsFormatados
        this.filteredReports = data.reportsFormatados

        console.log(data.reportsFormatados)
      },
      error: (err) => {
        console.error(err)
      }
    })
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtrando por:', filterValue); // Verifique no console se o valor está correto

    // Verifica se a referência da tabela existe antes de tentar filtrar
    if (this.dt1) {
      this.dt1.filterGlobal(filterValue, 'contains');
    }

    // Filtra as viagens para exibição na versão mobile
    if (!filterValue) {
      this.filteredReports = [...this.registros]; // Restaura a lista original
      return;
    }

    this.filteredReports = this.registros.filter(report =>
      report.data?.toLowerCase().includes(filterValue) ||
      report.hora?.toLowerCase().includes(filterValue) ||
      report.descricao?.toLowerCase().includes(filterValue) ||
      report.viagem_nome?.toLowerCase().includes(filterValue) ||
      report.tipo?.toLowerCase().includes(filterValue)
    );

    console.log(this.filteredReports)
  }

  openFilter() {
    this.filter = !this.filter
  }

  toggleFilter(filter: string) {
    const index = this.selectedFilters.indexOf(filter);
    if (index === -1) {
      this.selectedFilters.push(filter);
    } else {
      this.selectedFilters.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredReports = this.registros.filter(registro => {
      const matchesSearch = this.searchText
        ? Object.values(registro).some(value =>
          value.toString().toLowerCase().includes(this.searchText)
        )
        : true;

      const matchesFilters = this.selectedFilters.length === 0 ||
        this.selectedFilters.some(filter => {
          if (filter === 'hoje') return registro.data === new Date().toLocaleDateString('pt-BR');
          if (filter === 'jornada') return registro.tipo === "Inicio de Jornada" || registro.tipo === "Fim de Jornada";
          if (filter === 'almoço') return registro.tipo === "Inicio de Almoço" || registro.tipo === "Fim de Almoço";
          if (filter === 'pausa') return registro.tipo === "Inicio de Pausa" || registro.tipo === "Fim de Pausa";
          if (filter === 'espera') return registro.tipo === "Inicio de Espera" || registro.tipo === "Fim de Espera";
          if (filter === 'viagem') return registro.tipo === "Reinicio de Viagem";
          return false;
        });

      return matchesSearch && matchesFilters;
    });

    if (this.filteredReports.length === 0) {
      console.log('Nenhum encontrado');
    }
  }


  createReport() {
    this.dialogCreateReports.showDialog()
  }


  openReports(report: any) {
    console.log(report)

    this.router.navigate(['/report', report[0].id])

  }

  openReportsMobile(report: any) {
    this.router.navigate(['/report', report.id])
  }


  delete(event: Event, report: any[]) {

    const ids = report.map(r => r.id)

    console.log('report', ids)

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Você deseja deletar permanente?`,
      header: 'Deletar viagem',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.reportService.deleteTripMultiple(ids).subscribe(
          (res) => {
            this.toastrService.showSucess(`Registro apagado com sucesso!`)
            window.location.reload();

          },
          (err) => {
            this.toastrService.showError(`Erro ao deletar registro, tente novamente mais tarde!`)

          }
        )

      },
      reject: () => {
      },
    });
  }
}

