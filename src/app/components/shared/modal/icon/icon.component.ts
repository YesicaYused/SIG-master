import { Component, OnInit } from '@angular/core';
import {IconService} from '../../../../services/icon.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {icon} from '../../../../models/icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.sass']
})
export class IconComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  iconTheme: null;
  iconType: null;

  icon: icon = {
    name: null,
    state: null,
  };

  constructor(
    public iconService: IconService,
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
    if(this.iconService.iconState == false){
      this.iconService.query(this.iconService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.iconService.icons = data['data'];
          this.iconService.iconState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.iconService.change( this.iconService.icons ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.iconService.listOfDisplayData = data['data'];
        this.iconService.listOfData = data['data'];
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
    this.icon.name = this.iconService.icons['name'];
    this.iconService.save(this.icon).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.iconService.listOfDisplayData = data['data'];
        this.iconService.listOfData = data['data'];
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
