import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../services/setting.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  constructor(
    public SettingService: SettingService,
  ) { }

  ngOnInit() {
  }

}
