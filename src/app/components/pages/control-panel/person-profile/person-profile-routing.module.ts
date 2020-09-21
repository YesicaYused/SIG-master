import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonProfileComponent} from './person-profile.component';


const routes: Routes = [
  {
    path: '',
    component: PersonProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonProfileRoutingModule { }
