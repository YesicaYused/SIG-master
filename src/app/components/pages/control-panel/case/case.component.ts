import { Component, OnInit } from '@angular/core';
import {CaseService} from '../../../../services/case.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CasesComponent} from '../../../shared/modal/cases/cases.component';
import {legal_case} from '../../../../models/case';
import {MunicipalityService} from '../../../../services/municipality.service';
import {NationalityService} from '../../../../services/nationality.service';
import {NeighborhoodService} from '../../../../services/neighborhood.service';
import {ProfessionService} from '../../../../services/profession.service';
import {ScholarshipService} from '../../../../services/scholarship.service';
import {SiteClassService} from '../../../../services/site-class.service';
import {VariableService} from '../../../../services/variable.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {WeaponTypeService} from '../../../../services/weapon-type.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.sass']
})
export class CaseComponent implements OnInit {

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
    public caseService: CaseService,
    private modalService: NzModalService,
    public municipalityService: MunicipalityService,
    public nationalityService: NationalityService,
    public neighborhoodService: NeighborhoodService,
    public professionService: ProfessionService,
    public scholarshipService: ScholarshipService,
    public siteClassService: SiteClassService,
    public variableService: VariableService,
    public vehicleService: VehicleService,
    public weaponTypeService: WeaponTypeService,
    public message: NzMessageService
  ) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.caseService
      .all()
      .subscribe((data: any) => {
        this.loading = false;
        this.total = data.length;
        this.caseService.listOfData = data;
        this.caseService.listOfDisplayData = [...this.caseService.listOfData];
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  ngOnInit(): void {
    this.searchData();
    this.municipality();
    this.nationality();
    this.neighborhood();
    this.profession();
    this.scholarship();
    this.siteClass();
    this.variable();
    this.vehicle();
    this.weaponType();
  }

  search(): void {
    const filterFunc = (item: { victim: string }) => {
      return (
        (this.listOfSearchDocument.length
          ? this.listOfSearchDocument.some(address => item.victim.indexOf(address) !== -1)
          : true) && item.victim.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.caseService.listOfData.filter((item: { victim: string }) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.caseService.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }else{
      this.caseService.listOfDisplayData = data;
    }
  }

  create(){

    this.loading = true;
    this.caseService.data().subscribe((data: any) => {

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
      nzTitle: 'Gestionar Caso',
      nzContent: CasesComponent,
      nzFooter: null,
      nzWidth: '80%'
    });
  }

  add(){
    this.caseService.cases = [];
    this.caseService.caseState = true;
    this.createComponentModal();
  }

  edit(id: any){
    this.caseService.id = id;
    this.caseService.caseState = false;
    this.createComponentModal();
  }

  updateON(id: any){
    this.loading = true;
    this.caseService.delete(id).subscribe((legalCase: legal_case[]) => {

      if(legalCase['status'] == 'success') {
        this.caseService.cases = legalCase['data'];
        this.total = legalCase['data'].length;
        this.caseService.listOfData = legalCase['data'];
        this.caseService.listOfDisplayData = [...this.caseService.listOfData];
        this.loading = false;
      }
      this.message.create(legalCase['status'], legalCase['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  updateOFF(id: any){
    this.loading = true;
    this.caseService.restore(id).subscribe((legalCase: legal_case[]) => {

      if(legalCase['status'] == 'success') {
        this.caseService.cases = legalCase['data'];
        this.total = legalCase['data'].length;
        this.caseService.listOfData = legalCase['data'];
        this.caseService.listOfDisplayData = [...this.caseService.listOfData];
        this.loading = false;
      }
      this.message.create(legalCase['status'], legalCase['message']);
    }, (error)=> {

      this.assign_message = error.message;
      this.message.create('error', this.assign_message);
      this.loading = false;
    });
  }

  municipality(){
    if(this.municipalityService.municipalityState == false){
      this.municipalityService.data().subscribe((data: any) => {
        this.municipalityService.municipalities = data['data'];
        this.municipalityService.municipalityState = true;
      }, (error)=> { });
    }
  }
  nationality(){
    if(this.nationalityService.nationalityState == false){
      this.nationalityService.data().subscribe((data: any) => {
        this.nationalityService.nationalities = data['data'];
        this.nationalityService.nationalityState = true;
      }, (error)=> { });
    }
  }
  neighborhood(){
    if(this.neighborhoodService.neighborhoodState == false){
      this.neighborhoodService.data().subscribe((data: any) => {
        this.neighborhoodService.neighborhoods = data['data'];
        this.neighborhoodService.neighborhoodState = true;
      }, (error)=> { });
    }
  }
  profession(){
    if(this.professionService.professionState == false){
      this.professionService.data().subscribe((data: any) => {
        this.professionService.professions = data;
        this.professionService.professionState = true;
      }, (error)=> { });
    }
  }
  scholarship(){
    if(this.scholarshipService.scholarshipState == false){
      this.scholarshipService.data().subscribe((data: any) => {
        this.scholarshipService.scholarships = data['data'];
        this.scholarshipService.scholarshipState = true;
      }, (error)=> { });
    }
  }
  siteClass(){
    if(this.siteClassService.site_classState == false){
      this.siteClassService.data().subscribe((data: any) => {
        this.siteClassService.sites_class = data['data'];
        this.siteClassService.site_classState = true;
      }, (error)=> { });
    }
  }
  variable(){
    if(this.variableService.variableState == false){
      this.variableService.data().subscribe((data: any) => {
        this.variableService.variables = data['data'];
        this.variableService.variableState = true;
      }, (error)=> { });
    }
  }
  vehicle(){
    if(this.vehicleService.vehicleState == false){
      this.vehicleService.data().subscribe((data: any) => {
        this.vehicleService.vehicles = data['data'];
        this.vehicleService.vehicleState = true;
      }, (error)=> { });
    }
  }
  weaponType(){
    if(this.weaponTypeService.weapon_typeState == false){
      this.weaponTypeService.data().subscribe((data: any) => {
        this.weaponTypeService.weapon_types = data['data'];
        this.weaponTypeService.weapon_typeState = true;
      }, (error)=> { });
    }
  }

}
