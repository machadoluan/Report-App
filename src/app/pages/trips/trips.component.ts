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
import { Router } from '@angular/router';
import { CreateTripsComponent } from "../../components/create-trips/create-trips.component";
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ViagensService } from '../../service/viagens.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';


@Component({
  selector: 'app-trips',
  imports: [InputIcon,
    IconField,
    InputTextModule,
    TableModule,
    Tag,
    CommonModule,
    DialogModule,
    SelectButtonModule,
    FormsModule,
    CreateTripsComponent,
    OverlayBadgeModule,
    PopoverModule,
    ButtonModule,
    ConfirmDialog
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild('dt1') dt1!: Table;


  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];
  viagens: viagem[] = [];
  filteredViagens: any[] = [];
  filter: boolean = false
  selectedViagem: viagem[] = []
  selectedFilters: string[] = [];
  searchText: string = '';

  constructor(
    private router: Router,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    console.log(this.selectedViagem)
    this.loadTrips()
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
    if (!dadosExportacao || dadosExportacao.length === 0) {
      console.error('Nenhum dado para exportar.');
      return;
    }

    console.log('Dados para exportação:', dadosExportacao);

    // Cria uma planilha vazia
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Adiciona um título na primeira linha
    XLSX.utils.sheet_add_aoa(worksheet, [['Relatório de Viagens']], { origin: 'A1' });

    // Adiciona cabeçalhos personalizados
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['ID', 'Origem', 'Destino', 'Data Início', 'Data Fim', 'Status', 'Cliente', 'Valor (R$)', 'Descrição', 'Data de Criação', 'Data de Upload']
    ], { origin: 'A2' });

    // Adiciona os dados à planilha
    XLSX.utils.sheet_add_json(worksheet, dadosExportacao, {
      header: ['id', 'origem', 'destino', 'dataInicio', 'dataFim', 'status', 'cliente', 'valor', 'descricao', 'createdAt', 'updatedAt'],
      skipHeader: true, // Não adiciona o cabeçalho novamente
      origin: 'A3' // Começa a adicionar os dados a partir da linha 3
    });

    // Adiciona uma fórmula para somar os valores na coluna "valor"
    const totalRow = dadosExportacao.length + 3; // +3 para pular o título e os cabeçalhos
    XLSX.utils.sheet_add_aoa(worksheet, [['Total', , , , , , , { f: `SUM(H3:H${totalRow})` }, , ,]], { origin: `A${totalRow + 1}` });

    // Mescla células para o título
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } } // Mescla da coluna A até K na primeira linha
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
    for (let col = 0; col < 11; col++) { // 11 colunas no total
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
      for (let col = 0; col < 11; col++) { // 11 colunas no total
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

          // Formata as colunas de data
          if (col === 9 || col === 10) { // createdAt e updatedAt
            cell.z = 'dd/mm/yyyy hh:mm:ss';
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

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;
        this.filteredViagens = this.viagens;
        console.log(data)
      },
      (err) => {
        console.error("Deu error:", err)
      }
    )
  }

  openViagem(viagem: any) {
    console.log(viagem)
    this.router.navigate(['/trip', viagem[0].id])
  }

  openFilter() {
    this.filter = !this.filter
  }

  createTrip() {
    this.dialogCreateTrips.showDialog()
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

  // Atualiza a pesquisa global
  applyFilterGlobal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtrando por:', filterValue); // Verifique no console se o valor está correto

    // Verifica se a referência da tabela existe antes de tentar filtrar
    if (this.dt1) {
      this.dt1.filterGlobal(filterValue, 'contains');
    }

    // Filtra as viagens para exibição na versão mobile
    if (!filterValue) {
      this.filteredViagens = [...this.viagens]; // Restaura a lista original
      return;
    }

    this.filteredViagens = this.viagens.filter(viagem =>
      viagem.cliente?.toLowerCase().includes(filterValue) ||
      viagem.origem?.toLowerCase().includes(filterValue) ||
      viagem.destino?.toLowerCase().includes(filterValue) ||
      viagem.status?.toLowerCase().includes(filterValue)
    );
  }
  // Aplica os filtros e pesquisa à lista de viagens
  applyFilters() {
    this.filteredViagens = this.viagens.filter(viagem => {
      const matchesSearch = this.searchText
        ? Object.values(viagem).some(value =>
          value.toString().toLowerCase().includes(this.searchText.toLowerCase())
        )
        : true;

      const hasStatusFilter = this.selectedFilters.includes('Concluídas') || this.selectedFilters.includes('Em andamento');
      const matchesFilters = !hasStatusFilter || this.selectedFilters.some(filter => {
        if (filter === 'Concluídas') return viagem.status === 'Concluída';
        if (filter === 'Em andamento') return viagem.status === 'Em andamento';
        return false;
      });

      return matchesSearch && matchesFilters;
    });

    // Aplica ordenação após a filtragem
    if (this.selectedFilters.includes('A a Z')) {
      this.filteredViagens.sort((a, b) => a.cliente.localeCompare(b.cliente));
    }
    if (this.selectedFilters.includes('Z a A')) {
      this.filteredViagens.sort((a, b) => b.cliente.localeCompare(a.cliente));
    }
    if (this.selectedFilters.includes('Primeiro até o último')) {
      this.filteredViagens.sort((a, b) => a.id - b.id);
    }
    if (this.selectedFilters.includes('Último até o primeiro')) {
      this.filteredViagens.sort((a, b) => b.id - a.id);
    }
    if (this.selectedFilters.includes('Valores: maior para menor')) {
      this.filteredViagens.sort((a, b) => b.valor - a.valor);
    }
    if (this.selectedFilters.includes('Valores: menor para maior')) {
      this.filteredViagens.sort((a, b) => a.valor - b.valor);
    }
  }



  delete(event: Event, viagem: any[]) {

    const ids = viagem.map(v => v.id)

    console.log('viagem', ids)

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
        this.tripService.deleteTripMultiple(ids).subscribe(
          (res) => {
            this.toastrService.showSucess(`Viagem apagada com sucesso!`)
            window.location.reload();

          },
          (err) => {
            this.toastrService.showError(`Erro ao deletar viagem, tente novamente mais tarde!`)

          }
        )

      },
      reject: () => {
      },
    });
  }
}