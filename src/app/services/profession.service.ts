import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {profession} from '../models/profession';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  professions: profession[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  professionState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'profession', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/profession', {'profession_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/profession', {'profession_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/profession', {'profession_id': id}, {headers: this.authService.headers});
  }

  change(profession: any) {

    return this.httpClient.put(this.authService.API + 'update/profession', profession, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'profession/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/profession', name, {headers: this.authService.headers});
  }
}
