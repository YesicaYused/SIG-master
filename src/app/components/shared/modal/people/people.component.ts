import { Component, OnInit } from '@angular/core';
import {PersonService} from '../../../../services/person.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {person} from '../../../../models/person';
import {ObservatoryService} from '../../../../services/observatory.service';

@Component({
  selector: 'app-persons',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.sass']
})
export class PeopleComponent implements OnInit {

  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];
  selectedValue = null;

  person: person = {
    name: null,
    code: null,
    last_name: null,
    password: null,
    state: null,
  };

  constructor(
    public personService: PersonService,
    public observatoryService: ObservatoryService,
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
    if(this.personService.personState == false){
      this.personService.query(this.personService.id).subscribe((data: any) => {

        if(data['status'] == 'success') {
          this.personService.people = data['data'];
          this.selectedValue = data['data']['observatory']['name'];
          this.personService.personState = true;
        }
        this.messageAccion = data['message'];
        this.createMessage(data['status']);
      }, (error)=> {

      });
    }
  }

  change() {

    this.isConfirmLoading = true;
    this.personService.people['observatory_name'] = this.selectedValue;
    this.personService.change( this.personService.people ).subscribe((data) => {

      if(data['status'] == 'success') {
        this.personService.listOfDisplayData = data['data'];
        this.personService.listOfData = data['data'];
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

  passwordGenerator() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  add(){

    this.isConfirmLoading = true;
    this.person.name = this.personService.people['name'];
    this.person.last_name = this.personService.people['lastName'];
    this.person['observatory_name'] = this.selectedValue;
    this.person.code = this.personService.people['code'];
    this.person.password = this.passwordGenerator();
    this.personService.save(this.person).subscribe((data)=>{

      this.isConfirmLoading = false;
      if(data['status'] == 'success') {
        this.isVisible = false;
        this.personService.listOfDisplayData = data['data'];
        this.personService.listOfData = data['data'];
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
