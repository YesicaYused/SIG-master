import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {weapon_type} from '../../../../models/weapon_type';
import {WeaponTypeService} from '../../../../services/weapon-type.service';

@Component({
  selector: 'app-weapon-types',
  templateUrl: './weapon-types.component.html',
  styleUrls: ['./weapon-types.component.sass']
})
export class WeaponTypesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  weapon_type: weapon_type = {
    name: null,
    state: null,
  };

  constructor(
    public weapon_typeService: WeaponTypeService,
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
    if(this.weapon_typeService.weapon_typeState == false){
      this.weapon_typeService.query(this.weapon_typeService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.weapon_typeService.weapon_types = data['data'];
          this.weapon_typeService.weapon_typeState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.weapon_typeService.change( this.weapon_typeService.weapon_types ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.weapon_typeService.listOfDisplayData = data['data'];
        this.weapon_typeService.listOfData = data['data'];
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
    this.weapon_type.name = this.weapon_typeService.weapon_types['name'];
    this.weapon_typeService.save(this.weapon_type).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.weapon_typeService.listOfDisplayData = data['data'];
        this.weapon_typeService.listOfData = data['data'];
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
