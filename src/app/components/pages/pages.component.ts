import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.sass']
})
export class PagesComponent implements OnInit {

  url = environment.URL;

  constructor(
    private router: Router,
    public SettingService: SettingService,
  ) { }

  ngOnInit() {

  }
}
