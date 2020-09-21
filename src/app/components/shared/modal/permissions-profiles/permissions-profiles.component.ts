import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {permission_profile} from '../../../../models/permission_profile';
import {PermissionProfileService} from '../../../../services/permission-profile.service';

@Component({
  selector: 'app-permissions-profiles',
  templateUrl: './permissions-profiles.component.html',
  styleUrls: ['./permissions-profiles.component.sass']
})
export class PermissionsProfilesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  permission_profile: permission_profile = {
    name: null,
    state: null,
  };

  constructor(
    public permission_profileService: PermissionProfileService,
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
    if(this.permission_profileService.permission_profileState == false){
      this.permission_profileService.query(this.permission_profileService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.permission_profileService.permission_profiles = data['data'];
          this.permission_profileService.permission_profileState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.permission_profileService.change( this.permission_profileService.permission_profiles ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.permission_profileService.listOfDisplayData = data['data'];
        this.permission_profileService.listOfData = data['data'];
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
    this.permission_profile.name = this.permission_profileService.permission_profiles['name'];
    this.permission_profileService.save(this.permission_profile).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.permission_profileService.listOfDisplayData = data['data'];
        this.permission_profileService.listOfData = data['data'];
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
