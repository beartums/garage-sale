
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { DataService } from '../shared/data.service';
import { TagService } from '../shared/tag.service';
import { FilterService } from '../shared/filter.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { SettingsComponent } from '../settings/settings.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { switchMap, map, reduce } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import { Message } from '../model/message';
import { PATHS } from '../shared/constants';
import { MessageNavDialogComponent } from '../message-center/message-center-dialog/message-center-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { InfoPageComponent } from '../info-page/info-page.component';
import { faSignOutAlt, faUserCog, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
/**
 * Primary navigational element -- navbar and router outlet for Tile list,
 * table list, and admin list views
 *
 * @export
 * @class NavbarComponent
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // FontAwesome fonts
  faSignOutAlt = faSignOutAlt;
  faUserCog = faUserCog;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faEdit = faEdit;

  // Expose services to view
  auth: AuthService;
  filt: FilterService;

  // Subscriptions to unsubscribe
  subs: any[] = [];

  // Messages for message dialog
  // TODO: Move to a message service
  userMessages: Message[] = [];
  adminMessages: Message[] = [];
  userMessages$: Observable<Message[]>;
  adminMessages$: Observable<Message[]>;

  /**
   * Indicate the filter is active (filtering) or paused (not filtering)
   *
   * @readonly
   * @memberof NavbarComponent
   */
  get filterIsPaused() {
    return this.fs.isPaused;
  }

  /**
   * Return the number of messages available for the user
   *
   * @readonly
   * @memberof NavbarComponent
   */
  get messageCount() {
    return this.userMessages.length + this.adminMessages.length;
  }

  /**
   *Return the number of unread messages for th user
   *
   * @readonly
   * @memberof NavbarComponent
   */
  get newMessageCount() {
    const messages = this.userMessages.concat(this.adminMessages);
    const count = messages.filter(msg => !msg.isRead).length;
    return count;
  }

  // For responsive actions -- is extra-small size?
  isXs: boolean;

  isXs$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map(result => this.isXs = result.matches)
  );

  constructor(private router: Router, 
    private as: AuthService, private ds: DataService, private ts: TagService,
    private fs: FilterService, private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog) {
      this.auth = as;
      this.filt = fs;

      // subscribe to breakpoint observer because fxHide.xs doesn't always work
      this.subs.push( this.isXs$.subscribe( result => this.isXs = result ));

      // keep up to date on messages and admingmessages
      this.userMessages$ = this.as.authUser.pipe(
        switchMap( user => this.ds.getMessages$(user ? user.uid : null) ));
      this.adminMessages$ = this.as.authUser.pipe(
        switchMap( user => this.as.isUserAdmin(user) ? this.ds.getMessages$('<admin>') : of([]))
      );
      
      this.subs.push(this.userMessages$.subscribe( msgs => this.userMessages = msgs));
      this.subs.push(this.adminMessages$.subscribe( msgs => this.adminMessages = msgs));

    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

  gotoSaleSettings() {
    this.router.navigate([PATHS.listUrl])
  }
  gotoSettings() {
    let dialog = this.dialog.open(SettingsComponent, {
      height: '80%',
      width: '80%',
      data: { user: this.as.user }
    })
  }
  gotoTileList() {
    this.router.navigate([PATHS.tilesUrl])
  }

  gotoInbox() {
    let dialogRef = this.dialog.open(MessageNavDialogComponent, {
      height: '90%',
      width: '90%',
      data: { user: this.as.user,
              messages$: this.userMessages$ || [],
              adminMessages$: this.adminMessages$ || [],
      }
    });
  }

  gotoInfo() {
    let dialogRef = this.dialog.open(InfoPageComponent, {
      height: '95%',
      width: '95%',
    })
    console.log('should be going to info page now')
  }

  isCurrentRoute(route: string): boolean {
    if (route === 'tiles') {
      return this.router.url === '/' + PATHS.tilesUrl;
    } else if (route === 'list') {
      return this.router.url === '/' + PATHS.listUrl;
    }
    return false;
  }

  isFilterOn(): boolean {
    return this.fs.isCurrentlyFiltering;
  }

  isFilterPaused(): boolean {
    return this.fs.isPaused;
  }
  toggleFilterState() {
    this.fs.toggleFilterState();
  }


  login() {
    this.as.loginWithGoogle();
  }

  logout() {
    this.userMessages = [];
    this.adminMessages = [];
    this.as.logout();
  }

  isAdmin(): boolean {
    return this.as.isAdmin;
  }
  isLoggedIn(): boolean {
    return this.as.isLoggedIn;
  }

  editFilter() {
    let dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '90%',
      height: '90%',
      data: { user: this.as.user }
    })
  }
 
}
