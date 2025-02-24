import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { viagem } from '../../types/models.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-report',
  imports: [DialogModule, InputTextModule, NgxMaskDirective, TextareaModule, SelectModule, CommonModule, RouterLink],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.scss'
})
export class CreateReportComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  display: boolean = false;


  viagens: viagem[] = [];

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
