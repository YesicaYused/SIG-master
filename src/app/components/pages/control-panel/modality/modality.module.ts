import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalityRoutingModule } from './modality-routing.module';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ModalityComponent} from './modality.component';


@NgModule({
  declarations: [
    ModalityComponent
  ],
  imports: [
    CommonModule,
    ModalityRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ModalityModule { }
