import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionRoutingModule } from './permission-routing.module';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {PermissionComponent} from './permission.component';


@NgModule({
  declarations: [
    PermissionComponent
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class PermissionModule { }
