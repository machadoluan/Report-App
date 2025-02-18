import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  imports: [
    Checkbox,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword = false;
  rememberMe = false;
  userLogin: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]

    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
