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

  viagens: viagem[] = [];

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
