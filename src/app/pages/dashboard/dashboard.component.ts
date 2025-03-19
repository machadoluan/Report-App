import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CreateTripsComponent } from '../../components/create-trips/create-trips.component';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { ViagensService } from '../../service/viagens.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ReportsService } from '../../service/reports.service';
import { HttpClient } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CreateTripsComponent, CreateReportsComponent, DatePickerModule, DialogModule, InputNumberModule, ReactiveFormsModule, InputTextModule,
    TextareaModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;
  showDialog: boolean = false;
  showReportDialog: boolean = false;


  viagens: viagem[] = [];
  viagemDetails: any;
  registros: registro[] = [];
  isMobile: boolean = window.innerWidth <= 750;
  ultimoRegistro: any;
  user: any;
  faturamento: any;
  dadosUpdate: FormGroup;
  editTrip: boolean = false
  fullScreenImageUrl: string | null = null;
  mesAtual: number = 0;
  anoAtual: number = 0;

  registroTipo: any[] = [
    { Tipo: 'Inicio de Jornada' },
    { Tipo: 'Fim de Jornada' },
    { Tipo: 'Inicio Refeição' },
    { Tipo: 'Fim Refeição' },
    { Tipo: 'Inicio Pausa' },
    { Tipo: 'Fim Pausa' },
    { Tipo: 'Inicio Espera' },
    { Tipo: 'Reinicio de viagem' },
  ]

  constructor(
    private tripService: ViagensService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService,
    private http: HttpClient

  ) {
    this.dadosUpdate = this.fb.group({
      cliente: [{ value: "", disabled: true }],
      origem: [{ value: "", disabled: true }],
      destino: [{ value: "", disabled: true }],
      valor: [{ value: 0, disabled: true }],
      dataInicio: [{ value: "", disabled: true }],
      dataFim: [{ value: "", disabled: true }],
      descricao: [{ value: "", disabled: true }]
    })
  }

  editar() {
    this.dadosUpdate.get('cliente')?.enable();
    this.dadosUpdate.get('origem')?.enable();
    this.dadosUpdate.get('destino')?.enable();
    this.dadosUpdate.get('dataInicio')?.enable();
    this.dadosUpdate.get('valor')?.enable();
    this.dadosUpdate.get('dataFim')?.enable();
    this.dadosUpdate.get('descricao')?.enable();
    this.editTrip = true
  }

  ngOnInit(): void {
    this.loadTrips()
    this.loadReports()

    const dataAtual = new Date();
    this.mesAtual = dataAtual.getMonth() + 1;
    this.anoAtual = dataAtual.getFullYear();
  }

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;

        // Define o mês e ano atual
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth() + 1; // getMonth() retorna 0-11
        const anoAtual = dataAtual.getFullYear();

        // Calcula o faturamento do mês atual
        this.faturamento = this.calcularFaturamento(this.viagens, mesAtual, anoAtual);
      },
      (err) => {
        console.error("Error ao buscar viagens:", err)
      }
    )
  }

  loadReports() {
    this.reportService.getReports().subscribe(
      (data: any) => {
        this.registros = data.reportsFormatados

        this.ultimoRegistro = this.registros[this.registros.length - 1]
      },
      (err) => {
        console.error("Error ao buscar registros:", err)
      }
    )
  }

  formatarDinheiro(valor: number | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


  criarViagem() {
    this.dialogCreateTrips.showDialog()
  }

  openViagem(viagem: viagem) {
    if (this.isMobile) {
      this.router.navigate(['/trip', viagem.id])
    } else {
      this.viagemDetails = viagem
      this.showDialog = true
      const id = viagem.id
      if (id) {
        console.log(id)
        this.tripService.getTripById(id).subscribe(
          (data) => {
            this.viagemDetails = data;
            this.dadosUpdate.patchValue(data)
            console.log("dados", this.dadosUpdate.value)
            console.log('data formata', this.formatarData(this.dadosUpdate.value.dataInicio))

          },
          (err) => {
            console.error("Deu error:", err)
          }
        )

      } else {
        console.error("ID is null");
      }
    }


  }
  openRegistro(registro: viagem) {
    this.router.navigate(['/report', registro.id])

  }

  criarRegistro() {
    this.dialogCreateReports.showDialog()
  }



  tripsUpdate() {
    if (!this.viagemDetails?.id) {
      this.toastrService.showError('ID da viagem não encontrado.');
      return;
    }

    if (!this.dadosUpdate.dirty) {
      this.dadosUpdate.get('cliente')?.disable();
      this.dadosUpdate.get('origem')?.disable();
      this.dadosUpdate.get('destino')?.disable();
      this.dadosUpdate.get('dataInicio')?.disable();
      this.dadosUpdate.get('valor')?.disable();
      this.dadosUpdate.get('dataFim')?.disable();
      this.dadosUpdate.get('descricao')?.disable();
      this.editTrip = false
    }

    const dadosFormatados = {
      ...this.dadosUpdate.value,
      id: this.viagemDetails.id, // Inclui o ID da viagem
      dataInicio: this.formatarData(this.dadosUpdate.value.dataInicio), // Formatar data
      dataFim: this.dadosUpdate.value.dataFim ? this.formatarData(this.dadosUpdate.value.dataFim) : '' // Formatar 
    };

    const dadosParaEnviar = this.filtrarDados(dadosFormatados);

    console.log("Update", dadosFormatados)

    this.tripService.updateTrip(dadosFormatados).subscribe(
      (res) => {
        this.toastrService.showSucess(`Viagem para ${dadosParaEnviar.destino} atualizada `);
        this.dadosUpdate.get('cliente')?.disable();
        this.dadosUpdate.get('origem')?.disable();
        this.dadosUpdate.get('destino')?.disable();
        this.dadosUpdate.get('dataInicio')?.disable();
        this.dadosUpdate.get('valor')?.disable();
        this.dadosUpdate.get('dataFim')?.disable();
        this.dadosUpdate.get('descricao')?.disable();
        this.editTrip = false
      },
      (err) => {
        this.toastrService.showError(`Erro ao atualizar a viagem, tente novamente mais tarde. `);
        console.error(err);
      }
    );
  }

  formatarData(data: Date | string): string {
    if (!data) return ''; // Retorna string vazia se for nulo/indefinido

    if (typeof data === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data; // Se já estiver no formato dd/MM/yyyy, retorna como está
    }

    const dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return ''; // Verifica se a data é inválida

    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const ano = dateObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  filtrarDados(dados: any): any {
    const dadosFiltrados: any = {};

    for (const key in dados) {
      if (dados[key] !== "" && dados[key] !== null && dados[key] !== undefined) {
        // Adiciona apenas os campos que não estão vazios
        dadosFiltrados[key] = dados[key];
      }
    }

    return dadosFiltrados;
  }


  delete(event: Event, viagem: any) {

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
        this.tripService.deleteTripId(viagem.id).subscribe(
          (res) => {
            this.toastrService.showSucess(`Viagem apagada com sucesso!`)
            window.location.reload()
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




  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  downloadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      // Cria um link temporário
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'image.jpg'; // Nome do arquivo que será baixado
      document.body.appendChild(link);
      link.click(); // Simula o clique no link para iniciar o download

      // Limpa o objeto URL e remove o link do DOM
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, error => {
      console.error('Erro ao baixar a imagem:', error);
    });
  }

  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl;
  }
  redirecionar() {
    window.location.reload()
  }

  filtrarViagensPorMes(viagens: viagem[], mes: number, ano: number): viagem[] {
    return viagens.filter(viagem => {
      // Converte as datas de início e fim para objetos Date
      const dataInicio = this.converterDataBrasileiraParaDate(viagem.dataInicio);
      const dataFim = this.converterDataBrasileiraParaDate(viagem.dataFim);

      // Verifica se a viagem foi iniciada e finalizada no mês e ano especificados
      const inicioNoMes = dataInicio.getMonth() + 1 === mes && dataInicio.getFullYear() === ano;
      const fimNoMes = dataFim.getMonth() + 1 === mes && dataFim.getFullYear() === ano;

      // Verifica se a viagem foi finalizada após o dia 20
      const finalizadaAposDia20 = dataFim.getDate() > 20;

      // Se a viagem foi finalizada após o dia 20, ela deve ser contabilizada no próximo mês
      if (finalizadaAposDia20) {
        return false;
      }

      return inicioNoMes && fimNoMes;
    });
  }

  calcularFaturamento(viagens: viagem[], mes: number, ano: number): number {
    const viagensFiltradas = this.filtrarViagensPorMes(viagens, mes, ano);
    return viagensFiltradas.reduce((acc, viagem) => acc + viagem.valor, 0);
  }

  // Função para converter datas no formato brasileiro (dd/MM/yyyy ou dd.MM.yyyy) para Date
  converterDataBrasileiraParaDate(dataString: string): Date {
    if (!dataString) return new Date(); // Retorna a data atual se a string for inválida

    // Substitui pontos por barras, caso a data esteja no formato dd.MM.yyyy
    const dataFormatada = dataString.replace(/\./g, '/');

    // Divide a string em dia, mês e ano
    const [dia, mes, ano] = dataFormatada.split('/');

    // Cria um objeto Date (lembrando que o mês no JavaScript é 0-based)
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }
}
