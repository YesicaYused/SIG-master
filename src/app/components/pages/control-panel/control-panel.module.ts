import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlPanelRoutingModule } from './control-panel-routing.module';
import {ControlPanelComponent} from './control-panel.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {sharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    ControlPanelComponent,
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    sharedModule,
  ]
})
export class ControlPanelModule { }
