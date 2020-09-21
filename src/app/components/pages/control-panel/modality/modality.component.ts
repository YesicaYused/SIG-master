import { Component, OnInit } from '@angular/core';
import {ModalityService} from '../../../../services/modality.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ModalitiesComponent} from '../../../shared/modal/modalities/modalities.component';
import {modality} from '../../../../models/modality';

@Component({
  selector: 'app-modality',
  templateUrl: './modality.component.html',
  styleUrls: ['./modality.component.sass']
})
export class ModalityComponent implements OnInit {

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
    public modalityService: ModalityService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.modalityService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.modalityService.listOfData = data['data'];
        this.modalityService.listOfDisplayData = [...this.modalityService.listOfData];
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
    const data = this.modalityService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.modalityService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.modalityService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.modalityService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Modalidad',
      nzContent: ModalitiesComponent,
      nzFooter: null
    });
  }

  add(){
    this.modalityService.modalities = [];
    this.modalityService.modalityState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.modalityService.id = id;
    this.modalityService.modalityState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.modalityService.delete(id).subscribe((modality: modality[]) => {

      if(modality['status'] == 'success') {
        this.modalityService.modalities = modality['data'];
        this.total = modality['data'].length;
        this.modalityService.listOfData = modality['data'];
        this.modalityService.listOfDisplayData = [...this.modalityService.listOfData];
        this.loading = false;
      }
      this.message.create(modality['status'], modality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.modalityService.restore(id).subscribe((modality: modality[]) => {

      if(modality['status'] == 'success') {
        this.modalityService.modalities = modality['data'];
        this.total = modality['data'].length;
        this.modalityService.listOfData = modality['data'];
        this.modalityService.listOfDisplayData = [...this.modalityService.listOfData];
        this.loading = false;
      }
      this.message.create(modality['status'], modality['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
