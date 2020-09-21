import { Component, OnInit } from '@angular/core';
import {DepartmentService} from '../../../../services/department.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {department} from '../../../../models/department';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.sass']
})
export class DepartmentsComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  department: department = {
    name: null,
    state: null,
  };

  constructor(
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
    if(this.departmentService.departmentState == false){
      this.departmentService.query(this.departmentService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.departmentService.departments = data['data'];
          this.departmentService.departmentState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.departmentService.change( this.departmentService.departments ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.departmentService.listOfDisplayData = data['data'];
        this.departmentService.listOfData = data['data'];
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
    this.department.name = this.departmentService.departments['name'];
    this.departmentService.save(this.department).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.departmentService.listOfDisplayData = data['data'];
        this.departmentService.listOfData = data['data'];
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
