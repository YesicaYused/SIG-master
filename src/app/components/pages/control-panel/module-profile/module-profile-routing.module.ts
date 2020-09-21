import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModuleProfileComponent} from './module-profile.component';


const routes: Routes = [
  {
    path: '',
    component: ModuleProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleProfileRoutingModule { }
