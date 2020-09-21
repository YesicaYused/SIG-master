import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {permission_profile} from '../models/permission_profile';

@Injectable({
  providedIn: 'root'
})
export class PermissionProfileService {

  permission_profiles: permission_profile[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  permission_profileState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'permission_profile', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/permission_profile', {'permission_profile_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/permission_profile', {'permission_profile_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/permission_profile', {'permission_profile_id': id}, {headers: this.authService.headers});
  }

  change(permission_profile: any) {

    return this.httpClient.put(this.authService.API + 'update/permission_profile', permission_profile, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'permission_profile/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/permission_profile', name, {headers: this.authService.headers});
  }
}
