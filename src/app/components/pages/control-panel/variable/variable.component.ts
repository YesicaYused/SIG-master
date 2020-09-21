import { Component, OnInit } from '@angular/core';
import {VariableService} from '../../../../services/variable.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {VariablesComponent} from '../../../shared/modal/variables/variables.component';
import {variable} from '../../../../models/variable';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.sass']
})
export class VariableComponent implements OnInit {

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
    public variableService: VariableService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.variableService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.variableService.listOfData = data['data'];
        this.variableService.listOfDisplayData = [...this.variableService.listOfData];
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
    const data = this.variableService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.variableService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.variableService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.variableService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Variable',
      nzContent: VariablesComponent,
      nzFooter: null
    });
  }

  add(){
    this.variableService.variables = [];
    this.variableService.variableState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.variableService.id = id;
    this.variableService.variableState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.variableService.delete(id).subscribe((variable: variable[]) => {

      if(variable['status'] == 'success') {
        this.variableService.variables = variable['data'];
        this.total = variable['data'].length;
        this.variableService.listOfData = variable['data'];
        this.variableService.listOfDisplayData = [...this.variableService.listOfData];
        this.loading = false;
      }
      this.message.create(variable['status'], variable['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.variableService.restore(id).subscribe((variable: variable[]) => {

      if(variable['status'] == 'success') {
        this.variableService.variables = variable['data'];
        this.total = variable['data'].length;
        this.variableService.listOfData = variable['data'];
        this.variableService.listOfDisplayData = [...this.variableService.listOfData];
        this.loading = false;
      }
      this.message.create(variable['status'], variable['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
