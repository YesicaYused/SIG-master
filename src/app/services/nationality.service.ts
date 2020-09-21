import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {nationality} from '../models/nationality';

@Injectable({
  providedIn: 'root'
})
export class NationalityService {

  nationalities: nationality[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  nationalityState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'nationality', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/nationality', {'nationality_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/nationality', {'nationality_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/nationality', {'nationality_id': id}, {headers: this.authService.headers});
  }

  change(nationality: any) {

    return this.httpClient.put(this.authService.API + 'update/nationality', nationality, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'nationality/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/nationality', name, {headers: this.authService.headers});
  }
}
