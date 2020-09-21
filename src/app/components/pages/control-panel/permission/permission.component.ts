import { Component, OnInit } from '@angular/core';
import {PermissionService} from '../../../../services/permission.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PermissionsComponent} from '../../../shared/modal/permissions/permissions.component';
import {permission} from '../../../../models/permission';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.sass']
})
export class PermissionComponent implements OnInit {

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
    public permissionService: PermissionService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.permissionService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.permissionService.listOfData = data['data'];
        this.permissionService.listOfDisplayData = [...this.permissionService.listOfData];
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
    const data = this.permissionService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.permissionService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.permissionService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.permissionService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Permisos',
      nzContent: PermissionsComponent,
      nzFooter: null
    });
  }

  add(){
    this.permissionService.permissions = [];
    this.permissionService.permissionState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.permissionService.id = id;
    this.permissionService.permissionState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.permissionService.delete(id).subscribe((permission: permission[]) => {

      if(permission['status'] == 'success') {
        this.permissionService.permissions = permission['data'];
        this.total = permission['data'].length;
        this.permissionService.listOfData = permission['data'];
        this.permissionService.listOfDisplayData = [...this.permissionService.listOfData];
        this.loading = false;
      }
      this.message.create(permission['status'], permission['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.permissionService.restore(id).subscribe((permission: permission[]) => {

      if(permission['status'] == 'success') {
        this.permissionService.permissions = permission['data'];
        this.total = permission['data'].length;
        this.permissionService.listOfData = permission['data'];
        this.permissionService.listOfDisplayData = [...this.permissionService.listOfData];
        this.loading = false;
      }
      this.message.create(permission['status'], permission['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
