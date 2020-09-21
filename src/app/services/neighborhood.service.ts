import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {neighborhood} from '../models/neighborhood';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodService {

  neighborhoods: neighborhood[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  neighborhoodState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'neighborhood', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/neighborhood', {'neighborhood_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/neighborhood', {'neighborhood_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/neighborhood', {'neighborhood_id': id}, {headers: this.authService.headers});
  }

  change(neighborhood: any) {

    return this.httpClient.put(this.authService.API + 'update/neighborhood', neighborhood, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'neighborhood/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/neighborhood', name, {headers: this.authService.headers});
  }
}
