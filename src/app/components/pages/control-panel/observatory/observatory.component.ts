import { Component, OnInit } from '@angular/core';
import {ObservatoryService} from '../../../../services/observatory.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ObservatoriesComponent} from '../../../shared/modal/observatories/observatories.component';
import {observatory} from '../../../../models/observatory';

@Component({
  selector: 'app-observatory',
  templateUrl: './observatory.component.html',
  styleUrls: ['./observatory.component.sass']
})
export class ObservatoryComponent implements OnInit {

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
    public observatoryService: ObservatoryService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.observatoryService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.observatoryService.listOfData = data['data'];
        this.observatoryService.listOfDisplayData = [...this.observatoryService.listOfData];
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
    const data = this.observatoryService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.observatoryService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.observatoryService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.observatoryService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Observatorio',
      nzContent: ObservatoriesComponent,
      nzFooter: null
    });
  }

  add(){
    this.observatoryService.observatories = [];
    this.observatoryService.observatoryState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.observatoryService.id = id;
    this.observatoryService.observatoryState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.observatoryService.delete(id).subscribe((observatory: observatory[]) => {

      if(observatory['status'] == 'success') {
        this.observatoryService.observatories = observatory['data'];
        this.total = observatory['data'].length;
        this.observatoryService.listOfData = observatory['data'];
        this.observatoryService.listOfDisplayData = [...this.observatoryService.listOfData];
        this.loading = false;
      }
      this.message.create(observatory['status'], observatory['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.observatoryService.restore(id).subscribe((observatory: observatory[]) => {

      if(observatory['status'] == 'success') {
        this.observatoryService.observatories = observatory['data'];
        this.total = observatory['data'].length;
        this.observatoryService.listOfData = observatory['data'];
        this.observatoryService.listOfDisplayData = [...this.observatoryService.listOfData];
        this.loading = false;
      }
      this.message.create(observatory['status'], observatory['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
