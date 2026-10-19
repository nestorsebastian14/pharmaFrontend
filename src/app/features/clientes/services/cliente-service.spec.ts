import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClienteService } from './cliente-service';

describe('ClienteService', () => {
  let service: ClienteService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClienteService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar envía los parámetros de paginación', () => {
    service.listar(1, 5, 'dni', 'desc').subscribe();
    const req = http.expectOne(r => r.url.endsWith('/clientes'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('pagina')).toBe('1');
    expect(req.request.params.get('tamanio')).toBe('5');
    expect(req.request.params.get('ordenarPor')).toBe('dni');
    expect(req.request.params.get('direccion')).toBe('desc');
    req.flush({ contenido: [], pagina: 1, tamanio: 5, totalElementos: 0, totalPaginas: 0, ultima: true });
    http.verify();
  });
});
