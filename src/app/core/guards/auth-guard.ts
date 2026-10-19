import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permiso } from '../models/auth.model';
import { AuthService } from '../services/auth-service';

/** Solo entra quien tiene sesión vigente; si no, va al login (y vuelve luego a la URL pedida). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesion()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Para /login: si ya hay sesión, no tiene sentido mostrar el formulario. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesion() ? router.createUrlTree(['/inicio']) : true;
};

/**
 * Exige al menos uno de los permisos indicados.
 * Es una comodidad de la interfaz: la seguridad real la aplica el backend (403).
 */
export const permisoGuard = (...permisos: Permiso[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.tieneAlguno(permisos) ? true : router.createUrlTree(['/acceso-denegado']);
};
