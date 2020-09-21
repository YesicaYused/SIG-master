import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {person_profile} from '../../../../models/person_profile';
import {PersonProfileService} from '../../../../services/person-profile.service';
import {PersonService} from '../../../../services/person.service';

@Component({
  selector: 'app-persons-profiles',
  templateUrl: './person-profiles.component.html',
  styleUrls: ['./person-profiles.component.sass']
})
export class PersonProfilesComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfAllDataProfile: any[] = [];
  mapOfCheckedId = {};
  loading: boolean = false;
  loadingProfile: boolean = false;
  person_id: string;

  messageAccion: string = null;

  constructor(
    public person_profileService: PersonProfileService,
    private message: NzMessageService,
    public personService: PersonService,
  ) { }

  ngOnInit(): void { }

  currentPageDataChange($event: Array<{ id: number, name: string; }>): void {

    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  checkAll(value: boolean): void {

    this.listOfDisplayData.forEach(item => this.mapOfCheckedId[ item.id ] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.filter(item => !item.disabled).every(item => this.mapOfCheckedId[ item.id ]);
    this.isIndeterminate = this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[ item.id ]) && !this.isAllDisplayDataChecked;
  }

  profiles(id: any, event){

    this.person_id = id;
    this.loadingProfile = true;
    let classAll = document.getElementsByClassName('name');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('checked');
    }
    event.target['parentElement'].classList.add('checked');
    this.person_profileService.queryProfile(id).subscribe((data: any) => {
      if(data['status'] == 'success') {
        this.listOfAllDataProfile = data['profile'];
        this.loadingProfile = false;
      }
      this.messageAccion = data['message'];
      this.createMessage(data['status']);
    }, (error) => {

      this.loadingProfile = false;
    });
  }

  createMessage(type: string): void {
    this.message.create(type, this.messageAccion);
  }

  add(profile_id) {

    this.loadingProfile = true;
    this.person_profileService.save(profile_id, this.person_id).subscribe((data: any) => {
      if(data['status'] == 'success') {

        this.listOfAllDataProfile.forEach(item => this.mapOfCheckedId[ item.id ] = false);
        this.refreshStatus();
        this.listOfAllDataProfile = data['profile'];
        this.person_profileService.listOfData = data.people;
        this.person_profileService.listOfDisplayData = [...this.person_profileService.listOfData];
        this.loadingProfile = false;
      }

      this.messageAccion = data['message'];
      this.createMessage(data['status']);
    }, (error) => {

      this.loadingProfile = false;
      this.listOfAllDataProfile.forEach(item => this.mapOfCheckedId[ item.id ] = false);
      this.refreshStatus();
    });
  }
}
