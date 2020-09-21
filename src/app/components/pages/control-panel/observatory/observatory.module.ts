import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservatoryRoutingModule } from './observatory-routing.module';
import {ObservatoryComponent} from './observatory.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ObservatoryComponent
  ],
  imports: [
    CommonModule,
    ObservatoryRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ObservatoryModule { }
