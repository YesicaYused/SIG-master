import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeighborhoodRoutingModule } from './neighborhood-routing.module';
import {NeighborhoodComponent} from './neighborhood.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    NeighborhoodComponent
  ],
  imports: [
    CommonModule,
    NeighborhoodRoutingModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class NeighborhoodModule { }
