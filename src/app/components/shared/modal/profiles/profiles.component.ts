import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../../services/profile.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {profile} from '../../../../models/profile';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.sass']
})
export class ProfilesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  profile: profile = {
    name: null,
    state: null,
  };

  constructor(
    public profileService: ProfileService,
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
    if(this.profileService.profileState == false){
      this.profileService.query(this.profileService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.profileService.profiles = data['data'];
          this.profileService.profileState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.profileService.change( this.profileService.profiles ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.profileService.listOfDisplayData = data['data'];
        this.profileService.listOfData = data['data'];
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
    this.profile.name = this.profileService.profiles['name'];
    this.profileService.save(this.profile).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.profileService.listOfDisplayData = data['data'];
        this.profileService.listOfData = data['data'];
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
