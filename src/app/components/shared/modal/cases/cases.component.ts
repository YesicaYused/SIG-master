import { Component, OnInit } from '@angular/core';
import {CaseService} from '../../../../services/case.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
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
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.sass']
})
export class CasesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  selectedValueMunicipality = null;
  selectedValueNationality = null;
  selectedValueNeighborhood = null;
  selectedValueProfession = null;
  selectedValueScholarship = null;
  selectedValueSiteClass = null;
  selectedValueVariable = null;
  selectedValueVehicleAggressor = null;
  selectedValueVehicleVictim = null;
  selectedValueWeaponType = null;

  case: legal_case = {
    victim: null,
    aggressor: null,
    date: null,
    time: null,
    age: null,
    direction: null,
    latitude: null,
    longitude: null,
    civilStatus: null,
    gender: null,
    font: null,
    temporaryBehavior: null,
    spatialBehavior: null,
    state: null,
  };

  newTime;

  constructor(
    public caseService: CaseService,
    private message: NzMessageService,
    private modal: NzModalRef,
    public municipalityService: MunicipalityService,
    public nationalityService: NationalityService,
    public neighborhoodService: NeighborhoodService,
    public professionService: ProfessionService,
    public scholarshipService: ScholarshipService,
    public siteClassService: SiteClassService,
    public variableService: VariableService,
    public vehicleService: VehicleService,
    public weaponTypeService: WeaponTypeService,
  ) {

  }

  destroyModal(): void {
    this.modal.destroy();
  }

  handleCancel(): void {
    this.messageAccion = "Acción cancelada";
    this.destroyModal();
    this.createMessage('warning');
  }

  createMessage(type: string): void {
    this.message.create(type, this.messageAccion);
  }

  ngOnInit() {
    if(this.caseService.caseState == false){
      this.caseService.query(this.caseService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.caseService.cases = data['data'];
          this.selectedValueMunicipality = data['data']['municipality']['name'];
          this.selectedValueNationality = data['data']['nationality']['name'];
          this.selectedValueNeighborhood = data['data']['neighborhood']['name'];
          this.selectedValueProfession = data['data']['profession']['name'];
          this.selectedValueScholarship = data['data']['scholarship']['name'];
          this.selectedValueSiteClass = data['data']['siteClass']['name'];
          this.selectedValueVariable = data['data']['variable']['name'];
          this.selectedValueVehicleAggressor = data['data']['vehicleAggressor']['name'];
          this.selectedValueVehicleVictim = data['data']['vehicleVictim']['name'];
          this.selectedValueWeaponType = data['data']['weaponType']['name'];
          this.caseService.caseState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.caseService.cases['municipality_name'] = this.selectedValueMunicipality;
    this.caseService.cases['nationality_name'] = this.selectedValueNationality;
    this.caseService.cases['neighborhood_name'] = this.selectedValueNeighborhood;
    this.caseService.cases['profession_name'] = this.selectedValueProfession;
    this.caseService.cases['scholarship_name'] = this.selectedValueScholarship;
    this.caseService.cases['siteClass_name'] = this.selectedValueSiteClass;
    this.caseService.cases['variable_name'] = this.selectedValueVariable;
    this.caseService.cases['vehicleAggressor_name'] = this.selectedValueVehicleAggressor;
    this.caseService.cases['vehicleVictim_name'] = this.selectedValueVehicleVictim;
    this.caseService.cases['weaponType_name'] = this.selectedValueWeaponType;
    if(this.newTime && this.caseService.cases['time'] != this.newTime){
      this.caseService.cases['time'] = this.newTime;}

    this.caseService.change( this.caseService.cases ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.caseService.listOfDisplayData = data['data'];
        this.caseService.listOfData = data['data'];
        this.isVisible = false;
        this.destroyModal();
      }
      this.isConfirmLoading = false;
      this.messageAccion = data['message'];
      this.createMessage(data['status']);
    }, (error) => {

      this.message = error.Message;
      this.isConfirmLoading = false;
      this.messagesRegistry = error.error.errors;
    });
  }

  add(){

    this.isConfirmLoading = true;
    this.case['municipality_name'] = this.selectedValueMunicipality;
    this.case['nationality_name'] = this.selectedValueNationality;
    this.case['neighborhood_name'] = this.selectedValueNeighborhood;
    this.case['profession_name'] = this.selectedValueProfession;
    this.case['scholarship_name'] = this.selectedValueScholarship;
    this.case['siteClass_name'] = this.selectedValueSiteClass;
    this.case['variable_name'] = this.selectedValueVariable;
    this.case['vehicleAggressor_name'] = this.selectedValueVehicleAggressor;
    this.case['vehicleVictim_name'] = this.selectedValueVehicleVictim;
    this.case['weaponType_name'] = this.selectedValueWeaponType;
    this.case.victim = this.caseService.cases['victim'];
    this.case.aggressor = this.caseService.cases['aggressor'];
    this.case.date = this.caseService.cases['date'];
    this.case.time = this.newTime;
    this.case.age = this.caseService.cases['age'];
    this.case.direction = this.caseService.cases['direction'];
    this.case.latitude = this.caseService.cases['latitude'];
    this.case.longitude = this.caseService.cases['longitude'];
    this.case.civilStatus = this.caseService.cases['civilStatus'];
    this.case.gender = this.caseService.cases['gender'];
    this.case.font = this.caseService.cases['font'];
    this.case.temporaryBehavior = this.caseService.cases['temporaryBehavior'];
    this.case.spatialBehavior = this.caseService.cases['spatialBehavior'];

    this.caseService.save(this.case).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.caseService.listOfDisplayData = data['data'];
        this.caseService.listOfData = data['data'];
        this.destroyModal();
      }
      this.messageAccion = data['message'];
      this.createMessage(data['status']);
    }, (error)=> {

      this.message = error.Message;
      this.messagesRegistry = error.error.errors;
      this.isVisible = false;
      this.isConfirmLoading = false;
    });
  }

}
