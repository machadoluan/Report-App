import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

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
  @ViewChild('passwordInput') passwordInput!: ElementRef

  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {
    this.userLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  focusPassword() {
    if (this.userLogin.value.username) {
      this.passwordInput.nativeElement.focus();
    }
  }

  login() {
    console.log(this.userLogin.value)
    this.authService.login(this.userLogin.value).subscribe({
      next: (res) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken)
          this.route.navigate(['/dashboard'])
        }
        console.log(res)
      },

      error: (err) => {
        console.error(err)
      }

    })


  }
}
