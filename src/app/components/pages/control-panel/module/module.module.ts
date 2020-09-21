import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleRoutingModule } from './module-routing.module';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ModuleComponent} from './module.component';


@NgModule({
  declarations: [
    ModuleComponent
  ],
  imports: [
    CommonModule,
    ModuleRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ModuleModule { }
