import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from './pages.component';
import {LoadGuard} from '../../services/load.guard';
import {AuthGuard} from '../../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
    ]
  },
  {
    path: 'ingresar',
    loadChildren: () => import('./session/signin/signin.module').then(m => m.SigninModule),
    canActivate: [LoadGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    // canActivate: [AuthGuard],
  },
  {
    path: 'panel',
    loadChildren: () => import('./control-panel/control-panel.module').then(m => m.ControlPanelModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
