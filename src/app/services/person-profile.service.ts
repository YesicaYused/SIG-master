import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {person_profile} from '../models/person_profile';

@Injectable({
  providedIn: 'root'
})
export class PersonProfileService {

  person_profiles: person_profile[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  person_profileState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'person_profile', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/person_profile', {'person_profile_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/person_profile', {'person_profile_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/person_profile', {'person_profile_id': id}, {headers: this.authService.headers});
  }

  change(person_profile: any) {

    return this.httpClient.put(this.authService.API + 'update/person_profile', person_profile, {headers: this.authService.headers});
  }

  all(){

    return this.httpClient.get(this.authService.API + 'person_profile/all', {headers: this.authService.headers});
  }

  save(profile_id: any, person_id: any){

    return this.httpClient.post(this.authService.API + 'add/person_profile', {'profile_id': profile_id, 'person_id': person_id}, {headers: this.authService.headers});
  }

  queryProfile(id: any) {

    return this.httpClient.post(this.authService.API + 'queryProfile/person', {'id': id}, {headers: this.authService.headers});
  }
}
