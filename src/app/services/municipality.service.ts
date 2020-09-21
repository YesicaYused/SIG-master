import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {municipality} from '../models/municipality';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  municipalities: municipality[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  municipalityState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'municipality', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/municipality', {'municipality_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/municipality', {'municipality_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/municipality', {'municipality_id': id}, {headers: this.authService.headers});
  }

  change(municipality: any) {

    return this.httpClient.put(this.authService.API + 'update/municipality', municipality, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'municipality/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/municipality', name, {headers: this.authService.headers});
  }
}
