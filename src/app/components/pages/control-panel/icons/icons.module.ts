import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsRoutingModule } from './icons-routing.module';
import {IconsComponent} from './icons.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    IconsComponent
  ],
  imports: [
    CommonModule,
    IconsRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class IconsModule { }
