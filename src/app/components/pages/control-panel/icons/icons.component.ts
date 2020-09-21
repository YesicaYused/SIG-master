import { Component, OnInit } from '@angular/core';
import {IconService} from '../../../../services/icon.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {IconComponent} from '../../../shared/modal/icon/icon.component';
import {icon} from '../../../../models/icon';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.sass']
})
export class IconsComponent implements OnInit {

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
    public iconService: IconService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.iconService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.iconService.listOfData = data['data'];
        this.iconService.listOfDisplayData = [...this.iconService.listOfData];
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
    const data = this.iconService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.iconService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.iconService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.iconService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar iconos',
      nzContent: IconComponent,
      nzFooter: null
    });
  }

  add(){
    this.iconService.icons = [];
    this.iconService.iconState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.iconService.id = id;
    this.iconService.iconState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.iconService.delete(id).subscribe((icon: icon[]) => {

      if(icon['status'] == 'success') {
        this.iconService.icons = icon['data'];
        this.total = icon['data'].length;
        this.iconService.listOfData = icon['data'];
        this.iconService.listOfDisplayData = [...this.iconService.listOfData];
        this.loading = false;
      }
      this.message.create(icon['status'], icon['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.iconService.restore(id).subscribe((icon: icon[]) => {

      if(icon['status'] == 'success') {
        this.iconService.icons = icon['data'];
        this.total = icon['data'].length;
        this.iconService.listOfData = icon['data'];
        this.iconService.listOfDisplayData = [...this.iconService.listOfData];
        this.loading = false;
      }
      this.message.create(icon['status'], icon['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
