import { Component, OnInit } from '@angular/core';
import {NeighborhoodService} from '../../../../services/neighborhood.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {NeighborhoodsComponent} from '../../../shared/modal/neighborhoods/neighborhoods.component';
import {neighborhood} from '../../../../models/neighborhood';

@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.sass']
})
export class NeighborhoodComponent implements OnInit {

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
    public neighborhoodService: NeighborhoodService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.neighborhoodService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.neighborhoodService.listOfData = data['data'];
        this.neighborhoodService.listOfDisplayData = [...this.neighborhoodService.listOfData];
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
    const data = this.neighborhoodService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.neighborhoodService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.neighborhoodService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.neighborhoodService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Barrio',
      nzContent: NeighborhoodsComponent,
      nzFooter: null
    });
  }

  add(){
    this.neighborhoodService.neighborhoods = [];
    this.neighborhoodService.neighborhoodState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.neighborhoodService.id = id;
    this.neighborhoodService.neighborhoodState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.neighborhoodService.delete(id).subscribe((neighborhood: neighborhood[]) => {

      if(neighborhood['status'] == 'success') {
        this.neighborhoodService.neighborhoods = neighborhood['data'];
        this.total = neighborhood['data'].length;
        this.neighborhoodService.listOfData = neighborhood['data'];
        this.neighborhoodService.listOfDisplayData = [...this.neighborhoodService.listOfData];
        this.loading = false;
      }
      this.message.create(neighborhood['status'], neighborhood['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.neighborhoodService.restore(id).subscribe((neighborhood: neighborhood[]) => {

      if(neighborhood['status'] == 'success') {
        this.neighborhoodService.neighborhoods = neighborhood['data'];
        this.total = neighborhood['data'].length;
        this.neighborhoodService.listOfData = neighborhood['data'];
        this.neighborhoodService.listOfDisplayData = [...this.neighborhoodService.listOfData];
        this.loading = false;
      }
      this.message.create(neighborhood['status'], neighborhood['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
