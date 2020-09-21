import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModalityComponent} from './modality.component';


const routes: Routes = [
  {
    path: '',
    component: ModalityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalityRoutingModule { }
