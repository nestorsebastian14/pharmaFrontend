import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente-service';
import { PaginaResponse } from '../../../../core/models/pagina-response';
import { mensajeError } from '../../../../core/utils/http-error';
import { AuthService } from '../../../../core/services/auth-service';

type Direccion = 'asc' | 'desc';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly auth = inject(AuthService);
  protected readonly puedeEscribir = computed(() => this.auth.tiene('CLIENTES_ESCRIBIR'));

  protected readonly tamanios = [5, 10, 20];

  // Estado de la paginación y el orden: cada cambio vuelve a llamar a listar().
  protected readonly pagina = signal(0);
  protected readonly tamanio = signal(10);
  protected readonly ordenarPor = signal('apellidos');
  protected readonly direccion = signal<Direccion>('asc');

  protected readonly respuesta = signal<PaginaResponse<Cliente> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly filtro = signal('');

  /** Los clientes de la página actual (la API devuelve un objeto, no un arreglo). */
  protected readonly clientes = computed(() => this.respuesta()?.contenido ?? []);

  /** Filtra solo dentro de la página actual: por DNI o por nombres y apellidos. */
  protected readonly filtrados = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    if (!texto) {
      return this.clientes();
    }
    return this.clientes().filter(c => {
      const completo = `${c.nombres} ${c.apellidos}`.toLowerCase();
      return c.dni.toLowerCase().includes(texto) || completo.includes(texto);
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.clienteService
      .listar(this.pagina(), this.tamanio(), this.ordenarPor(), this.direccion())
      .subscribe({
        next: datos => {
          this.respuesta.set(datos);
          this.cargando.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(mensajeError(err));
          this.cargando.set(false);
        },
      });
  }

  anterior(): void {
    if (this.pagina() > 0) {
      this.pagina.update(p => p - 1);
      this.cargar();
    }
  }

  siguiente(): void {
    if (!this.respuesta()?.ultima) {
      this.pagina.update(p => p + 1);
      this.cargar();
    }
  }

  cambiarTamanio(valor: string): void {
    this.tamanio.set(Number(valor));
    this.pagina.set(0);
    this.cargar();
  }

  /** Mismo campo: invierte la dirección. Campo distinto: orden ascendente. */
  ordenar(campo: string): void {
    if (this.ordenarPor() === campo) {
      this.direccion.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.ordenarPor.set(campo);
      this.direccion.set('asc');
    }
    this.pagina.set(0);
    this.cargar();
  }

  indicador(campo: string): string {
    if (this.ordenarPor() !== campo) {
      return '';
    }
    return this.direccion() === 'asc' ? '▲' : '▼';
  }

  /** Baja lógica: tras el DELETE se recarga la página y la fila pasa a «Inactivo». */
  darDeBaja(cliente: Cliente): void {
    if (!confirm(`¿Dar de baja al cliente "${cliente.nombres} ${cliente.apellidos}"?`)) {
      return;
    }
    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }
}
