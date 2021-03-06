import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
	
	constructor(private auth: AuthService) {}
	
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isLoggedIn$;
  }
}

@Injectable()
export class AuthGmGuard implements CanActivate {
	
	constructor(private auth: AuthService) {}
	
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isAdmin$;
  }
}
