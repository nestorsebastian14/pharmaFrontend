import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/auth-guard';
import { VentaList } from './pages/venta-list/venta-list';
import { VentaForm } from './pages/venta-form/venta-form';
import { VentaDetalle } from './pages/venta-detalle/venta-detalle';

export const VENTAS_ROUTES: Routes = [
  { path: '', component: VentaList, title: 'Consulta de ventas' },
  { path: 'nueva', component: VentaForm, canActivate: [permisoGuard('VENTAS_REGISTRAR')], title: 'Nueva venta' },
  { path: ':id', component: VentaDetalle, title: 'Detalle de venta' },
];
