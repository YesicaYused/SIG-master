import { Component, OnInit } from '@angular/core';
import {VariableService} from '../../../../services/variable.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {variable} from '../../../../models/variable';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.sass']
})
export class VariablesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  variable: variable = {
    name: null,
    state: null,
  };

  constructor(
    public variableService: VariableService,
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
    if(this.variableService.variableState == false){
      this.variableService.query(this.variableService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.variableService.variables = data['data'];
          this.variableService.variableState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.variableService.change( this.variableService.variables ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.variableService.listOfDisplayData = data['data'];
        this.variableService.listOfData = data['data'];
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
    this.variable.name = this.variableService.variables['name'];
    this.variableService.save(this.variable).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.variableService.listOfDisplayData = data['data'];
        this.variableService.listOfData = data['data'];
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
