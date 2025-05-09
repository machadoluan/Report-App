import { Component, HostListener, OnInit } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ViagensService } from '../../service/viagens.service';
import { ToastrService } from '../../service/toastr.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import html2pdf from 'html2pdf.js';
import { Table, TableModule } from 'primeng/table';
import { ReportsService } from '../../service/reports.service';





@Component({
  selector: 'app-trip-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    RouterLink,
    ReactiveFormsModule,
    DialogModule,
    InputNumberModule,
    TableModule
  ],
  standalone: true,
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss'
})
export class TripDetailsComponent implements OnInit {
  showDialog: boolean = false;
  isMobile: boolean = window.innerWidth <= 750;
  viagem: viagem | undefined
  editTrip: boolean = false;
  dataInicioFormatada: string = '';
  dataFimFormatada: string = '';
  dadosUpdate: FormGroup
  reports: registro[] = [];
  dropdownMenu: boolean = false;



  statusOptions = [
    { Status: "Em andamento" },
    { Status: "Concluído" }
  ]


  constructor(
    private fb: FormBuilder,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService

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
    this.dropdownMenu = false
  }



  ngOnInit(): void {
    this.loadTrips()
    if (!this.isMobile) {
      this.openDialog()
    }


  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 750;
  }

  openDropDown() {
    this.dropdownMenu = !this.dropdownMenu
  }

  openDialog() {
    if (!this.isMobile) {
      this.showDialog = true;
    }
  }

  closeDialog() {
    this.showDialog = false;
  }

  shareTrip() {
    if (!this.viagem) return;

    if (navigator.share) {
      // Usa a Web Share API se estiver disponível
      navigator.share({
        title: `Viagem de ${this.viagem.origem} para ${this.viagem.destino}`,
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

  loadReportsSpecific(viagemId: number) {
    this.reportService.getReports().subscribe({
      next: (res: any) => {
        this.reports = res.reportsFormatados.filter((r: any) => r.viagem_id === viagemId);
        console.log("Registro da viagem:", this.reports);
      }
    })
  }

  loadTrips() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReportsSpecific(parseInt(id))
    }
    if (id) {
      console.log(parseInt(id))
      this.tripService.getTripById(parseInt(id)).subscribe(
        (data) => {
          this.viagem = data;
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



  tripsUpdate() {
    if (!this.viagem?.id) {
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
      id: this.viagem.id, // Inclui o ID da viagem
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


  delete(viagem: any) {
    console.log('Método delete chamado');
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
        this.tripService.deleteTripId(viagem.id).subscribe(
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

  redirecionar() {
    this.router.navigate(['/trip'])
  }

  formatarDinheiro(valor: number | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // exportToPDF() {
  //   console.log('Exportando para PDF...');
  
  //   const element = document.getElementById('contentToConvert');
  //   if (!element) {
  //     console.error('Elemento não encontrado!');
  //     return;
  //   }
  
  //   // Temporariamente mostra o conteúdo só pra exportar, mas invisível
  //   element.style.visibility = 'visible';
  //   element.style.position = 'fixed';
  //   element.style.top = '0';
  //   element.style.left = '0';
  //   element.style.width = '100%';
  
  //   const options = {
  //     filename: `${this.viagem?.origem}-${this.viagem?.destino}.pdf`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  
  //   // Exporta o conteúdo
  //   html2pdf().from(element).set(options).save().then(() => {
  //     // Esconde de novo depois de exportar
  //     element.style.visibility = 'hidden';
  //     element.style.position = 'static';
  //   });
  // }
  
  

}
