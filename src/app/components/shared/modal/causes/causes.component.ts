import { Component, OnInit } from '@angular/core';
import {CauseService} from '../../../../services/cause.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {cause} from '../../../../models/cause';

@Component({
  selector: 'app-causes',
  templateUrl: './causes.component.html',
  styleUrls: ['./causes.component.sass']
})
export class CausesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  cause: cause = {
    name: null,
    state: null,
  };

  constructor(
    public causeService: CauseService,
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
    if(this.causeService.causeState == false){
      this.causeService.query(this.causeService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.causeService.causes = data['data'];
          this.causeService.causeState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.causeService.change( this.causeService.causes ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.causeService.listOfDisplayData = data['data'];
        this.causeService.listOfData = data['data'];
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
    this.cause.name = this.causeService.causes['name'];
    this.causeService.save(this.cause).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.causeService.listOfDisplayData = data['data'];
        this.causeService.listOfData = data['data'];
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
