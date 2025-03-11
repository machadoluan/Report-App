import { Component, HostListener, OnInit } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { ReportsService } from '../../service/reports.service';
import { ToastrService } from '../../service/toastr.service';
import { DialogModule } from 'primeng/dialog';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DatePickerModule } from 'primeng/datepicker';





@Component({
  selector: 'app-report-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    RouterLink,
    DropdownModule,
    DialogModule,
    CurrencyMaskModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  standalone: true,
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent implements OnInit {



  viagens: viagem[] = [];

  registros: registro[] = [];

  showDialog: boolean = false;
  isMobile: boolean = window.innerWidth <= 750;
  registro: registro | undefined
  editReport: boolean = false;
  fullScreenImageUrl: string | null = null;
  dadosUpdate: FormGroup

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
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.dadosUpdate = this.fb.group({
      viagem_nome: [{ value: "", disabled: true }, Validators.required],
      tipo: [{ value: '', disabled: true }, Validators.required],
      data: [{ value: "", disabled: true }, Validators.required],
      hora: [{ value: "", disabled: true }, Validators.required],
      descricao: [{ value: "", disabled: true }]
    });

  }

  ngOnInit(): void {
    if (!this.isMobile) {
      this.openDialog()
    }

    this.loadReports()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 750;
  }

  openDialog() {
    if (!this.isMobile) {
      this.showDialog = true;
    }
  }


  loadReports() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log(parseInt(id))
      this.reportService.getReportById(parseInt(id)).subscribe(
        (data: any) => {

          const tipoSelecionado = this.registroTipo.find(tipo => tipo.Tipo === data.reportFormatado.tipo);


          this.registro = data.reportFormatado;
          this.dadosUpdate.patchValue({
            ...data.reportFormatado,
            tipo: tipoSelecionado || null // Certifica-se de passar um objeto válido
          });
          console.log(this.registro)
        },
        (err) => {
          console.error("Deu error:", err)
        }
      )

    } else {
      console.error("ID is null");
    }
  }



  shareTrip() {
    if (this.registro) {
      if (navigator.share) {
        navigator.share({
          title: `Registro ${this.registro.tipo} da viagem ${this.registro.viagem_nome}`,
          text: `Confira os detalhes do registro.`,
          url: window.location.href
        })
          .then(() => console.log('Registro compartilhada com sucesso!'))
          .catch((error) => console.log('Erro ao compartilhar:', error));
      } else {
        console.log('API de compartilhamento não suportada neste navegador.');
      }
    }

  }


  editar() {
    this.dadosUpdate.get('tipo')?.enable();
    this.dadosUpdate.get('data')?.enable();
    this.dadosUpdate.get('hora')?.enable();
    this.dadosUpdate.get('descricao')?.enable();
    this.editReport = true
  }

  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl;
  }

  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  redirecionar() {
    this.router.navigate(['/reports'])
  }

   downloadImage(url: string) {
    const link = document.createElement('a');
    link.download = url.split('/').pop() || 'download.jpg'; // Nome do arquivo
    document.body.appendChild(link);
    link.click();

    // Adiciona um pequeno atraso antes de remover o link
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
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
        this.reportService.deleteTripId(viagem.id).subscribe(
          (res) => {
            this.toastrService.showSucess(`Viagem apagada com sucesso!`)
            this.router.navigate(['/trip'])

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

  reportUpdate() {
    if (!this.registro?.id) {
      this.toastrService.showError('ID da viagem não encontrado.');
      return;
    }

    if (!this.dadosUpdate.dirty) {
      this.dadosUpdate.get('tipo')?.disable();
      this.dadosUpdate.get('data')?.disable();
      this.dadosUpdate.get('hora')?.disable();
      this.dadosUpdate.get('descricao')?.disable();
      this.editReport = false
    }

    const dadosFormatados = {
      id: this.registro.id, // Inclui o ID da viagem
      data: this.formatarData(this.dadosUpdate.value.data), // Formatar data
      hora: this.formatarHora(this.dadosUpdate.value.hora),
      tipo: this.dadosUpdate.value.tipo.Tipo,
      descricao: this.dadosUpdate.value.descricao
    };


    console.log("Update", dadosFormatados)

    this.reportService.updateTrip(dadosFormatados).subscribe(
      (res: any) => {
        this.toastrService.showSucess(`Registro ${dadosFormatados.tipo} atualizado `);
        this.dadosUpdate.get('tipo')?.disable();
        this.dadosUpdate.get('data')?.disable();
        this.dadosUpdate.get('hora')?.disable();
        this.dadosUpdate.get('descricao')?.disable();
        this.editReport = false
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

  private formatarHora(hora: string): string {
    if (!hora) return ''; // Verifica se a string está vazia ou indefinida

    // Caso a hora já esteja no formato "HH:mm:ss"
    if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) {
      const partes = hora.split(':');
      return partes[2] === '00' ? `${partes[0]}:${partes[1]}` : hora;
    }

    // Caso a hora seja enviada sem separadores e tenha 4 caracteres (ex: "1420")
    if (/^\d{4}$/.test(hora)) {
      return `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;
    }

    return hora; // Se não atender nenhum caso, retorna como está
  }
}
