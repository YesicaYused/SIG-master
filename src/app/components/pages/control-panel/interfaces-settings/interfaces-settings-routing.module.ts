import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InterfacesSettingsComponent} from './interfaces-settings.component';


const routes: Routes = [
  {
    path: '',
    component: InterfacesSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfacesSettingsRoutingModule { }
