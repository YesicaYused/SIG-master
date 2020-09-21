import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MunicipalityRoutingModule } from './municipality-routing.module';
import {MunicipalityComponent} from './municipality.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    MunicipalityComponent
  ],
  imports: [
    CommonModule,
    MunicipalityRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class MunicipalityModule { }
