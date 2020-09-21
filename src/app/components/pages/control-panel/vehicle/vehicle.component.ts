import { Component, OnInit } from '@angular/core';
import {VehicleService} from '../../../../services/vehicle.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {VehiclesComponent} from '../../../shared/modal/vehicles/vehicles.component';
import {vehicle} from '../../../../models/vehicle';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.sass']
})
export class VehicleComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  searchValue = '';
  total = 1;
  listOfData = [];
  loading = true;
  sortValue: string | null = null;
  sortName: string | null = null;
  listOfSearchDocument: string[] = [];
  listOfDisplayData:any = [];

  assign_message: string;

  sort(sort: { key: string; value: string }): void {
    this.sortName= sort.key;
    this.sortValue = sort.value;
    this.searchData();
    this.search();
  }

  constructor(
    public vehicleService: VehicleService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.vehicleService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.vehicleService.listOfData = data['data'];
        this.vehicleService.listOfDisplayData = [...this.vehicleService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
  }

  search(): void {
    const filterFunc = (item: { name: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.name.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.vehicleService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.vehicleService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.vehicleService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.vehicleService.data().subscribe((data: any) => {

      this.loading = false;
      this.message.create('success', 'Correcto.');
    }, (error) => {

      this.loading = false;
      this.message.create('error', 'Incorrecto.');
    });
  }

  cancel(){
    this.message.create('warning', 'Acción cancelada.');
  }

  createComponentModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Gestionar Vehiculo',
      nzContent: VehiclesComponent,
      nzFooter: null
    });
  }

  add(){
    this.vehicleService.vehicles = [];
    this.vehicleService.vehicleState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.vehicleService.id = id;
    this.vehicleService.vehicleState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.vehicleService.delete(id).subscribe((vehicle: vehicle[]) => {

      if(vehicle['status'] == 'success') {
        this.vehicleService.vehicles = vehicle['data'];
        this.total = vehicle['data'].length;
        this.vehicleService.listOfData = vehicle['data'];
        this.vehicleService.listOfDisplayData = [...this.vehicleService.listOfData];
        this.loading = false;
      }
      this.message.create(vehicle['status'], vehicle['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.vehicleService.restore(id).subscribe((vehicle: vehicle[]) => {

      if(vehicle['status'] == 'success') {
        this.vehicleService.vehicles = vehicle['data'];
        this.total = vehicle['data'].length;
        this.vehicleService.listOfData = vehicle['data'];
        this.vehicleService.listOfDisplayData = [...this.vehicleService.listOfData];
        this.loading = false;
      }
      this.message.create(vehicle['status'], vehicle['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
