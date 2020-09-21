import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import { TruncatePipe } from '../../pipes/truncate.pipe';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

import { NotFoundComponent } from './not-found/not-found.component';
import { layoutModule } from './layout/layout.module';
import { modalModule } from './modal/modal.module';
import { ErrorComponent } from './error/error.component';
import { AuthorizedComponent } from './authorized/authorized.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    TruncatePipe,
    NotFoundComponent,
    ErrorComponent,
    AuthorizedComponent
  ],
  exports: [
    NotFoundComponent,
    layoutModule,
    ErrorComponent,
    AuthorizedComponent,
    modalModule
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    layoutModule,
    modalModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class sharedModule { }
