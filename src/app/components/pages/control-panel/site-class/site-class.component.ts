import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SiteClassService} from '../../../../services/site-class.service';
import {SitesClassComponent} from '../../../shared/modal/sites-class/sites-class.component';
import {site_class} from '../../../../models/site_class';

@Component({
  selector: 'app-site-class',
  templateUrl: './site-class.component.html',
  styleUrls: ['./site-class.component.sass']
})
export class SiteClassComponent implements OnInit {

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
    public site_classService: SiteClassService,
    private modalService: NzModalService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.site_classService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.data.length;
        this.site_classService.listOfData = data['data'];
        this.site_classService.listOfDisplayData = [...this.site_classService.listOfData];
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
    const data = this.site_classService.listOfData.filter((item: { name: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.site_classService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.site_classService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.site_classService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Clase de Sitio',
      nzContent: SitesClassComponent,
      nzFooter: null
    });
  }

  add(){
    this.site_classService.sites_class = [];
    this.site_classService.site_classState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.site_classService.id = id;
    this.site_classService.site_classState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.site_classService.delete(id).subscribe((site_class: site_class[]) => {

      if(site_class['status'] == 'success') {
        this.site_classService.sites_class = site_class['data'];
        this.total = site_class['data'].length;
        this.site_classService.listOfData = site_class['data'];
        this.site_classService.listOfDisplayData = [...this.site_classService.listOfData];
        this.loading = false;
      }
      this.message.create(site_class['status'], site_class['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.site_classService.restore(id).subscribe((site_class: site_class[]) => {

      if(site_class['status'] == 'success') {
        this.site_classService.sites_class = site_class['data'];
        this.total = site_class['data'].length;
        this.site_classService.listOfData = site_class['data'];
        this.site_classService.listOfDisplayData = [...this.site_classService.listOfData];
        this.loading = false;
      }
      this.message.create(site_class['status'], site_class['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

}
