import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateTripsComponent } from '../../components/create-trips/create-trips.component';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SheetCreateComponent } from '../../components/sheet-create/sheet-create.component';
import { AuthService } from '../../service/auth.service';
import { ViagensService } from '../../service/viagens.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CreateTripsComponent, CreateReportsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;

  viagens: viagem[] = [];

  registros: registro[] = [];

  ultimoRelario: any = this.registros[this.registros.length - 1];
  faturamento = Object.values(this.viagens).reduce((acc, val) => acc + val.valor, 0)
  user: any;

  constructor(
    private tripService: ViagensService
  ) { }

  ngOnInit(): void {
    this.loadTrips()
  }

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;
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

  criarRegistro() {
    this.dialogCreateReports.showDialog()
  }



}
