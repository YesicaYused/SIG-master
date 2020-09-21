import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {permission} from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  permissions: permission[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  permissionState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'permission', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/permission', {'permission_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/permission', {'permission_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/permission', {'permission_id': id}, {headers: this.authService.headers});
  }

  change(permission: any) {

    return this.httpClient.put(this.authService.API + 'update/permission', permission, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'permission/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/permission', name, {headers: this.authService.headers});
  }
}
