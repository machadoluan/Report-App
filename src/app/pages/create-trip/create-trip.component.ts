import { Component, ElementRef, ViewChild } from '@angular/core';
import { viagem } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-trip',
  imports: [DialogModule, InputTextModule, NgxMaskDirective, TextareaModule, SelectModule, CommonModule, RouterLink],

  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent {

}
