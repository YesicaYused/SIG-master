import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteClassRoutingModule } from './site-class-routing.module';
import {SiteClassComponent} from './site-class.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    SiteClassComponent
  ],
  imports: [
    CommonModule,
    SiteClassRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class SiteClassModule { }
