import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CauseService} from '../../../../services/cause.service';
import {CausesComponent} from '../../../shared/modal/causes/causes.component';
import {cause} from '../../../../models/cause';

@Component({
  selector: 'app-causa',
  templateUrl: './cause.component.html',
  styleUrls: ['./cause.component.sass']
})
export class CauseComponent implements OnInit {

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
    public causeService: CauseService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.causeService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.causeService.listOfData = data['data'];
        this.causeService.listOfDisplayData = [...this.causeService.listOfData];
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
    const data = this.causeService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.causeService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.causeService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.causeService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Causa',
      nzContent: CausesComponent,
      nzFooter: null
    });
  }

  add(){
    this.causeService.causes = [];
    this.causeService.causeState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.causeService.id = id;
    this.causeService.causeState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.causeService.delete(id).subscribe((cause: cause[]) => {

      if(cause['status'] == 'success') {
        this.causeService.causes = cause['data'];
        this.total = cause['data'].length;
        this.causeService.listOfData = cause['data'];
        this.causeService.listOfDisplayData = [...this.causeService.listOfData];
        this.loading = false;
      }
      this.message.create(cause['status'], cause['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.causeService.restore(id).subscribe((cause: cause[]) => {

      if(cause['status'] == 'success') {
        this.causeService.causes = cause['data'];
        this.total = cause['data'].length;
        this.causeService.listOfData = cause['data'];
        this.causeService.listOfDisplayData = [...this.causeService.listOfData];
        this.loading = false;
      }
      this.message.create(cause['status'], cause['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }
}
