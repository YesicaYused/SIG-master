import { Component, OnInit } from '@angular/core';
import {MunicipalityService} from '../../../../services/municipality.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {municipality} from '../../../../models/municipality';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-municipalities',
  templateUrl: './municipalities.component.html',
  styleUrls: ['./municipalities.component.sass']
})
export class MunicipalitiesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];
  selectedValue = null;

  municipality: municipality = {
    name: null,
    state: null,
  };

  constructor(
    public municipalityService: MunicipalityService,
    public departmentService: DepartmentService,
    private message: NzMessageService,
    private modal: NzModalRef
  ) { }

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
    if(this.municipalityService.municipalityState == false){
      this.municipalityService.query(this.municipalityService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.municipalityService.municipalities = data['data'];
          this.selectedValue = data['data']['department']['name'];
          this.municipalityService.municipalityState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.municipalityService.municipalities['department_name'] = this.selectedValue;
    this.municipalityService.change( this.municipalityService.municipalities ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.municipalityService.listOfDisplayData = data['data'];
        this.municipalityService.listOfData = data['data'];
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
    this.municipality.name = this.municipalityService.municipalities['name'];
    this.municipality['department_name'] = this.selectedValue;
    this.municipalityService.save(this.municipality).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.municipalityService.listOfDisplayData = data['data'];
        this.municipalityService.listOfData = data['data'];
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
