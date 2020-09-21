import { Injectable } from '@angular/core';
import {AuthServices} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {vehicle} from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  vehicles: vehicle[];
  listOfData = [];
  listOfDisplayData:any = [];
  id: number;
  vehicleState: boolean = false;

  constructor(
    private authService: AuthServices,
    private httpClient: HttpClient
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'vehicle', {headers: this.authService.headers});
  }

  restore(id: any){
    return this.httpClient.put(this.authService.API + 'restore/vehicle', {'vehicle_id': id} ,{headers: this.authService.headers});
  }

  delete(id: any){
    return this.httpClient.put(this.authService.API + 'delete/vehicle', {'vehicle_id': id} ,{headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'query/vehicle', {'vehicle_id': id}, {headers: this.authService.headers});
  }

  change(vehicle: any) {

    return this.httpClient.put(this.authService.API + 'update/vehicle', vehicle, {headers: this.authService.headers});
  }

  all(){
    return this.httpClient.get(this.authService.API + 'vehicle/all', {headers: this.authService.headers});
  }

  save(name: any){
    return this.httpClient.post(this.authService.API + 'add/vehicle', name, {headers: this.authService.headers});
  }
}
