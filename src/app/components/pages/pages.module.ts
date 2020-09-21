import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {sharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    PagesRoutingModule,
    sharedModule,
  ]
})
export class PagesModule { }
