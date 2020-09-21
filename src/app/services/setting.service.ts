import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServices } from './auth.service';
import {email, service, setting, social_network, menu_header_one, menu_header_two, menu_footer} from "../models/setting";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  setting: any;
  service: any;
  social_network: any;
  menu_footer: any;
  menu_header_one: any;
  menu_header_two: any;
  settingStatus: boolean = false;

  menu_headers_one: menu_header_one = {
    name: null,
    route: null,
    icon: null,
    state: null,
    type: null,
  }

  menu_headers_two: menu_header_two = {
    name: null,
    route: null,
    icon: null,
    state: null,
    type: null,
    authentication: null,
  }

  menus_footer: menu_footer = {
    name: null,
    route: null,
    state: null,
  }

  services: service = {
    description: null,
    title: null,
    image: null,
    state: null,
  };

  social: social_network = {
    name: null,
    route: null,
    icon: null,
    state: null,
    type: null,
  };

  listOfData = [];
  listOfDisplayData:any = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthServices
  ) { }

  data(){
    return this.httpClient.get(this.authService.API + 'setting', {headers: this.authService.headers});
  }

  query(id: any) {

    return this.httpClient.post(this.authService.API + 'setting/modify', {'id': id}, {headers: this.authService.headers});
  }

  updateSocial(id: any, state: any){
    return this.httpClient.post(this.authService.API + 'setting/update_social_network', {'id': id, 'state': state} ,{headers: this.authService.headers});
  }

  footer(id: any) {

    return this.httpClient.post(this.authService.API + 'setting/footer_modify', {'id': id}, {headers: this.authService.headers});
  }

  header_one(id: any) {

    return this.httpClient.post(this.authService.API + 'setting/header_one_modify', {'id': id}, {headers: this.authService.headers});
  }

  header_two(id: any) {

    return this.httpClient.post(this.authService.API + 'setting/header_two_modify', {'id': id}, {headers: this.authService.headers});
  }

  change_social_network(social: any) {

    return this.httpClient.post(this.authService.API + 'setting/change_social_network', social, {headers: this.authService.headers});
  }

  saveSocial_network(social: social_network){
    return this.httpClient.post(this.authService.API + 'setting/add_social_network', social, {headers: this.authService.headers});
  }

  query_social_network(id: any) {

    return this.httpClient.post(this.authService.API + 'setting/modify_social_network', {'id': id}, {headers: this.authService.headers});
  }

  modify_service(service: service) {

    return this.httpClient.post(this.authService.API + 'setting/modify_service', service, {headers: this.authService.headers});
  }

  modify_banner(banner: any) {

    return this.httpClient.post(this.authService.API + 'setting/modify_banner', banner, {headers: this.authService.headers});
  }

  modify_email(email: email) {

    return this.httpClient.post(this.authService.API + 'setting/modify_email', email, {headers: this.authService.headers});
  }

  modify_social_login(facebook_ID: any, google_ID: any) {

    return this.httpClient.post(this.authService.API + 'setting/modify_social_login', {'facebook_ID': facebook_ID, "google_ID": google_ID}, {headers: this.authService.headers});
  }

  add_service(service: service) {

    return this.httpClient.post(this.authService.API + 'setting/add_service', service, {headers: this.authService.headers});
  }

  add_header(header: any) {

    return this.httpClient.post(this.authService.API + 'setting/add_header', header, {headers: this.authService.headers});
  }

  add_footer(footer: any) {

    return this.httpClient.post(this.authService.API + 'setting/add_footer', footer, {headers: this.authService.headers});
  }

  modify_menu(header: menu_header_one) {

    return this.httpClient.post(this.authService.API + 'setting/modify_menu', header, {headers: this.authService.headers});
  }

  modify_menu_two(header: any) {

    return this.httpClient.post(this.authService.API + 'setting/modify_menu_two', header, {headers: this.authService.headers});
  }

  modify_footer(footer: menu_footer) {

    return this.httpClient.post(this.authService.API + 'setting/modify_footer', footer, {headers: this.authService.headers});
  }

  delete_header(id, menu) {

    return this.httpClient.post(this.authService.API + 'setting/delete_header', {"id": id, "menu": menu}, {headers: this.authService.headers});
  }

  delete_footer(id) {

    return this.httpClient.post(this.authService.API + 'setting/delete_footer', {"id": id}, {headers: this.authService.headers});
  }

  delete_service(id) {

    return this.httpClient.post(this.authService.API + 'setting/delete_service', {"id": id}, {headers: this.authService.headers});
  }
}
