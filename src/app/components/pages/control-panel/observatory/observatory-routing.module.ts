import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ObservatoryComponent} from './observatory.component';


const routes: Routes = [
  {
    path: '',
    component: ObservatoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservatoryRoutingModule { }
