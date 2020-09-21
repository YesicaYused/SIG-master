import { Component, OnInit } from '@angular/core';
import {NationalityService} from '../../../../services/nationality.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {nationality} from '../../../../models/nationality';

@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.component.html',
  styleUrls: ['./nationalities.component.sass']
})
export class NationalitiesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  nationality: nationality = {
    name: null,
    state: null,
  };

  constructor(
    public nationalityService: NationalityService,
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
    if(this.nationalityService.nationalityState == false){
      this.nationalityService.query(this.nationalityService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.nationalityService.nationalities = data['data'];
          this.nationalityService.nationalityState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.nationalityService.change( this.nationalityService.nationalities ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.nationalityService.listOfDisplayData = data['data'];
        this.nationalityService.listOfData = data['data'];
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
    this.nationality.name = this.nationalityService.nationalities['name'];
    this.nationalityService.save(this.nationality).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.nationalityService.listOfDisplayData = data['data'];
        this.nationalityService.listOfData = data['data'];
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
