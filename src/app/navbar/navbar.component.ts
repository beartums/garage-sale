import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { TagService } from '../tag.service';
import { FilterService } from '../filter.service';
import * as _ from 'lodash';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SettingsComponent } from '../settings/settings.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { take, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Message } from '../message';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  auth: AuthService;
  filt: FilterService;

  subs: any[] = [];

  userMessages: Message[] = [];
  adminMessages: Message[] = []

  get messageCount() {
    return this.userMessages.concat(this.adminMessages).length;
  }
  get newMessageCount() {
    return this.userMessages.concat(this.adminMessages).filter( msg => !msg.isRead).length;
  }

  constructor(private router: Router, 
    private as: AuthService, private ds: DataService, private ts: TagService,
    private fs: FilterService,
    private dialog: MatDialog) {
      this.auth = as;
      this.filt = fs;

      this.subs.push(this.as.authUser.pipe( 
        switchMap( user => this.ds.getMessages$(user.uid) ))
        .subscribe( msgs => this.userMessages = msgs));
      this.subs.push(this.as.authUser.pipe( 
        switchMap( user => {
          if (this.as.isUserAdmin(user)) {
            return this.ds.getMessages$('<admin>');
          } else {
            return of([]);
          }
        } ))
        .subscribe( msgs => this.adminMessages = msgs));
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

  gotoSaleSettings() {
    this.router.navigate(['/mat-item-list'])
  }
  gotoSettings() {
    let dialog = this.dialog.open(SettingsComponent, {
      height: '80%',
      width: '80%',
      data: { user: this.as.user }
    })
  }
  gotoTileList() {
    this.router.navigate(['/mat-item-tiles'])
  }
  gotoInfo() {
    console.log('should be going to info page now')
  }
  isCurrentRoute(route: string): boolean {
    return route === this.router.url;
  }

  login() {
    this.as.loginWithGoogle();
  }

  logout() {
    this.as.logout();
  }

  isAdmin(): boolean {
    return this.as.isAdmin;
  }
  isLoggedIn(): boolean {
    return this.as.isLoggedIn;
  }

  toggleFilter() {
    let dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '90%',
      height: '90%',
      data: { user: this.as.user }
    })
  }
 
}
