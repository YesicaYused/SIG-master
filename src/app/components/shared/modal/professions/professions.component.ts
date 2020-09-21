import { Component, OnInit } from '@angular/core';
import {ProfessionService} from '../../../../services/profession.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {profession} from '../../../../models/profession';

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.sass']
})
export class ProfessionsComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  profession: profession = {
    name: null,
    state: null,
  };

  constructor(
    public professionService: ProfessionService,
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
    if(this.professionService.professionState == false){
      this.professionService.query(this.professionService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.professionService.professions = data['data'];
          this.professionService.professionState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.professionService.change( this.professionService.professions ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.professionService.listOfDisplayData = data['data'];
        this.professionService.listOfData = data['data'];
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
    this.profession.name = this.professionService.professions['name'];
    this.professionService.save(this.profession).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.professionService.listOfDisplayData = data['data'];
        this.professionService.listOfData = data['data'];
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
