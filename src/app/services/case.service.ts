import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {legal_case} from '../models/case';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  spatial_behavior: any;
  neighborhoods: any;
  temporary_behavior: any;
  civil_status: any;
  municipality: any;
  cases: legal_case[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  caseState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'case', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/case', {'case_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/case', {'case_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/case', {'case_id': id}, {headers: this.authService.headers});
  }

  change(legal_case: any) {

    return this.httpClient.put(this.authService.API + 'update/case', legal_case, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'case/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/case', name, {headers: this.authService.headers});
  }

  analytic(table: any, variable: any){
    return this.httpClient.post(this.authService.API + 'theft_analysi', {"table": table, "variable": variable}, {headers: this.authService.headers});
  }

  analyticLegal(column: any, variable: any){
    return this.httpClient.post(this.authService.API + 'theft_analysi', {"column": column, "variable": variable}, {headers: this.authService.headers});
  }

  map(map: any){
    return this.httpClient.post(this.authService.API + 'theft_analysi', {"map": map}, {headers: this.authService.headers});
  }
}
