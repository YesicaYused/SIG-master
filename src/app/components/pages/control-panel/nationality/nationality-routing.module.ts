import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NationalityComponent} from './nationality.component';


const routes: Routes = [
  {
    path: '',
    component: NationalityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NationalityRoutingModule { }
