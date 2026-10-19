/** Respuesta paginada genérica del backend (reutilizable en productos y ventas). */
export interface PaginaResponse<T> {
    contenido: T[];
    pagina: number;
    tamanio: number;
    totalElementos: number;
    totalPaginas: number;
    ultima: boolean;
}
