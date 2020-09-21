import { Component, OnInit } from '@angular/core';
import {ScholarshipService} from '../../../../services/scholarship.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {scholarship} from '../../../../models/scholarship';

@Component({
  selector: 'app-scholarships',
  templateUrl: './scholarships.component.html',
  styleUrls: ['./scholarships.component.sass']
})
export class ScholarshipsComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  scholarship: scholarship = {
    name: null,
    state: null,
  };

  constructor(
    public scholarshipService: ScholarshipService,
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
    if(this.scholarshipService.scholarshipState == false){
      this.scholarshipService.query(this.scholarshipService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.scholarshipService.scholarships = data['data'];
          this.scholarshipService.scholarshipState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.scholarshipService.change( this.scholarshipService.scholarships ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.scholarshipService.listOfDisplayData = data['data'];
        this.scholarshipService.listOfData = data['data'];
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
    this.scholarship.name = this.scholarshipService.scholarships['name'];
    this.scholarshipService.save(this.scholarship).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.scholarshipService.listOfDisplayData = data['data'];
        this.scholarshipService.listOfData = data['data'];
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
