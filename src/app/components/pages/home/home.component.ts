import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SettingService } from '../../../services/setting.service';
import {ObservatoryService} from '../../../services/observatory.service';
import { environment } from '../../../../environments/environment';
import {VariableService} from '../../../services/variable.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  url = environment.URL;

  constructor(
    public authService: AuthServices,
    private router: Router,
    public SettingService: SettingService,
    public observatorioService: ObservatoryService,
    public variableService: VariableService,
  ) { }

  ngOnInit() {

    this.observatorioService.data().subscribe((data)=>{

      this.observatorioService.observatories = data['data'];
    }, (error)=> {


    });
  }

  pos(pos){
    this.variableService.positionObservatory = pos;
    localStorage.setItem('pos', JSON.stringify(pos));
  }
}
