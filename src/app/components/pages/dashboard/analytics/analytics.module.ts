import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import {AnalyticsComponent} from './analytics.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    AnalyticsComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        AnalyticsRoutingModule,
        ChartsModule
    ]
})
export class AnalyticsModule { }
