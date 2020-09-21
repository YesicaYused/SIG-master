import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {scholarship} from '../models/scholarship';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  scholarships: scholarship[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  scholarshipState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'scholarship', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/scholarship', {'scholarship_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/scholarship', {'scholarship_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/scholarship', {'scholarship_id': id}, {headers: this.authService.headers});
  }

  change(scholarship: any) {

    return this.httpClient.put(this.authService.API + 'update/scholarship', scholarship, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'scholarship/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/scholarship', name, {headers: this.authService.headers});
  }
}
