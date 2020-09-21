import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  url = environment.URL;
  message: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }
}
