import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {profile} from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profiles: profile[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  profileState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'profile', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/profile', {'profile_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/profile', {'profile_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/profile', {'profile_id': id}, {headers: this.authService.headers});
  }

  change(profile: any) {

    return this.httpClient.put(this.authService.API + 'update/profile', profile, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'profile/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/profile', name, {headers: this.authService.headers});
  }
}
