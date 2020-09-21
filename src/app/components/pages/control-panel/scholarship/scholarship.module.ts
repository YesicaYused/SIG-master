import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScholarshipRoutingModule } from './scholarship-routing.module';
import {ScholarshipComponent} from './scholarship.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ScholarshipComponent
  ],
  imports: [
    CommonModule,
    ScholarshipRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ScholarshipModule { }
