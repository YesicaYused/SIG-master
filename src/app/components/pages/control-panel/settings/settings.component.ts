import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../services/setting.service';
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import { email } from '../../../../models/setting';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  passwordVisible = false;
  email: email = {
    user_mail: null,
    password_mail: null,
    SMTPSecure: null,
    host_email: null,
    port_email: null,
    email_controller: null,
  };
  loading = false;



  constructor(
    public SettingService: SettingService,
    private msg: NzMessageService,
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {

  }

  modifySocialLogin(){

    this.loading = true;
    let facebook_ID = this.SettingService.setting[12]['value'];
    let google_ID = this.SettingService.setting[13]['value'];

    this.SettingService.modify_social_login(facebook_ID, google_ID).subscribe((data) => {

      this.loading = false;
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.loading = false;
    });
  }

  modifyEmail(){

    this.loading = true;
    this.email['user_mail'] = this.SettingService.setting[31]['value'];
    this.email['password_mail'] = this.SettingService.setting[32]['value'];
    this.email['SMTPSecure'] = this.SettingService.setting[33]['value'];
    this.email['host_email'] = this.SettingService.setting[38]['value'];
    this.email['port_email'] = this.SettingService.setting[39]['value'];
    this.email['email_controller'] = this.SettingService.setting[41]['value'];

    this.SettingService.modify_email(this.email).subscribe((data) => {

      this.loading = false;
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.loading = false;
    });
  }

}
