import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from '../../service/toastr.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RouterLink,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  formRegistro: FormGroup
  showPassword = false;
  confirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
    this.formRegistro = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      if (error) {
        this.router.navigate(['/login']).then(() => {
          this.toastrService.showError('Login cancelado!')
        });
      }

    })
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowConfirmPassword() {
    this.confirmPassword = !this.confirmPassword;
  }

  register() {
    if (this.formRegistro.invalid) {
      this.toastrService.showError('Preencha todos os campos corretamente.');
      return;
    }

    this.authService.register(this.formRegistro.value).subscribe({
      next: (res: any) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken);
          this.router.navigate(['/dashboard']);
          window.location.reload();
        }
      },
      error: (err: any) => {
        this.toastrService.showError(err.error.message);
      }
    });
  }


  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  loginGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  loginFacebook() {
    window.location.href = `${environment.apiUrl}/auth/facebook`;
  }


}

