import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
import { CategoriaList } from './pages/categoria-list/categoria-list';
import { CategoriaForm } from './pages/categoria-form/categoria-form';
export const CATEGORIAS_ROUTES: Routes = [
    { path: '', component: CategoriaList, title: 'Categorías' },
    { path: 'nuevo', component: CategoriaForm, canActivate: [permisoGuard], data: { permiso: 'CATALOGO_ESCRIBIR' }, title: 'Nueva categoría' },
    { path: ':id/editar', component: CategoriaForm, canActivate: [permisoGuard], data: { permiso: 'CATALOGO_ESCRIBIR' }, title: 'Editar categoría' },
];