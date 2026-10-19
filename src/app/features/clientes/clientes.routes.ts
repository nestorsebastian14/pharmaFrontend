import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/auth-guard';
import { ClienteList } from './pages/cliente-list/cliente-list';
import { ClienteForm } from './pages/cliente-form/cliente-form';

export const CLIENTES_ROUTES: Routes = [
    { path: '', component: ClienteList, title: 'Clientes' },
    { path: 'nuevo', component: ClienteForm, canActivate: [permisoGuard('CLIENTES_ESCRIBIR')], title: 'Nuevo cliente' },
    { path: ':id/editar', component: ClienteForm, canActivate: [permisoGuard('CLIENTES_ESCRIBIR')], title: 'Editar cliente' },
];
