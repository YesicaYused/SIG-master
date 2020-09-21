import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PersonProfileService} from '../../../../services/person-profile.service';
import {PersonProfilesComponent} from '../../../shared/modal/person-profiles/person-profiles.component';
import {person_profile} from '../../../../models/person_profile';
import {PersonService} from '../../../../services/person.service';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.sass']
})
export class PersonProfileComponent implements OnInit {

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
    public person_profileService: PersonProfileService,
    private modalService: NzModalService,
    public message: NzMessageService,
    public personService: PersonService,
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.person_profileService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.person_profileService.listOfData = data['data'];
        this.person_profileService.listOfDisplayData = [...this.person_profileService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
    this.people();
  }

  search(): void {
    const filterFunc = (item: { name: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.name.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.person_profileService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.person_profileService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.person_profileService.listOfDisplayData = data;
    }
  }

  people(){
    this.personService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.personService.listOfData = data['data'];
        this.personService.listOfDisplayData = [...this.personService.listOfData];
      });
  }

  create(){

    this.loading = true;
    this.person_profileService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Persona - Perfil',
      nzContent: PersonProfilesComponent,
      nzFooter: null,
      nzWidth: '50%'
    });
  }

  add(){
    this.person_profileService.person_profiles = [];
    this.person_profileService.person_profileState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.person_profileService.id = id;
    this.person_profileService.person_profileState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.person_profileService.delete(id).subscribe((person_profile: person_profile[]) => {

      if(person_profile['status'] == 'success') {
        this.person_profileService.person_profiles = person_profile['data'];
        this.total = person_profile['data'].length;
        this.person_profileService.listOfData = person_profile['data'];
        this.person_profileService.listOfDisplayData = [...this.person_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(person_profile['status'], person_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.person_profileService.restore(id).subscribe((person_profile: person_profile[]) => {

      if(person_profile['status'] == 'success') {
        this.person_profileService.person_profiles = person_profile['data'];
        this.total = person_profile['data'].length;
        this.person_profileService.listOfData = person_profile['data'];
        this.person_profileService.listOfDisplayData = [...this.person_profileService.listOfData];
        this.loading = false;
      }
      this.message.create(person_profile['status'], person_profile['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
