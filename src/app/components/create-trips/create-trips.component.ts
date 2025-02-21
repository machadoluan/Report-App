import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-create-trips',
  imports: [DialogModule, InputTextModule, NgxMaskDirective,TextareaModule],
  templateUrl: './create-trips.component.html',
  styleUrl: './create-trips.component.scss',
  providers: []

})


export class CreateTripsComponent {
  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }
}
