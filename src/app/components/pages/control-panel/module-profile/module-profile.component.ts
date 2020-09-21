import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ModuleProfileService} from '../../../../services/module-profile.service';
import {ModuleProfilesComponent} from '../../../shared/modal/module-profiles/module-profiles.component';
import {module_profile} from '../../../../models/module_profile';
import {ModuleService} from '../../../../services/module.service';

@Component({
  selector: 'app-module-profile',
  templateUrl: './module-profile.component.html',
  styleUrls: ['./module-profile.component.sass']
})
export class ModuleProfileComponent implements OnInit {

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
    public module_profileService: ModuleProfileService,
    private modalService: NzModalService,
    public message: NzMessageService,
    public moduleService: ModuleService,
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.module_profileService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.module_profileService.listOfData = data['data'];
        this.module_profileService.listOfDisplayData = [...this.module_profileService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
    this.modules();
  }

  search(): void {
    const filterFunc = (item: { name: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.name.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.module_profileService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.module_profileService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.module_profileService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.module_profileService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Modulo - Perfil',
      nzContent: ModuleProfilesComponent,
      nzFooter: null,
      nzWidth: '50%'
    });
  }

  modules(){
    this.moduleService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.moduleService.listOfData = data['data'];
        this.moduleService.listOfDisplayData = [...this.moduleService.listOfData];
      });
  }

  add(){
    this.module_profileService.module_profiles = [];
    this.module_profileService.module_profileState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.module_profileService.id = id;
    this.module_profileService.module_profileState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.module_profileService.delete(id).subscribe((module_profile: module_profile[]) => {

      if(module_profile['status'] == 'success') {
        this.module_profileService.module_profiles = module_profile['data'];
        this.total = module_profile['data'].length;
        this.module_profileService.listOfData = module_profile['data'];
        this.module_profileService.listOfDisplayData = [...this.module_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(module_profile['status'], module_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.module_profileService.restore(id).subscribe((module_profile: module_profile[]) => {

      if(module_profile['status'] == 'success') {
        this.module_profileService.module_profiles = module_profile['data'];
        this.total = module_profile['data'].length;
        this.module_profileService.listOfData = module_profile['data'];
        this.module_profileService.listOfDisplayData = [...this.module_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(module_profile['status'], module_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
