import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {variable} from '../models/variable';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  month: any;
  months: any;
  year: any;
  variables: any;
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  variableState: boolean = false;
  positionObservatory;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'variable', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/variable', {'variable_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/variable', {'variable_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/variable', {'variable_id': id}, {headers: this.authService.headers});
  }

  change(variable: any) {

    return this.httpClient.put(this.authService.API + 'update/variable', variable, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'variable/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/variable', name, {headers: this.authService.headers});
  }

  analyticMonth(date: any, current: any){
    return this.httpClient.post(this.authService.API + 'theft_analysi', {"date": date, 'current': current}, {headers: this.authService.headers});
  }

  analyticYear(date: any, current: any){
    return this.httpClient.post(this.authService.API + 'theft_analysi', {"date": date, 'current': current}, {headers: this.authService.headers});
  }
}
