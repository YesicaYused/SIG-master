import { Component, OnInit } from '@angular/core';
import {NeighborhoodService} from '../../../../services/neighborhood.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {neighborhood} from '../../../../models/neighborhood';

@Component({
  selector: 'app-neighborhoods',
  templateUrl: './neighborhoods.component.html',
  styleUrls: ['./neighborhoods.component.sass']
})
export class NeighborhoodsComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  neighborhood: neighborhood = {
    name: null,
    state: null,
  };

  constructor(
    public neighborhoodService: NeighborhoodService,
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
    if(this.neighborhoodService.neighborhoodState == false){
      this.neighborhoodService.query(this.neighborhoodService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.neighborhoodService.neighborhoods = data['data'];
          this.neighborhoodService.neighborhoodState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.neighborhoodService.change( this.neighborhoodService.neighborhoods ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.neighborhoodService.listOfDisplayData = data['data'];
        this.neighborhoodService.listOfData = data['data'];
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
    this.neighborhood.name = this.neighborhoodService.neighborhoods['name'];
    this.neighborhoodService.save(this.neighborhood).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.neighborhoodService.listOfDisplayData = data['data'];
        this.neighborhoodService.listOfData = data['data'];
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
