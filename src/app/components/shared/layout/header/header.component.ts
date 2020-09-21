import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { SettingService } from '../../../../services/setting.service';
import { environment } from '../../../../../environments/environment';
import {ModuleProfileService} from '../../../../services/module-profile.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  url = environment.URL;
  public API:string;
  messages: string;

  constructor(
    public authService: AuthServices,
    private router: Router,
    public SettingService: SettingService,
    public moduleProfileService: ModuleProfileService,
    private message: NzMessageService
  ) { }

  ngOnInit() { }

  panel(profile, code){

    this.authService.stateProfile = false;
    localStorage.setItem('assigned', JSON.stringify(profile));
    this.moduleProfileService.assignedModule(profile, code).subscribe((Data)=>{

      let data = Data['modules'];
      if(Data['status'] == 'success'){

        this.moduleProfileService.moduleProfile = data;
        this.authService.stateProfile = true;
      }else{

        this.messages = Data['message'];
        this.createMessage(Data['status'], this.messages);
      }
    }, (error)=> {

      this.messages = error.message;
      this.createMessage('error', this.messages);
    });
  }

  logout() {

    localStorage.removeItem('Data');
    localStorage.removeItem('Token');
    localStorage.removeItem('assigned');
    this.authService.state = false;
    this.authService.TOKEN = null;
    this.authService.people = {
      name: null,
      last_name: null,
      password: null,
      code: null,
      state: null,
    };
    this.authService.profile = [];
    this.router.navigate(['/']);
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
