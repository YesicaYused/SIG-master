import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PermissionProfileComponent} from './permission-profile.component';


const routes: Routes = [
  {
    path: '',
    component: PermissionProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionProfileRoutingModule { }
