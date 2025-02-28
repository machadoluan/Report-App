import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CreateTripsComponent } from '../../components/create-trips/create-trips.component';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SheetCreateComponent } from '../../components/sheet-create/sheet-create.component';
import { AuthService } from '../../service/auth.service';
import { ViagensService } from '../../service/viagens.service';
import { CurrencyMaskModule } from "ng2-currency-mask";


import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CreateTripsComponent, CreateReportsComponent, DatePickerModule, DialogModule, CurrencyMaskModule, ReactiveFormsModule, InputTextModule,
    TextareaModule, ConfirmDialog],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;
  showDialog: boolean = false;


  viagens: viagem[] = [];
  viagemDetails: any;
  registros: registro[] = [];
  isMobile: boolean = window.innerWidth <= 750;
  ultimoRelario: any = this.registros[this.registros.length - 1];
  user: any;
  faturamento: any;
  dadosUpdate: FormGroup;
  editTrip: boolean = false

  constructor(
    private tripService: ViagensService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService

  ) {
    this.dadosUpdate = this.fb.group({
      cliente: [""],
      origem: [""],
      destino: [""],
      valor: [0],
      dataInicio: [""],
      dataFim: [""],
      descricao: [""]
    })
  }

  ngOnInit(): void {
    this.loadTrips()
  }

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;
        this.faturamento = Object.values(this.viagens).reduce((acc, val) => acc + val.valor, 0)
        console.log(this.dadosUpdate.value)
        console.log(data)
      },
      (err) => {
        console.error("Deu error:", err)
      }
    )
  }

  formatarDinheiro(valor: number): string {
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

  criarRegistro() {
    this.dialogCreateReports.showDialog()
  }

  toggleEdit() {
    this.editTrip = !this.editTrip
  }


  tripsUpdate() {
    if (!this.viagemDetails?.id) {
      this.toastrService.showError('ID da viagem não encontrado.');
      return;
    }

    if (!this.dadosUpdate.dirty) {
      this.toggleEdit()
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
        this.toggleEdit(); // Desativa o modo de edição
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
}
