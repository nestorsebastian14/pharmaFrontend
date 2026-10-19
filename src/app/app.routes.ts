import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, guestGuard, permisoGuard } from './core/guards/auth-guard';
export const routes: Routes = [
    {
        path: 'login',
        title: 'Iniciar sesión',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'inicio' },
            {
                path: 'inicio',
                title: 'Inicio',
                loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio),
            },
            {
                path: 'acceso-denegado',
                title: 'Acceso denegado',
                loadComponent: () =>
                    import('./shared/pages/acceso-denegado/acceso-denegado').then(m => m.AccesoDenegado),
            },
            {
                path: 'categorias',
                canActivate: [permisoGuard('CATALOGO_LEER')],
                loadChildren: () =>
                    import('./features/categorias/categorias.routes').then(m => m.CATEGORIAS_ROUTES),
            },
            {
                path: 'productos',
                canActivate: [permisoGuard('CATALOGO_LEER')],
                loadChildren: () =>
                    import('./features/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES),
            },
            {
                path: 'ventas',
                canActivate: [permisoGuard('VENTAS_LEER')],
                loadChildren: () =>
                    import('./features/ventas/ventas.routes').then(m => m.VENTAS_ROUTES),
            },
            {
                path: 'clientes',
                canActivate: [permisoGuard('CLIENTES_LEER')],
                loadChildren: () =>
                    import('./features/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES),
            },
        ],
    },
    {
        path: '**',
        title: 'Página no encontrada',
        loadComponent: () =>
            import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado),
    },
];