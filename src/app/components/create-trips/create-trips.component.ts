import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-create-trips',
  imports: [DialogModule, InputTextModule, DatePicker, NgxMaskDirective],
  templateUrl: './create-trips.component.html',
  styleUrl: './create-trips.component.scss',
  providers: [provideNgxMask()]

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
