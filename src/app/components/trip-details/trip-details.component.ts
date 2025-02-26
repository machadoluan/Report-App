import { Component, OnInit } from '@angular/core';
import { viagem } from '../../types/models.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ViagensService } from '../../service/viagens.service';
import { ToastrService } from '../../service/toastr.service';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DatePickerModule } from 'primeng/datepicker';





@Component({
  selector: 'app-trip-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    RouterLink,
    CurrencyMaskModule,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss'
})
export class TripDetailsComponent implements OnInit {


  viagem: viagem | undefined
  editTrip: boolean = false;
  dataInicioFormatada: string = '';
  dataFimFormatada: string = '';
  dadosUpdate: FormGroup


  statusOptions = [
    { Status: "Em andamento" },
    { Status: "Concluído" }
  ]


  constructor(
    private fb: FormBuilder,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
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

  shareTrip() {
    if (this.viagem) {
      if (navigator.share) {
        navigator.share({
          title: `Viagem para ${this.viagem.destino}`,
          text: `Confira os detalhes da viagem para ${this.viagem.destino}.`,
          url: window.location.href
        })
          .then(() => console.log('Viagem compartilhada com sucesso!'))
          .catch((error) => console.log('Erro ao compartilhar:', error));
      } else {
        console.log('API de compartilhamento não suportada neste navegador.');
      }
    }

  }

  loadTrips() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log(parseInt(id))
      this.tripService.getTripById(parseInt(id)).subscribe(
        (data) => {
          this.viagem = data;
          this.dadosUpdate.patchValue(data)
          console.log(data)
        },
        (err) => {
          console.error("Deu error:", err)
        }
      )

    } else {
      console.error("ID is null");
    }
  }

  toggleEdit() {
    this.editTrip = !this.editTrip
  }


  tripsUpdate() {
    if (!this.viagem?.id) {
      this.toastrService.showError('ID da viagem não encontrado.');
      return;
    }
  
    const dadosFormatados = {
      ...this.dadosUpdate.value,
      id: this.viagem.id, // Inclui o ID da viagem
      dataInicio: this.formatarData(this.dadosUpdate.value.dataInicio), // Formatar data
      dataFim: this.dadosUpdate.value.dataFim ? this.formatarData(this.dadosUpdate.value.dataFim) : '' // Formatar 
    };
  
    const dadosParaEnviar = this.filtrarDados(dadosFormatados);
  
    this.tripService.updateTrip(dadosParaEnviar).subscribe(
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
    const dateObj = new Date(data); // Converte para objeto Date
    const dia = String(dateObj.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos
    const ano = dateObj.getFullYear(); // Ano com 4 dígitos
    return `${dia}/${mes}/${ano}`; // Formato dd/MM/yyyy
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

}
