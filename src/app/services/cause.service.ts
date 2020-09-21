import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {cause} from '../models/cause';

@Injectable({
  providedIn: 'root'
})

export class CauseService {

  causes: cause[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  causeState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'cause', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/cause', {'cause_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/cause', {'cause_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/cause', {'cause_id': id}, {headers: this.authService.headers});
  }

  change(cause: any) {

    return this.httpClient.put(this.authService.API + 'update/cause', cause, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'cause/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/cause', name, {headers: this.authService.headers});
  }
}
