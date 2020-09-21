import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {modality} from '../models/modality';

@Injectable({
  providedIn: 'root'
})
export class ModalityService {

  modalities: modality[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  modalityState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'modality', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/modality', {'modality_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/modality', {'modality_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/modality', {'modality_id': id}, {headers: this.authService.headers});
  }

  change(modality: any) {

    return this.httpClient.put(this.authService.API + 'update/modality', modality, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'modality/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/modality', name, {headers: this.authService.headers});
  }
}
