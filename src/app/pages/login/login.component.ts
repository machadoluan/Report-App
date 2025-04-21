import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from '../../service/toastr.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [
    MatCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  display: boolean = false
  showPassword = false;
  rememberMe = false;
  userLogin: FormGroup;
  formForgot: FormGroup
  @ViewChild('passwordInput') passwordInput!: ElementRef

  constructor(private router: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private route: Router, private toastrService: ToastrService, private http: HttpClient) {
    this.userLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.formForgot = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      const error = params['error'];
      if (error) {
        this.route.navigate(['/login']).then(() => {
          this.toastrService.showError('Login cancelado!')
        });
      }

    })
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  focusPassword() {
    if (this.userLogin.value.username) {
      this.passwordInput.nativeElement.focus();
    }
  }

  forgotPassword() {
    this.display = true
  }

  login() {
    console.log(this.userLogin.value)
    this.authService.login(this.userLogin.value).subscribe({
      next: (res) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken)
          this.route.navigate(['/dashboard'])
          window.location.reload()
        }
        console.log(res)
      },

      error: (err) => {
        this.toastrService.showError(err.error.message)
      }

    })
  }

  onSubmit() {
    this.authService.forgotPassword(this.formForgot.value.email).subscribe({
      next: () => {
        this.toastrService.showSucess('Email de recuperação enviado!')
      },
      error: (err) => {
        this.toastrService.showError(err.error.message)
      }
    });
  }


  // login.component.ts
  loginGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  loginFacebook() {
    window.location.href = 'http://localhost:3000/auth/facebook';
  }


}
