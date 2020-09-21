import { Component, ɵConsole } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthServices } from './services/auth.service';
import { SettingService } from './services/setting.service';
import {VariableService} from './services/variable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'client';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthServices,
    public SettingService: SettingService,
    public variableService: VariableService,
    private router: Router,
  ) {
      this.SettingService.data().subscribe((data: any) => {

        this.SettingService.setting = data['data'];
        this.SettingService.service = data['services'];
        this.SettingService.social_network = data['social_network'];
        this.SettingService.menu_footer = data['menu_footer'];
        this.SettingService.menu_header_one = data['menu_header_one'];
        this.SettingService.menu_header_two = data['menu_header_two'];
        this.SettingService.settingStatus = true;
      }, (error)=> {

      });
   }

  ngOnInit() {

    this.authService.people = JSON.parse(localStorage.getItem('Data'));
    this.variableService.positionObservatory = JSON.parse(localStorage.getItem('pos'));
    // this.authService.token();

    if(this.authService.people){
      this.authService.personalInformation(this.authService.people.code).subscribe((Data)=>{

        let data = Data;
        if(data['status'] == 'success'){

          this.authService.people = data['data'];
          this.authService.profile = data['profile'];
          this.authService.permission = data['permission'];
          this.authService.state = true;
          localStorage.setItem('Data', JSON.stringify(data['data']));
        }else{

          localStorage.removeItem('Data');
          localStorage.removeItem('Token');
          this.authService.state = false;
        }
      }, (error)=> {

      });
    }
  }
}
