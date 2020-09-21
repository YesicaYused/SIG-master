import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from './auth.service';
import {module_profile} from '../models/module_profile';

@Injectable({
  providedIn: 'root'
})
export class ModuleProfileService {

  moduleProfile = [];
  module_profiles: module_profile[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  module_profileState: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthServices
  ) { }

  assignedModule(profile, code){
    return this.httpClient.post(this.authService.API + 'getModuleProfile', {'code': code, 'name':profile},{headers: this.authService.headers});
  }

  data(){
    return this.httpClient.get(this.authService.API + 'module_profile', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/module_profile', {'module_profile_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/module_profile', {'module_profile_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/module_profile', {'module_profile_id': id}, {headers: this.authService.headers});
  }

  change(module_profile: any) {

    return this.httpClient.put(this.authService.API + 'update/module_profile', module_profile, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'module_profile/all', {headers: this.authService.headers});
  }

  save(profile_id: any, module_id: any){
    return this.httpClient.post(this.authService.API + 'add/module_profile', {'profile_id': profile_id, 'module_id': module_id}, {headers: this.authService.headers});
  }

  queryProfile(id: any) {

    return this.httpClient.post(this.authService.API + 'queryProfile/person', {'id': id}, {headers: this.authService.headers});
  }
}
