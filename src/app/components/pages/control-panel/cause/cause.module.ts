import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CauseRoutingModule } from './cause-routing.module';
import {CauseComponent} from './cause.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    CauseComponent
  ],
  imports: [
    CommonModule,
    CauseRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class CauseModule { }
