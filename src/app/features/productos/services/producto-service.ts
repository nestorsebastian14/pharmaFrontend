import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de que esta línea esté
import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { Direccion, OrdenProducto, Producto, ProductoRequest } from '../models/producto.model';

@Service()
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/productos`;

  listar(
    pagina: number,
    tamanio: number,
    ordenarPor: OrdenProducto,
    direccion: Direccion,
  ): Observable<PaginaResponse<Producto>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('ordenarPor', ordenarPor)
      .set('direccion', direccion);

    return this.http.get<any>(this.url, { params }).pipe(
      map((respuesta) => {
        let listaProductos: Producto[] = [];

        if (Array.isArray(respuesta)) {
          listaProductos = respuesta;
        } else if (respuesta && respuesta.content) {
          listaProductos = respuesta.content;
        }

        const paginaMapeada: any = {
          contenido: listaProductos,
          totalElementos: listaProductos.length,
          totalPaginas: Math.ceil(listaProductos.length / tamanio),
          pagina: pagina,
          ultima: (pagina + 1) >= Math.ceil(listaProductos.length / tamanio)
        };

        return paginaMapeada;
      })
    );
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  crear(dto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.url, dto);
  }

  actualizar(id: number, dto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, dto);
  }

  darDeBaja(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}