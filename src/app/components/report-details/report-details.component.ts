import { Component, HostListener, OnInit } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { ReportsService } from '../../service/reports.service';
import { ToastrService } from '../../service/toastr.service';
import { DialogModule } from 'primeng/dialog';
import { CurrencyMaskModule } from "ng2-currency-mask";




@Component({
  selector: 'app-report-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    NgxMaskDirective,
    FormsModule,
    SelectModule,
    RouterLink,
    DropdownModule,
    DialogModule,
    CurrencyMaskModule,
    ReactiveFormsModule
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


  constructor(
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
      this.dadosUpdate =  this.fb.group({
        
      })
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
    this.reportService.getReports().subscribe({
      next: (data: any) => {
        this.registros = data.reports
        const id = this.route.snapshot.paramMap.get('id');
        this.registro = this.registros.find(registro => registro.id === Number(id))
        console.table(data.reports)
      },
      error: (err) => {
        console.error(err)
      }
    })
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


  toggleEdit() {
    this.editReport = !this.editReport
  }

  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl;
  }

  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  redirecionar() {
    this.router.navigate(['/trip'])
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
    // if (!this.viagem?.id) {
    //   this.toastrService.showError('ID da viagem não encontrado.');
    //   return;
    // }

    // if (!this.dadosUpdate.dirty) {
    //   this.toggleEdit()
    // }

    // const dadosFormatados = {
    //   ...this.dadosUpdate.value,
    //   id: this.viagem.id, // Inclui o ID da viagem
    //   dataInicio: this.formatarData(this.dadosUpdate.value.dataInicio), // Formatar data
    //   dataFim: this.dadosUpdate.value.dataFim ? this.formatarData(this.dadosUpdate.value.dataFim) : '' // Formatar 
    // };

    // const dadosParaEnviar = this.filtrarDados(dadosFormatados);

    // console.log("Update", dadosFormatados)

    // this.tripService.updateTrip(dadosFormatados).subscribe(
    //   (res) => {
    //     this.toastrService.showSucess(`Viagem para ${dadosParaEnviar.destino} atualizada `);
    //     this.toggleEdit(); // Desativa o modo de edição
    //   },
    //   (err) => {
    //     this.toastrService.showError(`Erro ao atualizar a viagem, tente novamente mais tarde. `);
    //     console.error(err);
    //   }
    // );
  }
}
