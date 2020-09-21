import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CauseComponent} from './cause.component';


const routes: Routes = [
  {
    path: '',
    component: CauseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CauseRoutingModule { }
