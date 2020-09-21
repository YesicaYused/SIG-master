import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SiteClassComponent} from './site-class.component';


const routes: Routes = [
  {
    path: '',
    component: SiteClassComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteClassRoutingModule { }
