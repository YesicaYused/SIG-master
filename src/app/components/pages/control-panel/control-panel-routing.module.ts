import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ControlPanelComponent} from './control-panel.component';
import {NotFoundComponent} from '../../shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ControlPanelComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'caso',
        loadChildren: () => import('./case/case.module').then(m => m.CaseModule),
      },
      {
        path: 'causa',
        loadChildren: () => import('./cause/cause.module').then(m => m.CauseModule),
      },
      {
        path: 'departamento',
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      },
      {
        path: 'iconos',
        loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule),
      },
      {
        path: 'interfaz',
        loadChildren: () => import('./interfaces-settings/interfaces-settings.module').then(m => m.InterfacesSettingsModule),
      },
      {
        path: 'modalidad',
        loadChildren: () => import('./modality/modality.module').then(m => m.ModalityModule),
      },
      {
        path: 'modulo',
        loadChildren: () => import('./module/module.module').then(m => m.ModuleModule),
      },
      {
        path: 'modulo_perfil',
        loadChildren: () => import('./module-profile/module-profile.module').then(m => m.ModuleProfileModule),
      },
      {
        path: 'municipio',
        loadChildren: () => import('./municipality/municipality.module').then(m => m.MunicipalityModule),
      },
      {
        path: 'nacionalidad',
        loadChildren: () => import('./nationality/nationality.module').then(m => m.NationalityModule),
      },
      {
        path: 'barrio',
        loadChildren: () => import('./neighborhood/neighborhood.module').then(m => m.NeighborhoodModule),
      },
      {
        path: 'observatorio',
        loadChildren: () => import('./observatory/observatory.module').then(m => m.ObservatoryModule),
      },
      {
        path: 'permiso',
        loadChildren: () => import('./permission/permission.module').then(m => m.PermissionModule),
      },
      {
        path: 'permiso_perfil',
        loadChildren: () => import('./permission-profile/permission-profile.module').then(m => m.PermissionProfileModule),
      },
      {
        path: 'persona',
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'persona_perfil',
        loadChildren: () => import('./person-profile/person-profile.module').then(m => m.PersonProfileModule),
      },
      {
        path: 'profesion',
        loadChildren: () => import('./profession/profession.module').then(m => m.ProfessionModule),
      },
      {
        path: 'perfil',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'escolaridad',
        loadChildren: () => import('./scholarship/scholarship.module').then(m => m.ScholarshipModule),
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'clase_sitio',
        loadChildren: () => import('./site-class/site-class.module').then(m => m.SiteClassModule),
      },
      {
        path: 'variable',
        loadChildren: () => import('./variable/variable.module').then(m => m.VariableModule),
      },
      {
        path: 'vehiculo',
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
      },
      {
        path: 'tipo_arma',
        loadChildren: () => import('./weapon-type/weapon-type.module').then(m => m.WeaponTypeModule),
      },
      {
        path: '**',
        component: NotFoundComponent,
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
