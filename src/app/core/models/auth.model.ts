/** Permisos finos del backend (enum Permiso). Se reciben en el login y se usan para mostrar u ocultar opciones. */
export type Permiso =
  | 'CATALOGO_LEER'
  | 'CATALOGO_ESCRIBIR'
  | 'CLIENTES_LEER'
  | 'CLIENTES_ESCRIBIR'
  | 'VENTAS_LEER'
  | 'VENTAS_REGISTRAR'
  | 'REPORTES_VER'
  | 'USUARIOS_ADMINISTRAR';

export interface LoginRequest {
  username: string;
  password: string;
}

/** Respuesta de POST /api/v1/auth/login. */
export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEnSegundos: number;
  username: string;
  nombreCompleto: string;
  roles: string[];
  permisos: Permiso[];
}

/** Lo que se guarda en el navegador: la respuesta del login + el instante exacto en que vence el token. */
export interface Sesion extends LoginResponse {
  /** Milisegundos desde 1970 (Date.now()) en que expira el token. */
  expiraEn: number;
}
