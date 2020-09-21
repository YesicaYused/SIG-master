import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PermissionProfileService} from '../../../../services/permission-profile.service';
import {PermissionsProfilesComponent} from '../../../shared/modal/permissions-profiles/permissions-profiles.component';
import {permission_profile} from '../../../../models/permission_profile';

@Component({
  selector: 'app-permission-profile',
  templateUrl: './permission-profile.component.html',
  styleUrls: ['./permission-profile.component.sass']
})
export class PermissionProfileComponent implements OnInit {

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
    public permission_profileService: PermissionProfileService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.permission_profileService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.permission_profileService.listOfData = data['data'];
        this.permission_profileService.listOfDisplayData = [...this.permission_profileService.listOfData];
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
    const data = this.permission_profileService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.permission_profileService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.permission_profileService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.permission_profileService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Permiso - Perfil',
      nzContent: PermissionsProfilesComponent,
      nzFooter: null
    });
  }

  add(){
    this.permission_profileService.permission_profiles = [];
    this.permission_profileService.permission_profileState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.permission_profileService.id = id;
    this.permission_profileService.permission_profileState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.permission_profileService.delete(id).subscribe((permission_profile: permission_profile[]) => {

      if(permission_profile['status'] == 'success') {
        this.permission_profileService.permission_profiles = permission_profile['data'];
        this.total = permission_profile['data'].length;
        this.permission_profileService.listOfData = permission_profile['data'];
        this.permission_profileService.listOfDisplayData = [...this.permission_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(permission_profile['status'], permission_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.permission_profileService.restore(id).subscribe((permission_profile: permission_profile[]) => {

      if(permission_profile['status'] == 'success') {
        this.permission_profileService.permission_profiles = permission_profile['data'];
        this.total = permission_profile['data'].length;
        this.permission_profileService.listOfData = permission_profile['data'];
        this.permission_profileService.listOfDisplayData = [...this.permission_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(permission_profile['status'], permission_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
