import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {icon} from '../models/icon';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  icons: icon[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  iconState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'icon', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/icon', {'icon_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/icon', {'icon_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/icon', {'icon_id': id}, {headers: this.authService.headers});
  }

  change(icon: any) {

    return this.httpClient.put(this.authService.API + 'update/icon', icon, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'icon/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/icon', name, {headers: this.authService.headers});
  }
}
