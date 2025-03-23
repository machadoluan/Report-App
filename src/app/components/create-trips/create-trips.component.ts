import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ViagensService } from '../../service/viagens.service';
import { ToastrService } from '../../service/toastr.service';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../service/auth.service';
import { InputNumberModule } from 'primeng/inputnumber';




@Component({
  selector: 'app-create-trips',
  imports: [DialogModule, InputTextModule, TextareaModule, ReactiveFormsModule, DatePickerModule, InputNumberModule],
  templateUrl: './create-trips.component.html',
  styleUrl: './create-trips.component.scss',
  providers: []

})


export class CreateTripsComponent implements OnInit {
  display: boolean = false;
  user: any

  dadosCadastroTrips: FormGroup

  constructor(
    private fb: FormBuilder,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {
    this.dadosCadastroTrips = this.fb.group({
      cliente: ["", Validators.required],
      origem: ["", Validators.required],
      destino: ["", Validators.required],
      valor: [null, Validators.required, this.valorMinimo(0.01)],
      dataInicio: ["", Validators.required],
      dataFim: [""],
      descricao: [""]
    })
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken()

  }

  valorMinimo(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value < min) {
        return { valorInvalido: true };
      }
      return null;
    }
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  createTrip() {

    const dadosFormatados = {
      ...this.dadosCadastroTrips.value,
      dataInicio: this.formatarData(this.dadosCadastroTrips.value.dataInicio), // Formatar data
      dataFim: this.dadosCadastroTrips.value.dataFim ? this.formatarData(this.dadosCadastroTrips.value.dataFim) : '' // Formatar 
    };

    const dadosParaEnviar = this.filtrarDados(dadosFormatados)

    console.log(dadosParaEnviar)
    this.tripService.createTrip(dadosParaEnviar, this.user).subscribe(
      (res) => {
        this.toastrService.showSucess(`Viagem para ${dadosParaEnviar.destino} cadastrada`)
        this.dadosCadastroTrips.reset()
      },
      (err) => {
        this.toastrService.showError(`Erro ao cadastrar a viagem, tente novamente mais tarde. `)
        console.error(err)
      }
    )
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

  redirecionar(){
    window.location.reload()
  }
}
