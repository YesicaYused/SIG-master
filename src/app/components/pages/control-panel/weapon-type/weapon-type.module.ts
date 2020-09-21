import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeaponTypeRoutingModule } from './weapon-type-routing.module';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {WeaponTypeComponent} from './weapon-type.component';


@NgModule({
  declarations: [
    WeaponTypeComponent
  ],
  imports: [
    CommonModule,
    WeaponTypeRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class WeaponTypeModule { }
