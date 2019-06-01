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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  auth: AuthService;
  filt: FilterService;

  constructor(private router: Router, 
    private as: AuthService, private ds: DataService, private ts: TagService,
    private fs: FilterService,
    private dialog: MatDialog) {
      this.auth = as;
      this.filt = fs;
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

  toggleFilter() {
    let dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '90%',
      height: '90%',
      data: { user: this.as.user }
    })
  }
 
}
