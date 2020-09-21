import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import {VehicleComponent} from './vehicle.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    VehicleComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class VehicleModule { }
