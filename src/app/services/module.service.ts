import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {module} from '../models/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  modules: module[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  moduleState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'module', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/module', {'module_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/module', {'module_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/module', {'module_id': id}, {headers: this.authService.headers});
  }

  change(module: any) {

    return this.httpClient.put(this.authService.API + 'update/module', module, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'module/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/module', name, {headers: this.authService.headers});
  }
}
