import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {person} from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  people: person[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  personState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'person', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/person', {'person_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/person', {'person_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/person', {'person_id': id}, {headers: this.authService.headers});
  }

  change(person: any) {

    return this.httpClient.put(this.authService.API + 'update/person', person, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'person/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/person', name, {headers: this.authService.headers});
  }
}
