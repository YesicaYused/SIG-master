import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../../../../services/auth.service';
import { ModuleProfileService } from '../../../../services/module-profile.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.sass']
})
export class AsideComponent implements OnInit {

  profile;
  constructor(
    public authService: AuthServices,
    public moduleProfileService: ModuleProfileService,
  ) { }

  ngOnInit() {
    this.profile = JSON.parse(localStorage.getItem('assigned'));
  }

}
