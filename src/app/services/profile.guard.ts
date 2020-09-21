import { Injectable } from '@angular/core';
import {CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthServices} from './auth.service';
import {ModuleProfileService} from './module-profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivateChild {

  constructor(
    public authService: AuthServices,
    public moduleProfileService: ModuleProfileService,
    private router: Router){}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.stateProfile){
      if(this.authService.current_url != '/panel'){
        let state = false;
        for (let i = 0; i < this.moduleProfileService.moduleProfile.length; i++){
          if(this.moduleProfileService.moduleProfile[i]['route'] == this.authService.current_url){
            state = true;
          }
        }
        if(state){
          return true;
        }else{
          this.router.navigate(['/panel']);
          return false;
        }
      }else{
        return true;
      }
    }
  }

}
