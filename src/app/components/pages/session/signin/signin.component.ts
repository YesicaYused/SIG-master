import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { person } from 'src/app/models/person';
import { PersonService } from '../../../../services/person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../../../services/setting.service';
import { AuthServices } from '../../../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent implements OnInit {

  passwordVisible = false;
  person: person = {
    name: null,
    last_name: null,
    password: null,
    code: null,
    state: null,
  };

  url = environment.URL;
  public API:string;

  isLoading = false;
  redirect: string;
  messages: string;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private personService: PersonService,
    private authService: AuthServices,
    public SettingService: SettingService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.API = environment.API;
  }

  ngOnInit(){
    // this.redirect = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.redirect = '/';
  }

  Login(){

    this.isLoading = true;
    this.person.getToken = true;
    this.authService.state = false;
    this.authService.login(this.person).subscribe((Token)=>{

      let token = Token['data'];
      if(token['status'] == 'success'){

        // this.authService.TOKEN = token['data'];
        this.authService.Header(token['data']);
        localStorage.setItem('Token', JSON.stringify(token['data']));
        this.authService.state = true;
        this.person.getToken = false;
      }

      this.authService.login(this.person).subscribe((Data)=>{

        let data = Data['data'];
        if(data['status'] == 'success'){

          this.authService.people = data['data'];
          this.authService.profile = data['profile'];
          this.authService.state = true;
          localStorage.setItem('Data', JSON.stringify(data['data']));
          setTimeout(()=>{
            this.router.navigate([this.redirect]);
          },3000);
        }

        this.messages = data['message'];
        this.createMessage(data['status'], this.messages);
        this.isLoading = false;
      }, (error)=> {

        this.messages = error.message;
        this.isLoading = false;
        this.createMessage('error', this.messages);
      });
    }, (error)=> {

      this.messages = error.message;
      this.isLoading = false;
      this.createMessage('error', this.messages);
    });
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
