import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionRoutingModule } from './profession-routing.module';
import {ProfessionComponent} from './profession.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ProfessionComponent
  ],
  imports: [
    CommonModule,
    ProfessionRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ProfessionModule { }
