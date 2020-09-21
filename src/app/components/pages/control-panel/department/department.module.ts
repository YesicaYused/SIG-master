import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import {DepartmentComponent} from './department.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class DepartmentModule { }
