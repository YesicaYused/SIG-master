import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {department} from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  departments: department[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  departmentState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'department', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/department', {'department_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/department', {'department_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/department', {'department_id': id}, {headers: this.authService.headers});
  }

  change(department: any) {

    return this.httpClient.put(this.authService.API + 'update/department', department, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'department/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/department', name, {headers: this.authService.headers});
  }
}
