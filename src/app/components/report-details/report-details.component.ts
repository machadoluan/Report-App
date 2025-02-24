import { Component, OnInit } from '@angular/core';
import { registro, viagem } from '../../types/models.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';



@Component({
  selector: 'app-report-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    NgxMaskDirective,
    FormsModule,
    SelectModule,
    RouterLink,
    DropdownModule
  ],
  standalone: true,
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  viagens: viagem[] = [];

  registros: registro[] = [];


  registro: registro | undefined
  editReport: boolean = false;
  fullScreenImageUrl: string | null = null;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.registros = this.registros.map(registro => ({
      ...registro,
      viagem_nome: this.getViagemNome(registro.viagem_id) // Adiciona o nome da viagem
    }));

    this.registro = this.registros.find(registro => registro.viagem_id === Number(id))

    console.log(this.registro)
  }


  getViagemNome(viagem_id: number): string {
    const viagem = this.viagens.find(v => v.id === viagem_id);
    return viagem ? `${viagem.origem} → ${viagem.destino}` : 'Desconhecido';
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
}
