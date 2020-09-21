import { Component, OnInit } from '@angular/core';
import {NationalityService} from '../../../../services/nationality.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {NationalitiesComponent} from '../../../shared/modal/nationalities/nationalities.component';
import {nationality} from '../../../../models/nationality';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.sass']
})
export class NationalityComponent implements OnInit {

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
    public nationalityService: NationalityService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.nationalityService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.nationalityService.listOfData = data['data'];
        this.nationalityService.listOfDisplayData = [...this.nationalityService.listOfData];
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
    const data = this.nationalityService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.nationalityService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.nationalityService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.nationalityService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Nacionalidad',
      nzContent: NationalitiesComponent,
      nzFooter: null
    });
  }

  add(){
    this.nationalityService.nationalities = [];
    this.nationalityService.nationalityState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.nationalityService.id = id;
    this.nationalityService.nationalityState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.nationalityService.delete(id).subscribe((nationality: nationality[]) => {

      if(nationality['status'] == 'success') {
        this.nationalityService.nationalities = nationality['data'];
        this.total = nationality['data'].length;
        this.nationalityService.listOfData = nationality['data'];
        this.nationalityService.listOfDisplayData = [...this.nationalityService.listOfData];
        this.loading = false;
      }
      this.message.create(nationality['status'], nationality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.nationalityService.restore(id).subscribe((nationality: nationality[]) => {

      if(nationality['status'] == 'success') {
        this.nationalityService.nationalities = nationality['data'];
        this.total = nationality['data'].length;
        this.nationalityService.listOfData = nationality['data'];
        this.nationalityService.listOfDisplayData = [...this.nationalityService.listOfData];
        this.loading = false;
      }
      this.message.create(nationality['status'], nationality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
