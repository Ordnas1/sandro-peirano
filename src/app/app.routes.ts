import { Routes } from '@angular/router';
import { HomeViewComponent } from './views/home-view/home-view';

export const routes: Routes = [
    {
        path: '',
        component: HomeViewComponent
    },
    {
        path: 'agregar_producto',
        loadComponent: () => import('./views/add-product/add-product').then(m => m.AddProduct)
    },
];
