import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  imports: [Checkbox, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword = false;
  rememberMe = false;

  constructor() {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
