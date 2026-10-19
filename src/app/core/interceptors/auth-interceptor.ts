import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorResponse } from '../models/error-response';
import { AuthService } from '../services/auth-service';

/**
 * 1. Agrega «Authorization: Bearer <token>» a cada petición hacia la API.
 * 2. Si la API responde 401 (sin token, vencido o alterado), descarta la sesión
 *    y manda al login, recordando a dónde quería ir el usuario.
 *
 * Un 403 NO cierra la sesión: el usuario sí está autenticado, solo le falta el
 * permiso; el componente muestra el mensaje del backend.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const esApi = req.url.startsWith(environment.apiUrl);
  const esLogin = req.url === auth.urlLogin;

  const token = esApi && !esLogin ? auth.token() : null;
  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && esApi && !esLogin) {
        const motivo = (err.error as ErrorResponse | null)?.message;
        auth.limpiarSesion(motivo ?? 'Su sesión no es válida. Inicie sesión nuevamente');
        if (!router.url.startsWith('/login')) {
          void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        }
      }
      return throwError(() => err);
    }),
  );
};
