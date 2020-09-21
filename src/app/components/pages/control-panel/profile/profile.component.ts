import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../../services/profile.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ProfilesComponent} from '../../../shared/modal/profiles/profiles.component';
import {profile} from '../../../../models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

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
    public profileService: ProfileService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.profileService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.profileService.listOfData = data['data'];
        this.profileService.listOfDisplayData = [...this.profileService.listOfData];
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
    const data = this.profileService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.profileService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.profileService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.profileService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Perfil',
      nzContent: ProfilesComponent,
      nzFooter: null
    });
  }

  add(){
    this.profileService.profiles = [];
    this.profileService.profileState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.profileService.id = id;
    this.profileService.profileState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.profileService.delete(id).subscribe((profile: profile[]) => {

      if(profile['status'] == 'success') {
        this.profileService.profiles = profile['data'];
        this.total = profile['data'].length;
        this.profileService.listOfData = profile['data'];
        this.profileService.listOfDisplayData = [...this.profileService.listOfData];
        this.loading = false;
      }
      this.message.create(profile['status'], profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.profileService.restore(id).subscribe((profile: profile[]) => {

      if(profile['status'] == 'success') {
        this.profileService.profiles = profile['data'];
        this.total = profile['data'].length;
        this.profileService.listOfData = profile['data'];
        this.profileService.listOfDisplayData = [...this.profileService.listOfData];
        this.loading = false;
      }
      this.message.create(profile['status'], profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }
}
