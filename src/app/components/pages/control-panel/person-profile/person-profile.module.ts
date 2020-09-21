import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonProfileRoutingModule } from './person-profile-routing.module';
import {PersonProfileComponent} from './person-profile.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    PersonProfileComponent
  ],
  imports: [
    CommonModule,
    PersonProfileRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class PersonProfileModule { }
