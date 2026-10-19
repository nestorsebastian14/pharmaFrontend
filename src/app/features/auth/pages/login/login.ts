import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { erroresDeValidacion, mensajeError } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  /** Llega como ?returnUrl=... cuando el guard o el interceptor mandaron al login. */
  readonly returnUrl = input<string>();

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly verClave = signal(false);

  protected readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigateByUrl(this.destino()),
      error: (err: HttpErrorResponse) => {
        const campos = Object.values(erroresDeValidacion(err));
        // 400 (campos vacíos) → detalle de validación; 401 → «Usuario o contraseña incorrectos».
        this.error.set(campos.length ? campos.join('. ') : mensajeError(err));
        this.form.controls.password.reset();
        this.enviando.set(false);
      },
    });
  }

  /** Solo se acepta una ruta interna (evita redirecciones abiertas hacia otros sitios). */
  private destino(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/inicio';
  }
}
