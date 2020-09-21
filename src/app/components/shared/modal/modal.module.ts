import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { CausesComponent } from './causes/causes.component';
import { DepartmentsComponent } from './departments/departments.component';
import { IconComponent } from './icon/icon.component';
import { ModalitiesComponent } from './modalities/modalities.component';
import { ModulesComponent } from './modules/modules.component';
import { ModuleProfilesComponent } from './module-profiles/module-profiles.component';
import { MunicipalitiesComponent } from './municipalities/municipalities.component';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { NeighborhoodsComponent } from './neighborhoods/neighborhoods.component';
import { ObservatoriesComponent } from './observatories/observatories.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionsProfilesComponent } from './permissions-profiles/permissions-profiles.component';
import { PeopleComponent } from './people/people.component';
import { PersonProfilesComponent } from './person-profiles/person-profiles.component';
import { ProfessionsComponent } from './professions/professions.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ScholarshipsComponent } from './scholarships/scholarships.component';
import { SitesClassComponent } from './sites-class/sites-class.component';
import { VariablesComponent } from './variables/variables.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { WeaponTypesComponent } from './weapon-types/weapon-types.component';
import { CasesComponent } from './cases/cases.component';
import {ServiceComponent} from './service/service.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    CausesComponent,
    DepartmentsComponent,
    IconComponent,
    ModalitiesComponent,
    ModulesComponent,
    ModuleProfilesComponent,
    MunicipalitiesComponent,
    NationalitiesComponent,
    NeighborhoodsComponent,
    ObservatoriesComponent,
    PermissionsComponent,
    PermissionsProfilesComponent,
    PeopleComponent,
    PersonProfilesComponent,
    ProfessionsComponent,
    ProfilesComponent,
    ScholarshipsComponent,
    SitesClassComponent,
    VariablesComponent,
    VehiclesComponent,
    WeaponTypesComponent,
    CasesComponent,
    ServiceComponent
  ],
  exports: [
    CausesComponent,
    DepartmentsComponent,
    IconComponent,
    ModalitiesComponent,
    ModulesComponent,
    ModuleProfilesComponent,
    MunicipalitiesComponent,
    NationalitiesComponent,
    NeighborhoodsComponent,
    ObservatoriesComponent,
    PermissionsComponent,
    PermissionsProfilesComponent,
    PeopleComponent,
    PersonProfilesComponent,
    ProfessionsComponent,
    ProfilesComponent,
    ScholarshipsComponent,
    SitesClassComponent,
    VariablesComponent,
    VehiclesComponent,
    WeaponTypesComponent,
    CasesComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    CausesComponent,
    DepartmentsComponent,
    IconComponent,
    ModalitiesComponent,
    ModulesComponent,
    ModuleProfilesComponent,
    MunicipalitiesComponent,
    NationalitiesComponent,
    NeighborhoodsComponent,
    ObservatoriesComponent,
    PermissionsComponent,
    PermissionsProfilesComponent,
    PeopleComponent,
    PersonProfilesComponent,
    ProfessionsComponent,
    ProfilesComponent,
    ScholarshipsComponent,
    SitesClassComponent,
    VariablesComponent,
    VehiclesComponent,
    WeaponTypesComponent,
    CasesComponent,
    ServiceComponent
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class modalModule { }
