import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SelectModule } from 'primeng/select';
import { viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-reports',
  imports: [DialogModule, InputTextModule, NgxMaskDirective, TextareaModule, SelectModule, CommonModule],
  templateUrl: './create-reports.component.html',
  styleUrl: './create-reports.component.scss'
})
export class CreateReportsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  display: boolean = false;


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

  registroTipo: any[] = [
    { Tipo: 'Inicio de Jornada' },
    { Tipo: 'Fim de Jornada' },
    { Tipo: 'Inicio Refeição' },
    { Tipo: 'Fim Refeição' },
    { Tipo: 'Inicio Pausa' },
    { Tipo: 'Fim Pausa' },
    { Tipo: 'Inicio Espera' },
    { Tipo: 'Reinicio de viagem' },
  ]


  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  fullScreenImageUrl: string | null = null;


  viagem: any

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.viagens = this.viagens.map(v => ({
      ...v,
      nomeFormatado: `${v.origem || "Origem desconhecida"} → ${v.destino || "Destino desconhecido"} | ${v.status || "Status desconhecido"}`
    }));

  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  viagemName(): string {
    return this.viagens
      .map(v => `${v.origem || "Origem desconhecida"} → ${v.destino || "Destino desconhecido"} | ${v.status || "Status desconhecido"}`)
      .join("\n"); // Usa \n para quebrar linha entre as viagens
  }


  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl; // Exibe a imagem em tela cheia
  }

  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  onFilesSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files) {
      const files = Array.from(fileInput.files);

      console.log('Arquivos selecionados:', files);

      files.forEach(file => {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.imagePreviews.push(base64String);
        };
        reader.readAsDataURL(file);
      });
    }

    this.fileInput.nativeElement.value = '';
  }


  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove o arquivo do array de arquivos selecionados
    this.imagePreviews.splice(index, 1); // Remove a pré-visualização correspondente do array de pré-visualizações

    this.fileInput.nativeElement.value = '';

    console.log(this.selectedFiles.length)
  }
}
