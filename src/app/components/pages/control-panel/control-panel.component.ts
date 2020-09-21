import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthServices } from '../../../services/auth.service';
import { ModuleProfileService } from '../../../services/module-profile.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.sass']
})
export class ControlPanelComponent implements OnInit {

  url = environment.URL;
  messages: string;

  constructor(
    public authService: AuthServices,
    public moduleProfileService: ModuleProfileService,
    private message: NzMessageService,
    // private router: Router,
    ) { }
  ngOnInit() {

    // this.authService.current_url = this.router.url;
    this.authService.stateProfile = false;
    let profile = JSON.parse(localStorage.getItem('assigned'));
    let person = JSON.parse(localStorage.getItem('Data'));
    let code = person['code'];
    this.moduleProfileService.assignedModule(profile, code).subscribe((Data)=>{

      let data = Data['modules'];
      if(Data['status'] == 'success'){

        this.moduleProfileService.moduleProfile = data;
        this.authService.stateProfile = true;
        // console.log(this.moduleProfileService.moduleProfile.length);
        // setTimeout(()=>{
        //   this.router.navigate(["/panel"]);
        // },3000);
      }else{

      }

      this.messages = Data['message'];
      this.createMessage(Data['status'], this.messages);
    }, (error)=> {

      this.messages = error.message;
      this.createMessage('error', this.messages);
    });
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
