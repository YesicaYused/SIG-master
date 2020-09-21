import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {site_class} from '../../../../models/site_class';
import {SiteClassService} from '../../../../services/site-class.service';

@Component({
  selector: 'app-sites-class',
  templateUrl: './sites-class.component.html',
  styleUrls: ['./sites-class.component.sass']
})
export class SitesClassComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  site_class: site_class = {
    name: null,
    state: null,
  };

  constructor(
    public site_classService: SiteClassService,
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
    if(this.site_classService.site_classState == false){
      this.site_classService.query(this.site_classService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.site_classService.sites_class = data['data'];
          this.site_classService.site_classState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.site_classService.change( this.site_classService.sites_class ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.site_classService.listOfDisplayData = data['data'];
        this.site_classService.listOfData = data['data'];
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
    this.site_class.name = this.site_classService.sites_class['name'];
    this.site_classService.save(this.site_class).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.site_classService.listOfDisplayData = data['data'];
        this.site_classService.listOfData = data['data'];
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
