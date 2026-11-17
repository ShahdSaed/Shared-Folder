import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

export const USERNAME_PATTERN = /^(?=.{3,20}$)[a-zA-Z][a-zA-Z0-9]*(?:[._][a-zA-Z0-9]+)*$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(USERNAME_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly loginError = signal('');

  get usernameControl() {
    return this.loginForm.get('username')!;
  }
  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  get usernameInvalid(): boolean {
    return this.usernameControl.invalid && (this.usernameControl.dirty || this.usernameControl.touched);
  }

  get passwordInvalid(): boolean {
    return this.passwordControl.invalid && (this.passwordControl.dirty || this.passwordControl.touched);
  }

  get usernameErrorMessage(): string {
    if (this.usernameControl.hasError('required')) return 'Username is required.';
    if (this.usernameControl.hasError('pattern')) {
      return 'Must be 3-20 characters, start with a letter, no consecutive or trailing symbols.';
    }
    return '';
  }

  get passwordErrorMessage(): string {
    if (this.passwordControl.hasError('required')) return 'Password is required.';
    if (this.passwordControl.hasError('minlength')) return 'Password must be at least 8 characters.';
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError.set('');
    this.isLoading.set(true);

    const { username, password } = this.loginForm.value as {
      username: string;
      password: string;
      rememberMe: boolean;
    };

    this.authService.login(username, password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.toastService.success(`Welcome back, ${user.fullName}!`);
        // Admins go to Dashboard, Viewers go directly to Shared Files
        if (user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/shared-files']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.loginError.set('Invalid username or password. Please try again.');
        } else if (err.status === 400) {
          this.loginError.set(err.error?.message ?? 'Invalid request. Please check your input.');
        } else if (err.status === 429) {
          this.loginError.set('Too many login attempts. Please wait before trying again.');
        } else if (err.status === 0) {
          this.loginError.set('Cannot reach the server. Please check your connection.');
        } else {
          this.loginError.set('Login failed. Please try again.');
        }
      },
    });
  }
}
