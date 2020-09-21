import { Component, OnInit } from '@angular/core';
import {PersonService} from '../../../../services/person.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PeopleComponent} from '../../../shared/modal/people/people.component';
import {person} from '../../../../models/person';
import {ObservatoryService} from '../../../../services/observatory.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.sass']
})
export class PersonComponent implements OnInit {

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
    public personService: PersonService,
    public observatoryService: ObservatoryService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.personService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.personService.listOfData = data['data'];
        this.personService.listOfDisplayData = [...this.personService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
    this.observatory();
  }

  search(): void {
    const filterFunc = (item: { name: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.name.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.personService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.personService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.personService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.personService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Persona',
      nzContent: PeopleComponent,
      nzFooter: null
    });
  }

  observatory(){
    if(this.observatoryService.observatoryState == false){
      this.observatoryService.data().subscribe((data: any) => {
        this.observatoryService.observatories = data['data'];
        this.observatoryService.observatoryState = true;
      }, (error)=> { });
    }
  }

  add(){
    if(this.observatoryService.observatoryState){
      this.personService.people = [];
      this.personService.personState = true;
    }
    this.createComponentModal();
  }

  edit(id: any){
    this.personService.id = id;
    this.personService.personState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.personService.delete(id).subscribe((person: person[]) => {

      if(person['status'] == 'success') {
        this.personService.people = person['data'];
        this.total = person['data'].length;
        this.personService.listOfData = person['data'];
        this.personService.listOfDisplayData = [...this.personService.listOfData];
        this.loading = false;
      }
      this.message.create(person['status'], person['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.personService.restore(id).subscribe((person: person[]) => {

      if(person['status'] == 'success') {
        this.personService.people = person['data'];
        this.total = person['data'].length;
        this.personService.listOfData = person['data'];
        this.personService.listOfDisplayData = [...this.personService.listOfData];
        this.loading = false;
      }
      this.message.create(person['status'], person['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
