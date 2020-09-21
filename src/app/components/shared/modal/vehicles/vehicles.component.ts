import { Component, OnInit } from '@angular/core';
import {VehicleService} from '../../../../services/vehicle.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {vehicle} from '../../../../models/vehicle';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.sass']
})
export class VehiclesComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  vehicle: vehicle = {
    name: null,
    state: null,
  };

  constructor(
    public vehicleService: VehicleService,
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
    if(this.vehicleService.vehicleState == false){
      this.vehicleService.query(this.vehicleService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.vehicleService.vehicles = data['data'];
          this.vehicleService.vehicleState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.vehicleService.change( this.vehicleService.vehicles ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.vehicleService.listOfDisplayData = data['data'];
        this.vehicleService.listOfData = data['data'];
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
    this.vehicle.name = this.vehicleService.vehicles['name'];
    this.vehicleService.save(this.vehicle).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.vehicleService.listOfDisplayData = data['data'];
        this.vehicleService.listOfData = data['data'];
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
