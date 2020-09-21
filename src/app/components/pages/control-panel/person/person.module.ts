import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import {PersonComponent} from './person.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    PersonComponent
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class PersonModule { }
