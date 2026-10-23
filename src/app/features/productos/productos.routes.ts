import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
import { ProductoList } from './pages/producto-list/producto-list';
import { ProductoForm } from './pages/producto-form/producto-form';

export const PRODUCTOS_ROUTES: Routes = [
  { path: '', component: ProductoList, title: 'Productos' },
  { path: 'nuevo', component: ProductoForm, canActivate: [permisoGuard], data: { permiso: 'CATALOGO_ESCRIBIR' }, title: 'Nuevo producto' },
  { path: ':id/editar', component: ProductoForm, canActivate: [permisoGuard], data: { permiso: 'CATALOGO_ESCRIBIR' }, title: 'Editar producto' },
];
