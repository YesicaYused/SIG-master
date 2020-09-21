import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './signin.component';
import {LoadGuard} from '../../../../services/load.guard';


const routes: Routes = [
  {
    path: '',
    component: SigninComponent,
    canActivate: [LoadGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigninRoutingModule { }
