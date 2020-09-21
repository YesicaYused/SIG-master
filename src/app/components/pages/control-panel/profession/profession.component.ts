import { Component, OnInit } from '@angular/core';
import {ProfessionService} from '../../../../services/profession.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ProfessionsComponent} from '../../../shared/modal/professions/professions.component';
import {profession} from '../../../../models/profession';

@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.sass']
})
export class ProfessionComponent implements OnInit {

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
    public professionService: ProfessionService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.professionService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.length;
        this.professionService.listOfData = data;
        this.professionService.listOfDisplayData = [...this.professionService.listOfData];
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
    const data = this.professionService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.professionService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.professionService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.professionService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Profesión',
      nzContent: ProfessionsComponent,
      nzFooter: null
    });
  }

  add(){
    this.professionService.professions = [];
    this.professionService.professionState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.professionService.id = id;
    this.professionService.professionState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.professionService.delete(id).subscribe((profession: profession[]) => {

      if(profession['status'] == 'success') {
        this.professionService.professions = profession['data'];
        this.total = profession['data'].length;
        this.professionService.listOfData = profession['data'];
        this.professionService.listOfDisplayData = [...this.professionService.listOfData];
        this.loading = false;
      }
      this.message.create(profession['status'], profession['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.professionService.restore(id).subscribe((profession: profession[]) => {

      if(profession['status'] == 'success') {
        this.professionService.professions = profession['data'];
        this.total = profession['data'].length;
        this.professionService.listOfData = profession['data'];
        this.professionService.listOfDisplayData = [...this.professionService.listOfData];
        this.loading = false;
      }
      this.message.create(profession['status'], profession['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
