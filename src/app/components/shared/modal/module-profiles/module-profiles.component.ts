import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {module_profile} from '../../../../models/module_profile';
import {ModuleProfileService} from '../../../../services/module-profile.service';
import {PersonProfileService} from '../../../../services/person-profile.service';
import {PersonService} from '../../../../services/person.service';
import {ModuleService} from '../../../../services/module.service';

@Component({
  selector: 'app-module-profiles',
  templateUrl: './module-profiles.component.html',
  styleUrls: ['./module-profiles.component.sass']
})
export class ModuleProfilesComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfAllDataProfile: any[] = [];
  mapOfCheckedId = {};
  loading: boolean = false;
  loadingProfile: boolean = false;
  module_id: string;

  messageAccion: string = null;

  constructor(
    public module_profileService: ModuleProfileService,
    private message: NzMessageService,
    public moduleService: ModuleService,
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

    this.module_id = id;
    this.loadingProfile = true;
    let classAll = document.getElementsByClassName('name');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('checked');
    }
    event.target['parentElement'].classList.add('checked');
    this.module_profileService.queryProfile(id).subscribe((data: any) => {
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
    this.module_profileService.save(profile_id, this.module_id).subscribe((data: any) => {
      if(data['status'] == 'success') {

        this.listOfAllDataProfile.forEach(item => this.mapOfCheckedId[ item.id ] = false);
        this.refreshStatus();
        this.listOfAllDataProfile = data['profile'];
        this.module_profileService.listOfData = data.people;
        this.module_profileService.listOfDisplayData = [...this.module_profileService.listOfData];
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
