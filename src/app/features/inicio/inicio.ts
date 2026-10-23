import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth-service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly auth = inject(AuthService);
}