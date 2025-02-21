import { Component, OnInit, ViewChild } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateTripsComponent } from '../../components/create-trips/create-trips.component';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CreateTripsComponent, CreateReportsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;

  viagens: viagem[] = [
    { id: 1, origem: 'São Paulo', destino: 'Rio de Janeiro', data_inicio: '01/01/2021', data_fim: '05/01/2021', status: 'Concluída', cliente: 'Cliente A', valor: 1000 },
    { id: 2, origem: 'Brasília', destino: 'Salvador', data_inicio: '10/02/2021', data_fim: '15/02/2021', status: 'Concluída', cliente: 'Cliente B', valor: 1500 },
    { id: 3, origem: 'Curitiba', destino: 'Porto Alegre', data_inicio: '20/03/2021', data_fim: '25/03/2021', status: 'Concluída', cliente: 'Cliente C', valor: 1200 },
    { id: 4, origem: 'Manaus', destino: 'Belém', data_inicio: '05/04/2021', data_fim: '10/04/2021', status: 'Concluída', cliente: 'Cliente D', valor: 1300 },
    { id: 5, origem: 'Fortaleza', destino: 'Recife', data_inicio: '15/05/2021', data_fim: '20/05/2021', status: 'Concluída', cliente: 'Cliente E', valor: 1400 },
    { id: 6, origem: 'Goiânia', destino: 'Campo Grande', data_inicio: '25/06/2021', data_fim: '30/06/2021', status: 'Concluída', cliente: 'Cliente F', valor: 1100 },
    { id: 7, origem: 'Florianópolis', destino: 'Joinville', data_inicio: '05/07/2021', data_fim: '10/07/2021', status: 'Concluída', cliente: 'Cliente G', valor: 1600 },
    { id: 8, origem: 'Vitória', destino: 'Belo Horizonte', data_inicio: '15/08/2021', data_fim: '20/08/2021', status: 'Concluída', cliente: 'Cliente H', valor: 1700 },
    { id: 9, origem: 'Natal', destino: 'João Pessoa', data_inicio: '25/09/2021', data_fim: '30/09/2021', status: 'Concluída', cliente: 'Cliente I', valor: 1800 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
  ];

  registros: registro[] = [
    { viagem_id: 1, tipo: 'Check-in', data: '01/01/2021', hora: '08:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 2, tipo: 'Check-in', data: '10/02/2021', hora: '09:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 3, tipo: 'Check-in', data: '20/03/2021', hora: '10:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 4, tipo: 'Check-in', data: '05/04/2021', hora: '11:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 5, tipo: 'Check-in', data: '15/05/2021', hora: '12:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 6, tipo: 'Check-in', data: '25/06/2021', hora: '13:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 7, tipo: 'Check-in', data: '05/07/2021', hora: '14:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 8, tipo: 'Check-in', data: '15/08/2021', hora: '15:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 9, tipo: 'Check-in', data: '25/09/2021', hora: '16:00', descricao: 'Check-in realizado com sucesso' },
    { viagem_id: 10, tipo: 'Check-in', data: '05/10/2021', hora: '17:00', descricao: 'Check-in realizado com sucesso' },
  ];

  ultimoRelario: any = this.registros[this.registros.length - 1];
  faturamento = Object.values(this.viagens).reduce((acc, val) => acc + val.valor, 0)


  ngOnInit(): void {
    this.criarRegistro()
  }

  formatarDinheiro(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  criarViagem() {
    this.dialogCreateTrips.showDialog()

  }

  criarRegistro() {
    this.dialogCreateReports.showDialog()

  }
}
