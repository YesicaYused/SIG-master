import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { person } from '../models/person';
import { profile } from '../models/profile';
import {environment} from '../../environments/environment';
import { Router } from '@angular/router';
import {permission} from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  public API: string;
  headers: HttpHeaders;
  TOKEN: any;

  router: Router;

  HEADER: HttpHeaders;

  people: person = {
    name: null,
    last_name: null,
    code: null,
    password: null,
    state: null,
  };

  profile= []
  permission: permission = {
    name: null,
    state: null,
  }
  state: boolean;
  stateProfile: boolean = false;
  current_url: string;

  constructor(
    private httpClient: HttpClient,
    ) {

      this.header();
      this.API = environment.API;
      this.HEADER = new HttpHeaders({
        'Authorization': this.TOKEN
      });
     }

  login(people: person){

    return this.httpClient.post(this.API + 'login', people, {headers: this.headers});
  }

  personalInformation(code){

    return this.httpClient.post(this.API + 'personalInformation', {'code': code}, {headers: this.headers});
  }

  password_reset(people: person) {

    return this.httpClient.post(this.API + 'person/password_reset', people, {headers: this.headers});
  }

  token(){

    let token = JSON.parse(localStorage.getItem('Token'));
    if(token){
      this.state = true;
      return token;
    }
  }

  header(){
    this.TOKEN = this.token();
    if(this.TOKEN){
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.TOKEN
      });
    }else{

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return this.headers;
  }

  Header(token){
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }
}
