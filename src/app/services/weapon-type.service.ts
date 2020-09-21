import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {weapon_type} from '../models/weapon_type';

@Injectable({
  providedIn: 'root'
})
export class WeaponTypeService {

  weapon_types: weapon_type[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  weapon_typeState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'weapon_type', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/weapon_type', {'weapon_type_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/weapon_type', {'weapon_type_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/weapon_type', {'weapon_type_id': id}, {headers: this.authService.headers});
  }

  change(weapon_type: any) {

    return this.httpClient.put(this.authService.API + 'update/weapon_type', weapon_type, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'weapon_type/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/weapon_type', name, {headers: this.authService.headers});
  }
}
