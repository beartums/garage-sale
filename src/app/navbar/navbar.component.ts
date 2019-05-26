import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { TagService } from '../tag.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showFilters = false;
  auth: AuthService;

  constructor(private router: Router, 
    private as: AuthService, private ds: DataService, private ts: TagService,
    private fs: FilterService) {
      this.auth = as;
  }

  gotoSaleSettings() {
    this.router.navigate(['/mat-item-list'])
  }
  gotoTileList() {
    this.router.navigate(['/mat-item-tiles'])
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

}
