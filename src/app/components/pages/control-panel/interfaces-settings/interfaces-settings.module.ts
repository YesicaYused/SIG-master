import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfacesSettingsRoutingModule } from './interfaces-settings-routing.module';
import {InterfacesSettingsComponent} from './interfaces-settings.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    InterfacesSettingsComponent
  ],
  imports: [
    CommonModule,
    InterfacesSettingsRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class InterfacesSettingsModule { }
