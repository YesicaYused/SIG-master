import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleProfileRoutingModule } from './module-profile-routing.module';
import {ModuleProfileComponent} from './module-profile.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ModuleProfileComponent
  ],
  imports: [
    CommonModule,
    ModuleProfileRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ModuleProfileModule { }
