import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {WeaponTypeService} from '../../../../services/weapon-type.service';
import {WeaponTypesComponent} from '../../../shared/modal/weapon-types/weapon-types.component';
import {weapon_type} from '../../../../models/weapon_type';

@Component({
  selector: 'app-weapon-type',
  templateUrl: './weapon-type.component.html',
  styleUrls: ['./weapon-type.component.sass']
})
export class WeaponTypeComponent implements OnInit {

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
    public weapon_typeService: WeaponTypeService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.weapon_typeService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.weapon_typeService.listOfData = data['data'];
        this.weapon_typeService.listOfDisplayData = [...this.weapon_typeService.listOfData];
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
    const data = this.weapon_typeService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.weapon_typeService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.weapon_typeService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.weapon_typeService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Tipo de Arma',
      nzContent: WeaponTypesComponent,
      nzFooter: null
    });
  }

  add(){
    this.weapon_typeService.weapon_types = [];
    this.weapon_typeService.weapon_typeState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.weapon_typeService.id = id;
    this.weapon_typeService.weapon_typeState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.weapon_typeService.delete(id).subscribe((weapon_type: weapon_type[]) => {

      if(weapon_type['status'] == 'success') {
        this.weapon_typeService.weapon_types = weapon_type['data'];
        this.total = weapon_type['data'].length;
        this.weapon_typeService.listOfData = weapon_type['data'];
        this.weapon_typeService.listOfDisplayData = [...this.weapon_typeService.listOfData];
        this.loading = false;
      }
      this.message.create(weapon_type['status'], weapon_type['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.weapon_typeService.restore(id).subscribe((weapon_type: weapon_type[]) => {

      if(weapon_type['status'] == 'success') {
        this.weapon_typeService.weapon_types = weapon_type['data'];
        this.total = weapon_type['data'].length;
        this.weapon_typeService.listOfData = weapon_type['data'];
        this.weapon_typeService.listOfDisplayData = [...this.weapon_typeService.listOfData];
        this.loading = false;
      }
      this.message.create(weapon_type['status'], weapon_type['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
