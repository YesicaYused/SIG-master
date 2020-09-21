import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NationalityRoutingModule } from './nationality-routing.module';
import {NationalityComponent} from './nationality.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    NationalityComponent
  ],
  imports: [
    CommonModule,
    NationalityRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class NationalityModule { }
