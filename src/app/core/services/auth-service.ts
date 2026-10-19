import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Permiso, Sesion } from '../models/auth.model';

const CLAVE_SESION = 'pharma.sesion';

/**
 * Gestión de la sesión del usuario.
 *
 * El backend es stateless: la "sesión" es solo el JWT que devuelve el login.
 * Se guarda en localStorage para sobrevivir a F5 y se descarta al vencer (exp)
 * o cuando la API responde 401.
 */
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly _sesion = signal<Sesion | null>(this.leerGuardada());

  /** Mensaje para mostrar en el login (p. ej. «El token ha expirado»). */
  readonly aviso = signal<string | null>(null);

  readonly sesion = this._sesion.asReadonly();
  readonly usuario = computed(() => this._sesion()?.username ?? null);
  readonly nombreCompleto = computed(() => this._sesion()?.nombreCompleto ?? '');
  readonly roles = computed(() => this._sesion()?.roles ?? []);

  /** URL del endpoint de login (el interceptor no debe adjuntar token ni redirigir en él). */
  get urlLogin(): string {
    return `${this.url}/login`;
  }

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.urlLogin, credenciales).pipe(
      tap(respuesta => {
        const sesion: Sesion = {
          ...respuesta,
          expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000,
        };
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
        this._sesion.set(sesion);
        this.aviso.set(null);
      }),
    );
  }

  /** Cierre voluntario: limpia la sesión y vuelve al login. */
  cerrarSesion(): void {
    this.limpiarSesion();
    void this.router.navigate(['/login']);
  }

  /** Borra la sesión sin navegar (lo usan el interceptor y los guards). */
  limpiarSesion(aviso: string | null = null): void {
    localStorage.removeItem(CLAVE_SESION);
    this._sesion.set(null);
    this.aviso.set(aviso);
  }

  /** true si hay token y todavía no venció. Si venció, limpia la sesión. */
  haySesion(): boolean {
    const sesion = this._sesion();
    if (!sesion) {
      return false;
    }
    if (Date.now() >= sesion.expiraEn) {
      this.limpiarSesion('Su sesión expiró. Inicie sesión nuevamente');
      return false;
    }
    return true;
  }

  /** Token para el encabezado Authorization, o null si no hay sesión vigente. */
  token(): string | null {
    return this.haySesion() ? this._sesion()!.token : null;
  }

  /** ¿El usuario tiene este permiso? (lee un signal: se actualiza solo en las plantillas). */
  tiene(permiso: Permiso): boolean {
    return this._sesion()?.permisos.includes(permiso) ?? false;
  }

  /** ¿Tiene al menos uno de estos permisos? */
  tieneAlguno(permisos: readonly Permiso[]): boolean {
    return permisos.some(p => this.tiene(p));
  }

  private leerGuardada(): Sesion | null {
    try {
      const texto = localStorage.getItem(CLAVE_SESION);
      if (!texto) {
        return null;
      }
      const sesion = JSON.parse(texto) as Sesion;
      if (!sesion.token || Date.now() >= sesion.expiraEn) {
        localStorage.removeItem(CLAVE_SESION);
        return null;
      }
      return sesion;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }
}
