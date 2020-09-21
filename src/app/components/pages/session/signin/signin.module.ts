import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import {SigninComponent} from './signin.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    SigninRoutingModule,
  ]
})
export class SigninModule { }
