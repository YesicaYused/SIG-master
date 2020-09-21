import { Component, OnInit } from '@angular/core';
import {ObservatoryService} from '../../../../services/observatory.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {observatory} from '../../../../models/observatory';

@Component({
  selector: 'app-observatories',
  templateUrl: './observatories.component.html',
  styleUrls: ['./observatories.component.sass']
})
export class ObservatoriesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  observatory: observatory = {
    name: null,
    image: null,
    description: null,
    state: null,
  };

  constructor(
    public observatoryService: ObservatoryService,
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
    if(this.observatoryService.observatoryState == false){
      this.observatoryService.query(this.observatoryService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.observatoryService.observatories = data['data'];
          this.observatoryService.observatoryState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.observatoryService.change( this.observatoryService.observatories ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.observatoryService.listOfDisplayData = data['data'];
        this.observatoryService.listOfData = data['data'];
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
    this.observatory.name = this.observatoryService.observatories['name'];
    this.observatoryService.save(this.observatory).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.observatoryService.listOfDisplayData = data['data'];
        this.observatoryService.listOfData = data['data'];
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
