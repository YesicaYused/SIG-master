import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {site_class} from '../models/site_class';

@Injectable({
  providedIn: 'root'
})
export class SiteClassService {

  sites_class: site_class[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  site_classState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'site_class', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/site_class', {'site_class_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/site_class', {'site_class_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/site_class', {'site_class_id': id}, {headers: this.authService.headers});
  }

  change(site_class: any) {

    return this.httpClient.put(this.authService.API + 'update/site_class', site_class, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'site_class/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/site_class', name, {headers: this.authService.headers});
  }
}
