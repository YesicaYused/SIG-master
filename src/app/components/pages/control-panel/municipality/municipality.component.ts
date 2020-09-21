import { Component, OnInit } from '@angular/core';
import {MunicipalityService} from '../../../../services/municipality.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {MunicipalitiesComponent} from '../../../shared/modal/municipalities/municipalities.component';
import {municipality} from '../../../../models/municipality';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.sass']
})
export class MunicipalityComponent implements OnInit {

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
    public municipalityService: MunicipalityService,
    public departmentService: DepartmentService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.municipalityService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.municipalityService.listOfData = data['data'];
        this.municipalityService.listOfDisplayData = [...this.municipalityService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
    this.department();
  }

  search(): void {
    const filterFunc = (item: { name: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.name.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.municipalityService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.municipalityService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.municipalityService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.municipalityService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Municipio',
      nzContent: MunicipalitiesComponent,
      nzFooter: null
    });
  }

  department(){
    if(this.departmentService.departmentState == false){
      this.departmentService.data().subscribe((data: any) => {
        this.departmentService.departments = data['data'];
        this.departmentService.departmentState = true;
      }, (error)=> { });
    }
  }

  add(){
    if(this.departmentService.departmentState){
      this.municipalityService.municipalityState = true;
      this.municipalityService.municipalities = [];
    }
    this.createComponentModal();
  }

  edit(id: any){
    this.municipalityService.id = id;
    this.municipalityService.municipalityState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.municipalityService.delete(id).subscribe((municipality: municipality[]) => {

      if(municipality['status'] == 'success') {
        this.municipalityService.municipalities = municipality['data'];
        this.total = municipality['data'].length;
        this.municipalityService.listOfData = municipality['data'];
        this.municipalityService.listOfDisplayData = [...this.municipalityService.listOfData];
        this.loading = false;
      }
      this.message.create(municipality['status'], municipality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.municipalityService.restore(id).subscribe((municipality: municipality[]) => {

      if(municipality['status'] == 'success') {
        this.municipalityService.municipalities = municipality['data'];
        this.total = municipality['data'].length;
        this.municipalityService.listOfData = municipality['data'];
        this.municipalityService.listOfDisplayData = [...this.municipalityService.listOfData];
        this.loading = false;
      }
      this.message.create(municipality['status'], municipality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
