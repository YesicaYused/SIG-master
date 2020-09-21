import { Component, OnInit } from '@angular/core';
import {UploadFile, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { SettingService } from '../../../../services/setting.service';
import { setting, menu_header_one, menu_header_two, menu_footer, service, banner } from '../../../../models/setting';
import {ServiceComponent} from "../../../shared/modal/service/service.component";
import { AuthServices } from '../../../../services/auth.service';
import {HttpClient} from "@angular/common/http";
import {IconService} from "../../../../services/icon.service";
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-interfaces-settings',
  templateUrl: './interfaces-settings.component.html',
  styleUrls: ['./interfaces-settings.component.sass']
})
export class InterfacesSettingsComponent implements OnInit {

  loadingLogo = false;
  loadingBanner = false;
  loadingBanner2 = false;
  loadingFavicon = false;
  loadingService = false;

  formData = new FormData();
  radioValue = '';

  url = environment.URL;
  menu_header = true;

  state = false;
  stateFooter = false;
  stateDelete = false;

  services: any;

  banner: banner = {
    banner_title: null,
    banner_description: null,
    description_button: null,
    main_title: null,
    main_description: null,
  };

  previewImage: string | undefined = '';
  previewVisible = false;

  isLoadingOne = false;
  type: any = 'Menu 1';
  typeMenu: any = 'Menu 1';

  delete: any;

  message: string;

  isConfirmLoading = false;
  messagesRegistry: [];
  width: any;

  isHidden: boolean;

  constructor(
    private msg: NzMessageService,
    public SettingService: SettingService,
    private modalService: NzModalService,
    public authService: AuthServices,
    private httpClient: HttpClient,
  ) {}

  ngOnInit(){

    this.SettingService.menu_headers_one.number_menu = 1;
    this.services = this.SettingService.service;
    this.width = screen.width - 80;
  }

  onClose(id, menu): void {
    this.SettingService.delete_header(id, menu).subscribe((data) => {

      this.SettingService.menu_header_one = data['menu_one'];
      this.SettingService.menu_header_two = data['menu_two'];
      this.msg.create('success', data['correct_message']);
      this.state = false;
    }, (error) => {

    });
  }

  onCloseFooter(id): void {
    this.SettingService.delete_footer(id).subscribe((data) => {

      this.SettingService.menu_footer = data['data'];
      this.msg.create('success', data['correct_message']);
      this.stateFooter = false;
    }, (error) => {

    });
  }

  preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  deleteServices() {
    this.stateDelete = true;
    this.isHidden = true;
  }

  deleteService() {
    this.isHidden = false;
    this.stateDelete = false;
  }

  cancel(): void {
    this.msg.error('Accion cancelada');
  }

  confirm(): void {
    this.SettingService.delete_service(this.radioValue).subscribe((data) => {

      this.SettingService.service = data['data'];
      this.msg.success('Accion cancelada');
    }, (error) => {

    });
  }

  beforeUpload = (file: File) => {
    let name =  Math.random().toString(36).substring(7);
    this.formData.append('file', file);
    this.formData.append('name_file', name);
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('Solo puedes subir archivos JPG');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('La imagen debe ser más pequeña que 2MB');
        observer.complete();
        return;
      }
      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 6000);
      };
    });
  }

  handleChangeLogo(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingLogo = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingLogo = false;
          this.uploadLogo();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loadingLogo = false;
        break;
    }
  }

  handleChangeFavicon(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingFavicon = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingFavicon = false;
          this.uploadFavicon();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loadingFavicon = false;
        break;
    }
  }

  handleChangeBanner(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingBanner = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingBanner = false;
          this.uploadBanner();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loadingBanner = false;
        break;
    }
  }

  handleChangeBanner2(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingBanner2 = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingBanner2 = false;
          this.uploadBanner2();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loadingBanner2 = false;
        break;
    }
  }

  handleChangeService(info: { file: UploadFile }, id): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingService = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingService = false;
          this.formData.append('id', id);
          this.uploadServices();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loadingService = false;
        break;
    }
  }

  uploadLogo(){
    this.httpClient.post(this.authService.API + 'setting/uploadLogo', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.SettingService.setting[1]['value'] = data['data'];
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.message = error.Message;
    });
  }

  uploadFavicon(){
    this.httpClient.post(this.authService.API + 'setting/uploadFavicon', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.SettingService.setting[2]['value'] = data['data'];
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.message = error.Message;
    });
  }

  uploadBanner(){
    this.httpClient.post(this.authService.API+ 'setting/uploadBanner', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.SettingService.setting[7]['value'] = data['data'];
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.message = error.Message;
    });
  }

  uploadBanner2(){
    this.httpClient.post(this.authService.API + 'setting/uploadBanner2', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.SettingService.setting[29]['value'] = data['data'];
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.message = error.Message;
    });
  }

  uploadServices() {
    this.httpClient.post(this.authService.API+ 'setting/uploadService', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.SettingService.service = data['data'];
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.message = error.Message;
    });
  }

  editOne(id, event){
    this.type = 'Menu 1';
    this.typeMenu = 'Menu 1';
    let classAll = document.getElementsByClassName('header_modify');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('active');
    }
    this.SettingService.header_one(id).subscribe((data: menu_header_one) => {

      this.SettingService.menu_headers_one = data['menu_header_one'];
      /*this.SettingService.menu_headers_one.number_menu = 1;*/
      this.menu_header = true;
      this.state = true;
    }, (error) => {

    });
    event.target.classList.add('active');
  }

  editTwo(id, event){
    this.type = 'Menu 2';
    this.typeMenu = 'Menu 2';
    let classAll = document.getElementsByClassName('header_modify');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('active');
    }
    this.SettingService.header_two(id).subscribe((data: menu_header_one) => {

      this.SettingService.menu_headers_one = data['menu_header_two'];
      /*this.SettingService.menu_headers_one.number_menu = 2;*/
      this.menu_header = true;
      this.state = true;
    }, (error) => {

    });
    event.target.classList.add('active');
  }

  editFooter(id, event){
    let classAll = document.getElementsByClassName('footer');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('active');
    }
    this.SettingService.footer(id).subscribe((data: menu_footer) => {

      this.SettingService.menus_footer = data['menu_footer'];
      this.state = true;
    }, (error) => {

    });
    event.target.classList.add('active');
   }

   menu(number) {
    if(number == 1){

      this.menu_header = true;
      this.SettingService.menu_headers_one.authentication = '';
    }else if(number == 2){

      this.menu_header = false;
    }
     /*this.SettingService.menu_headers_one.number_menu = number;*/
   }

   addService(){
     const modal = this.modalService.create({
       nzTitle: 'Agregar Servicio',
       nzContent: ServiceComponent,
       nzFooter: null
     });
   }

  modifyServices(){

    this.isLoadingOne = true;
    this.SettingService.modify_service(this.SettingService.service).subscribe((data) => {

      this.isLoadingOne = false;
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  modifyBanners(){

    this.isLoadingOne = true;
    this.banner['banner_title'] = this.SettingService.setting[20]['value'];
    this.banner['banner_description'] = this.SettingService.setting[21]['value'];
    this.banner['description_button'] = this.SettingService.setting[40]['value'];
    this.banner['main_title'] = this.SettingService.setting[28]['value'];
    this.banner['main_description'] = this.SettingService.setting[27]['value'];

    this.SettingService.modify_banner(this.banner).subscribe((data) => {

      this.isLoadingOne = false;
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  addMenu() {
    this.isLoadingOne = true;
    this.SettingService.add_header(this.SettingService.menu_headers_one).subscribe((data) => {

      this.isLoadingOne = false;
      this.SettingService.menu_header_one = data['menu_one'];
      this.SettingService.menu_header_two = data['menu_two'];

      this.SettingService.menu_headers_one.name = '';
      this.SettingService.menu_headers_one.type = '';
      this.SettingService.menu_headers_one.authentication = '';
      this.SettingService.menu_headers_one.route = '';
      this.SettingService.menu_headers_one.icon = '';

      this.state = false;

      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  changeMenu() {
    this.isLoadingOne = true;
    this.SettingService.modify_menu(this.SettingService.menu_headers_one).subscribe((data) => {

      this.isLoadingOne = false;
      this.SettingService.menu_header_one = data['menu_one'];
      this.SettingService.menu_header_two = data['menu_two'];

      this.SettingService.menu_headers_one.name = '';
      this.SettingService.menu_headers_one.type = '';
      this.SettingService.menu_headers_one.authentication = '';
      this.SettingService.menu_headers_one.route = '';
      this.SettingService.menu_headers_one.icon = '';
      this.SettingService.menu_headers_one.id = null;

      this.state = false;

      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  changeMenuTwo() {
    this.isLoadingOne = true;
    this.SettingService.modify_menu_two(this.SettingService.menu_headers_one).subscribe((data) => {

      this.isLoadingOne = false;
      this.SettingService.menu_header_one = data['menu_one'];
      this.SettingService.menu_header_two = data['menu_two'];

      this.SettingService.menu_headers_one.name = '';
      this.SettingService.menu_headers_one.type = '';
      this.SettingService.menu_headers_one.authentication = '';
      this.SettingService.menu_headers_one.route = '';
      this.SettingService.menu_headers_one.icon = '';
      this.SettingService.menu_headers_one.id = null;

      this.state = false;

      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  addFooter() {
    this.isLoadingOne = true;
    this.SettingService.menus_footer.copyRight = this.SettingService.setting[15]['value'];
    this.SettingService.add_footer(this.SettingService.menus_footer).subscribe((data) => {

      this.isLoadingOne = false;
      this.SettingService.menus_footer.name = '';
      this.SettingService.menus_footer.route = '';
      this.SettingService.menu_footer = data['data'];
      this.msg.create('success', data['correct_message']);

      this.stateFooter = false;
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  changeFooter() {
    this.isLoadingOne = true;
    this.SettingService.menus_footer.copyRight = this.SettingService.setting[15]['value'];
    this.SettingService.modify_footer(this.SettingService.menus_footer).subscribe((data) => {

      this.isLoadingOne = false;
      this.SettingService.menu_footer = data['data'];

      this.SettingService.menus_footer.name = '';
      this.SettingService.menus_footer.route = '';
      this.SettingService.menus_footer.id = null;

      this.stateFooter = false;

      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isLoadingOne = false;
    });
  }

  header() {
    if(this.SettingService.menu_headers_one['id'] && this.type == 'Menu 1'){

      this.changeMenu();
    }else if(this.SettingService.menu_headers_one['id'] && this.type == 'Menu 2'){

      this.changeMenuTwo();
    }else{

      this.addMenu();
    }
  }

  footer(){
    if(this.SettingService.menus_footer['id']){

      this.changeFooter();
    }else{

      this.addFooter();
    }
  }

  cleanHeader(){
    let classAll = document.getElementsByClassName('header_modify');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('active');
    }
    this.SettingService.menu_headers_one.name = '';
    this.SettingService.menu_headers_one.type = '';
    this.SettingService.menu_headers_one.authentication = '';
    this.SettingService.menu_headers_one.route = '';
    this.SettingService.menu_headers_one.icon = '';
    this.SettingService.menu_headers_one.id = null;

    this.state = true;
  }

  cleanFooter(){
    let classAll = document.getElementsByClassName('footer');
    for (let i = 0; i < classAll.length; i++) {
      classAll[i].classList.remove('active');
    }
    this.SettingService.menus_footer.name = '';
    this.SettingService.menus_footer.route = '';
    this.SettingService.menus_footer.id = null;

    this.stateFooter = true;
  }
}
