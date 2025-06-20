import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SelectModule } from 'primeng/select';
import { viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViagensService } from '../../service/viagens.service';
import { ReportsService } from '../../service/reports.service';
import { ToastrService } from '../../service/toastr.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../service/auth.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';



@Component({
  selector: 'app-create-reports',
  imports: [DialogModule, InputTextModule, NgxMaskDirective, TextareaModule, SelectModule, CommonModule, DatePickerModule, ReactiveFormsModule, ProgressSpinner, NgxMatTimepickerModule],
  templateUrl: './create-reports.component.html',
  styleUrl: './create-reports.component.scss'
})
export class CreateReportsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() reportCreated = new EventEmitter<any>()

  display: boolean = false;
  extractedText: string[] = [];

  isLoading = false;

  viagens: viagem[] = [];
  dadosReport: FormGroup
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


  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  fullScreenImageUrl: string | null = null;
  viagem: any
  extractedRecords: any;
  user: any


  constructor(private authService: AuthService, private fb: FormBuilder, private tripService: ViagensService, private repotService: ReportsService, private toastrService: ToastrService
  ) {
    this.dadosReport = this.fb.group({
      viagem: [""],
      tipo: ["", Validators.required],
      data: ["", Validators.required],
      hora: ["", Validators.required],
      descricao: [""]
    })
  }


  ngOnInit(): void {
    this.user = this.authService.getUserFromToken()
    this.loadTrips()
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

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  viagemName(): string {
    return this.viagens
      .map(v => `${v.origem || "Origem desconhecida"} → ${v.destino || "Destino desconhecido"} | ${v.status || "Status desconhecido"}`)
      .join("\n"); // Usa \n para quebrar linha entre as viagens
  }


  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl; // Exibe a imagem em tela cheia
  }

  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  onFilesSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files) {
      const files = Array.from(fileInput.files);

      console.log('Arquivos selecionados:', files);


      files.forEach(file => {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.imagePreviews.push(base64String);

        };
        reader.readAsDataURL(file);
      });
    }

    this.fileInput.nativeElement.value = '';
  }




  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove o arquivo do array de arquivos selecionados
    this.imagePreviews.splice(index, 1); // Remove a pré-visualização correspondente do array de pré-visualizações

    this.fileInput.nativeElement.value = '';

    console.log(this.selectedFiles.length)
  }

  createReport() {
    console.log("Dados antes ", this.dadosReport.value)
    const viagem = this.dadosReport.value.viagem
    const id = viagem?.id ?? null
    const dadosFormatados = {
      data: this.formatarData(this.dadosReport.value.data),
      tipo: this.dadosReport.value.tipo.Tipo,
      descricao: this.dadosReport.value?.descricao ?? "",
      hora: this.formatarHora(this.dadosReport.value.hora)
    };

    this.isLoading = true;

    this.repotService.createReport(id, dadosFormatados, this.selectedFiles, this.user).subscribe({
      next: (res: any) => { 
        console.log(res)
        this.toastrService.showSucess(`Registro de ${dadosFormatados.tipo} criado. `)
        this.reportCreated.emit(res.report)
        this.dadosReport.reset()
        this.imagePreviews = []
        this.selectedFiles = []
      },
      error: (err) => {
        console.error(err)
        this.toastrService.showError(`Erro ao cadastrar o registro, tente novamente mais tarde. `)
        this.isLoading = false;

      },
      complete: () => {
        this.isLoading = false;
      }
    })
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

  redirecionar(){
    window.location.reload()
  }

  onTimeSelected(time: string) {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    this.dadosReport.patchValue({ hora: formattedTime });
  }
  
}
