import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionProfileRoutingModule } from './permission-profile-routing.module';
import {PermissionProfileComponent} from './permission-profile.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    PermissionProfileComponent
  ],
  imports: [
    CommonModule,
    PermissionProfileRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class PermissionProfileModule { }
