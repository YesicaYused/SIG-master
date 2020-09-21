import { Component, OnInit } from '@angular/core';
import {module} from '../../../../models/module';
import {ModuleService} from '../../../../services/module.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.sass']
})
export class ModulesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  module: module = {
    name: null,
    route: null,
    state: null,
  };

  constructor(
    public moduleService: ModuleService,
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
    if(this.moduleService.moduleState == false){
      this.moduleService.query(this.moduleService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.moduleService.modules = data['data'];
          this.moduleService.moduleState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.moduleService.change( this.moduleService.modules ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.moduleService.listOfDisplayData = data['data'];
        this.moduleService.listOfData = data['data'];
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
    this.module.name = this.moduleService.modules['name'];
    this.module.route = this.moduleService.modules['route'];
    this.moduleService.save(this.module).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.moduleService.listOfDisplayData = data['data'];
        this.moduleService.listOfData = data['data'];
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
