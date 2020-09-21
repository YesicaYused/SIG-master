import { Component, OnInit } from '@angular/core';
import {ModalityService} from '../../../../services/modality.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {modality} from '../../../../models/modality';

@Component({
  selector: 'app-modalities',
  templateUrl: './modalities.component.html',
  styleUrls: ['./modalities.component.sass']
})
export class ModalitiesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  modality: modality = {
    name: null,
    state: null,
  };

  constructor(
    public modalityService: ModalityService,
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
    if(this.modalityService.modalityState == false){
      this.modalityService.query(this.modalityService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.modalityService.modalities = data['data'];
          this.modalityService.modalityState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.modalityService.change( this.modalityService.modalities ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.modalityService.listOfDisplayData = data['data'];
        this.modalityService.listOfData = data['data'];
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
    this.modality.name = this.modalityService.modalities['name'];
    this.modalityService.save(this.modality).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.modalityService.listOfDisplayData = data['data'];
        this.modalityService.listOfData = data['data'];
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
