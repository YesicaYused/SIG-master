import { Component, OnInit } from '@angular/core';
import {ModuleService} from '../../../../services/module.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ModulesComponent} from '../../../shared/modal/modules/modules.component';
import {module} from '../../../../models/module';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.sass']
})
export class ModuleComponent implements OnInit {

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
    public moduleService: ModuleService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.moduleService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.moduleService.listOfData = data['data'];
        this.moduleService.listOfDisplayData = [...this.moduleService.listOfData];
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
    const data = this.moduleService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.moduleService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.moduleService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.moduleService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Modulo',
      nzContent: ModulesComponent,
      nzFooter: null
    });
  }

  add(){
    this.moduleService.modules = [];
    this.moduleService.moduleState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.moduleService.id = id;
    this.moduleService.moduleState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.moduleService.delete(id).subscribe((modules: module[]) => {

      if(modules['status'] == 'success') {
        this.moduleService.modules = modules['data'];
        this.total = modules['data'].length;
        this.moduleService.listOfData = modules['data'];
        this.moduleService.listOfDisplayData = [...this.moduleService.listOfData];
        this.loading = false;
      }
      this.message.create(modules['status'], modules['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.moduleService.restore(id).subscribe((modules: module[]) => {

      if(modules['status'] == 'success') {
        this.moduleService.modules = modules['data'];
        this.total = modules['data'].length;
        this.moduleService.listOfData = modules['data'];
        this.moduleService.listOfDisplayData = [...this.moduleService.listOfData];
        this.loading = false;
      }
      this.message.create(modules['status'], modules['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
