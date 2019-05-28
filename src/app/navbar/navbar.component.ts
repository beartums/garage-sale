import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { TagService } from '../tag.service';
import { FilterService } from '../filter.service';
import * as _ from 'lodash';

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
    private fs: FilterService) {
      this.auth = as;
      this.filt = fs;
  }

  gotoSaleSettings() {
    this.router.navigate(['/mat-item-list'])
  }
  gotoTileList() {
    this.router.navigate(['/mat-item-tiles'])
  }
  gotoInfo() {
    console.log('should be going to info page now')
  }
  currentRoute(): string {
    return this.router.url;
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
  getTagBadgeCount(tag: string = '', chosenTags: string[] = []): number {
    chosenTags = chosenTags.length === 0 ? this.fs.chosenTags : chosenTags;
    const allTags = _.concat(chosenTags, tag);
    const count = this.ts.getItemsInTagsCount(allTags);
    return count;
  }

}
