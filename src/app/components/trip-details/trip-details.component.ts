import { Component, OnInit } from '@angular/core';
import { viagem } from '../../types/models.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-trip-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    NgxMaskDirective,
    FormsModule,
    SelectModule,
    RouterLink

  ],
  standalone: true,
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss'
})
export class TripDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  viagens: viagem[] = [
    { id: 1, origem: 'São Paulo', destino: 'Rio de Janeiro', data_inicio: '01/01/2021', data_fim: '05/01/2021', status: 'Em andamento', cliente: 'Cliente A', valor: 1000 },
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
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
    { id: 10, origem: 'Aracaju', destino: 'Maceió', data_inicio: '05/10/2021', data_fim: '10/10/2021', status: 'Concluída', cliente: 'Cliente J', valor: 1900 },
  ];

  viagem: viagem | undefined
  editTrip: boolean = false;

  statusOptions = [
    { Status: "Em andamento" },
    { Status: "Concluído" }
  ]



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.viagem = this.viagens.find(v => v.id === Number(id));

    console.log(this.viagem)
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


  toggleEdit() {
    this.editTrip = !this.editTrip
  }
}
