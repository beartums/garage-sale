import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { TagService } from '../tag.service';
import { FilterService } from '../filter.service';
import * as _ from 'lodash';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showFilters = false;
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

  selectTag(tag: string) {
    this.fs.addTagToFilter(tag);
  }
  removeTag(tag: string) {
    this.fs.removeTagFromFilter(tag);
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }
  getTags(): string[] {
    return this.fs.getAvailableTags(this.fs.chosenTags)
  }
  getChosenTags(): string[] {
    return this.filt.chosenTags;
  }
  getTagBadgeCount(tag: string = null, chosenTags: string[] = null, negativeTags: string[] = null): number {
    chosenTags = chosenTags || this.fs.chosenTags;
    negativeTags = negativeTags || this.fs.negativeTags;

    const allTags = tag ? _.concat(chosenTags, tag) : chosenTags;
    const count = this.ts.getItemsInTagsCount(allTags, negativeTags);
    return count;
  }
  isTagNegative(tag: string): boolean {
    return this.fs.isTagNegative(tag);
  }
  toggleTagPolarity(tag) {
    this.fs.toggleTagPolarity(tag);
  }

}
