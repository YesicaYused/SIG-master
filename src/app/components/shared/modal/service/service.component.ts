import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, UploadFile} from 'ng-zorro-antd';
import { SettingService } from '../../../../services/setting.service';
import { service } from '../../../../models/setting';
import {Observable, Observer} from "rxjs";
import {AuthServices} from "../../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.sass']
})
export class ServiceComponent implements OnInit {

  loading = false;
  isVisible = false;
  isConfirmLoading = false;
  messageAccion: string = null;
  messagesRegistry: [];

  url = environment.URL;
  formData = new FormData();

  service: service = {
    description: null,
    title: null,
    image: null,
    state: null,
  };

  message: string;

  constructor(
    public settingService: SettingService,
    private msg: NzMessageService,
    private modal: NzModalRef,
    public authService: AuthServices,
    private httpClient: HttpClient,
    public SettingService: SettingService,
  ) { }

  destroyModal(): void {
    this.modal.destroy();
  }

  handleCancel(): void {
    this.messageAccion = "Acción cancelada";
    this.destroyModal();
    this.createMessage('warning');
  }

  createMessage(type: string): void {
    this.msg.create(type, this.messageAccion);
  }

  ngOnInit() {
  }

  loadOne(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  beforeUpload = (file: File) => {
    let name =  Math.random().toString(36).substring(7);
    this.formData.append('file', file);
    this.formData.append('name_file', name);
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('Solo puedes subir archivos JPG!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('La imagen debe ser más pequeña que 2MB!');
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
        resolve(width === height && width >= 3000);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.addImage();
        });
        break;
      case 'error':
        this.msg.error('Error de red');
        this.loading = false;
        break;
    }
  }

  addImage() {
    this.loading = true;
    this.httpClient.post(this.authService.API + 'setting/serviceNew', this.formData,{
      headers: this.authService.HEADER
    }).subscribe((data) => {

      this.service.image = data['image'];
      this.msg.create('success', data['correct_message']);
      this.loading = false;
    }, (error) => {

      this.loading = false;
      this.message = error.Message;
    });
  }

  add(){

    this.isConfirmLoading = true;
    this.SettingService.add_service(this.service).subscribe((data) => {

      this.isConfirmLoading = false;
      this.SettingService.service = data['data'];
      this.destroyModal();
      this.msg.create('success', data['correct_message']);
    }, (error) => {

      this.isConfirmLoading = false;
    });
  }
}
