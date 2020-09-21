import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {observatory} from '../models/observatory';

@Injectable({
  providedIn: 'root'
})
export class ObservatoryService {

  observatories: observatory[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  observatoryState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'observatory', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/observatory', {'observatory_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/observatory', {'observatory_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/observatory', {'observatory_id': id}, {headers: this.authService.headers});
  }

  change(observatory: any) {

    return this.httpClient.put(this.authService.API + 'update/observatory', observatory, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'observatory/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/observatory', name, {headers: this.authService.headers});
  }
}
