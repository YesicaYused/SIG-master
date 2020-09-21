import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router, PreloadAllModules} from '@angular/router';
import {AppComponent} from './app.component';
import {NotFoundComponent} from './components/shared/not-found/not-found.component';
import {AuthGuard} from './services/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule),
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      preloadingStrategy: PreloadAllModules,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
