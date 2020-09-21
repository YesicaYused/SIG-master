import { Component, OnInit } from '@angular/core';
import {PermissionService} from '../../../../services/permission.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {permission} from '../../../../models/permission';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.sass']
})
export class PermissionsComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  permission: permission = {
    name: null,
    state: null,
  };

  constructor(
    public permissionService: PermissionService,
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
    if(this.permissionService.permissionState == false){
      this.permissionService.query(this.permissionService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.permissionService.permissions = data['data'];
          this.permissionService.permissionState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.permissionService.change( this.permissionService.permissions ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.permissionService.listOfDisplayData = data['data'];
        this.permissionService.listOfData = data['data'];
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
    this.permission.name = this.permissionService.permissions['name'];
    this.permissionService.save(this.permission).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.permissionService.listOfDisplayData = data['data'];
        this.permissionService.listOfData = data['data'];
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
