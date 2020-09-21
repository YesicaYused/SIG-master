import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NeighborhoodComponent} from './neighborhood.component';


const routes: Routes = [
  {
    path: '',
    component: NeighborhoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeighborhoodRoutingModule { }
