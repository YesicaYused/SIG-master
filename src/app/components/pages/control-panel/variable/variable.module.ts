import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VariableRoutingModule } from './variable-routing.module';
import {VariableComponent} from './variable.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    VariableComponent
  ],
  imports: [
    CommonModule,
    VariableRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class VariableModule { }
