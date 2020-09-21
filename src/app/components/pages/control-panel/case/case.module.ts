import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseRoutingModule } from './case-routing.module';
import {CaseComponent} from './case.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    CaseComponent
  ],
  imports: [
    CommonModule,
    CaseRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class CaseModule { }
