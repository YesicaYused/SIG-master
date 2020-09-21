import { Component, OnInit } from '@angular/core';
import {ScholarshipService} from '../../../../services/scholarship.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ScholarshipsComponent} from '../../../shared/modal/scholarships/scholarships.component';
import {scholarship} from '../../../../models/scholarship';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.sass']
})
export class ScholarshipComponent implements OnInit {

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
    public scholarshipService: ScholarshipService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.scholarshipService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.scholarshipService.listOfData = data['data'];
        this.scholarshipService.listOfDisplayData = [...this.scholarshipService.listOfData];
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
    const data = this.scholarshipService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.scholarshipService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.scholarshipService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.scholarshipService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Escolaridad',
      nzContent: ScholarshipsComponent,
      nzFooter: null
    });
  }

  add(){
    this.scholarshipService.scholarships = [];
    this.scholarshipService.scholarshipState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.scholarshipService.id = id;
    this.scholarshipService.scholarshipState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.scholarshipService.delete(id).subscribe((scholarship: scholarship[]) => {

      if(scholarship['status'] == 'success') {
        this.scholarshipService.scholarships = scholarship['data'];
        this.total = scholarship['data'].length;
        this.scholarshipService.listOfData = scholarship['data'];
        this.scholarshipService.listOfDisplayData = [...this.scholarshipService.listOfData];
        this.loading = false;
      }
      this.message.create(scholarship['status'], scholarship['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.scholarshipService.restore(id).subscribe((scholarship: scholarship[]) => {

      if(scholarship['status'] == 'success') {
        this.scholarshipService.scholarships = scholarship['data'];
        this.total = scholarship['data'].length;
        this.scholarshipService.listOfData = scholarship['data'];
        this.scholarshipService.listOfDisplayData = [...this.scholarshipService.listOfData];
        this.loading = false;
      }
      this.message.create(scholarship['status'], scholarship['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
