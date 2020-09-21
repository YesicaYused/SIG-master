import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    AsideComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    AsideComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class layoutModule { }
