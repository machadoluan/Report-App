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
import { DatePickerModule } from 'primeng/datepicker';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { saveAs } from 'file-saver';
import { ViagensService } from '../../service/viagens.service';





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
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  standalone: true,
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent implements OnInit {
  viagens: any[] = [];

  registros: registro[] = [];

  showDialog: boolean = false;
  isMobile: boolean = window.innerWidth <= 750;
  registro: registro | undefined
  editReport: boolean = false;
  fullScreenImageUrl: string | null = null;
  dadosUpdate: FormGroup;
  dropdownMenu: boolean = false

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
    private fb: FormBuilder,
    private http: HttpClient,
    private tripService: ViagensService
  ) {
    this.dadosUpdate = this.fb.group({
      viagem: [{ value: "", disabled: true }, Validators.required],
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
    this.loadTrips()
  }

  openDropDown() {
    this.dropdownMenu = !this.dropdownMenu
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

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;
        this.viagens = this.viagens.map(v => ({
          ...v,
          nomeFormatado: `${v.origem || "Origem desconhecida"} → ${v.destino || "Destino desconhecido"} | ${v.status || "Status desconhecido"}`
          

       
       
        }));

        this.viagens.unshift({
          id: null,
          origem: '',
          cliente: '',
          destino: '',
          dataInicio: '',
          dataFim: '',
          status: '',
          valor: 0,
          descricao: '',
          nomeFormatado: 'Sem viagem'
        });



        console.log(data)
      },
      (err) => {
        console.error("Deu error:", err)
      }
    )
  }


  loadReports() {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      this.reportService.getReportById(parseInt(id)).subscribe(
        (data: any) => {
          const tipoSelecionado = this.registroTipo.find(tipo => tipo.Tipo === data.reportFormatado.tipo);
  
          this.registro = data.reportFormatado;
  
          // Espera carregar as viagens antes de setar
          if (this.viagens.length > 0) {
            const viagemSelecionada = this.viagens.find(v => v.id === this.registro?.viagem_id) || this.viagens[0];
  
            this.dadosUpdate.patchValue({
              ...data.reportFormatado,
              tipo: tipoSelecionado || null,
              viagem: viagemSelecionada
            });
          } else {
            // Marca para fazer depois, se as viagens ainda não carregaram
            const interval = setInterval(() => {
              if (this.viagens.length > 0) {
                const viagemSelecionada = this.viagens.find(v => v.id === this.registro?.viagem_id) || this.viagens[0];
                this.dadosUpdate.patchValue({
                  ...data.reportFormatado,
                  tipo: tipoSelecionado || null,
                  viagem: viagemSelecionada
                });
                clearInterval(interval);
              }
            }, 100); // Tenta a cada 100ms
          }
        },
        (err) => {
          console.error("Erro ao carregar relatório:", err);
        }
      );
    } else {
      console.error("ID do registro não foi fornecido.");
    }
  }
  



  shareTrip() {
    if (!this.registro) return;

    if (navigator.share) {
      // Usa a Web Share API se estiver disponível
      navigator.share({
        title: `Registro ${this.registro.tipo} da viagem ${this.registro.viagem_nome}`,
        text: `Confira os detalhes do registro.`,
        url: window.location.href
      })
        .then(() => console.log('Registro compartilhado com sucesso!'))
        .catch(error => console.error('Erro ao compartilhar:', error));
    } else {
      // Fallback para outro método de compartilhamento, ex.: copiar link
      console.log('API de compartilhamento não suportada neste navegador.');
      this.copiarLink();
    }
  }

  copiarLink(): void {
    const url = window.location.href;

    // Verifica se o navegador possui a API mais moderna de clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => console.log("Link copiado com sucesso!"))
        .catch(error => console.error("Erro ao copiar link:", error));
    } else {
      // Fallback para navegadores que não suportam navigator.clipboard
      // Exemplo usando um input temporário
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      console.log("Link copiado (método alternativo)!");
    }
  }




  editar() {
    this.dadosUpdate.get('viagem')?.enable();
    this.dadosUpdate.get('tipo')?.enable();
    this.dadosUpdate.get('data')?.enable();
    this.dadosUpdate.get('hora')?.enable();
    this.dadosUpdate.get('descricao')?.enable();
    this.editReport = true
    this.dropdownMenu = false

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
    this.http.get(url, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        saveAs(blob, 'image.jpg'); // Ele mesmo faz o fallback interno
      }, error => {
        console.error('Erro ao baixar a imagem:', error);
      });
  }


  delete(report: any) {
    this.dropdownMenu = false

    this.confirmationService.confirm({
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
        this.reportService.deleteReportId(report.id).subscribe(
          (res) => {
            this.toastrService.showSucess(`Registro apagado com sucesso!`)
            this.router.navigate(['/reports'])
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
      this.toastrService.showError('ID do registro não encontrado.');
      return;
    }

    if (!this.dadosUpdate.dirty) {
      this.dadosUpdate.get('viagem')?.disable();
      this.dadosUpdate.get('tipo')?.disable();
      this.dadosUpdate.get('data')?.disable();
      this.dadosUpdate.get('hora')?.disable();
      this.dadosUpdate.get('descricao')?.disable();
      this.editReport = false
    }

    const viagem = this.dadosUpdate.value.viagem
    const id = viagem?.id ?? null

    console.log('viagem id', id)

    const dadosFormatados = {
      id: this.registro.id, // Inclui o ID da viagem
      data: this.formatarData(this.dadosUpdate.value.data), // Formatar data
      hora: this.formatarHora(this.dadosUpdate.value.hora),
      tipo: this.dadosUpdate.value.tipo.Tipo,
      descricao: this.dadosUpdate.value.descricao
    };


    console.log("Update", dadosFormatados)

    this.reportService.updateReport(id, dadosFormatados).subscribe(
      (res: any) => {
        this.toastrService.showSucess(`Registro ${dadosFormatados.tipo} atualizado `);
        this.dadosUpdate.get('viagem')?.disable();
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
