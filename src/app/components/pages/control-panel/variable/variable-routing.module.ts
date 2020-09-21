import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VariableComponent} from './variable.component';


const routes: Routes = [
  {
    path: '',
    component: VariableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariableRoutingModule { }
