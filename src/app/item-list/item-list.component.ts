import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatDialog } from '@angular/material';

import { Item } from '../model/item';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';
import { ItemService } from '../shared/item.service';
import { AuthService } from '../shared/auth.service';
import { PATHS } from '../shared/constants';
import { ItemCommentsComponent } from '../item-comments/item-comments/item-comments.component';
import { FilterService } from '../shared/filter.service';
import { User } from '../model/user';
import { Observable, Subscribable, Subscription } from 'rxjs';
import {breakpointsProvider, BreakpointsService, BreakpointConfig, BreakpointEvent} from '../shared/breakpoint.service';
import { EmailService } from '../shared/email.service';

const breakpointConfig: BreakpointConfig = {
  xxs: { max: 475 },
  xs: { min: 475, max: 768 },
  sm: { min: 768, max: 992 },
  md: { min: 992, max: 1200 },
  lg: { min: 1200, max: 1500 },
  xxl: { min: 1500 }
}
@Component({
  selector: 'app-mat-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [breakpointsProvider(breakpointConfig)]
})

export class ItemListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  bp: BreakpointEvent;
  itemList$: Observable<Item[]>;
  bpList: string[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xxl'];
  bpSub: any;

  filter: string;

  constructor(private ds: DataService, private router: Router,
              private is: ItemService, private as: AuthService,
              private dialog: MatDialog, private fs: FilterService,
              private breakpointsService: BreakpointsService,
              private es: EmailService) {
    this.itemList$ = this.ds.getItemList$();

    this.bpSub = this.breakpointsService.changes.subscribe((event: BreakpointEvent) => {
      this.bp = event;
    });
  }

  ngOnDestroy() {
    this.bpSub.unsubscribe();
  }

  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate([PATHS.editUrl, item.key]);
  }

  addItem() {
    this.ds.itemBeingEdited = null;
    this.router.navigate([PATHS.editUrl, 'new']);
  }

  bpEq(names: string[]) {
    return names.indexOf(this.bp.name)>-1;
  }

  bpGt(name: string): boolean {
    name = name.toLowerCase();
    let idx = this.bpList.indexOf(name);
    if (idx === -1) { return false; }
    let rtn = idx > this.bpList.indexOf(this.bp.name);
    return rtn;
  }

  bpLt(name: string): boolean {
    name = name.toLowerCase();
    let idx = this.bpList.indexOf(name);
    if (idx === -1) { return false; }
    let rtn =  idx < this.bpList.indexOf(this.bp.name);
    return rtn;
  }

  isAdmin() {
    return this.as.isAdmin;
  }

  isFavorited(item: Item): boolean {
    if (!item) { return false; }
    return this.is.isFavoritedBy(item, this.as.userId)
  }

  joinTags(tags: string[] = [], delim: string = ', '): string {
    return tags.join(delim);
  }

  showItem(item) {
    this.router.navigate([PATHS.itemUrl, item.key]);
  }

  sortTags(tags: string[] = []): string[] {
    return tags.sort();
  }

  toggleFavorited(item: Item) {
    this.is.toggleFavorite(item, this.as.userId);
  }

  updateSearchFilter(filter: string) {
    this.filter = filter;
  }

  formatPrice(price: number = 0): string {
    return this.is.formatPrice(price.toString());
  }
  
  sendEmail(item: Item) {
    this.es.mail(item);
  }
  
  isFiltered(item: Item, user: User = null): boolean {
    user = user || this.as.user;
    const isFiltered = this.fs.isFiltered(item, user);
    if (isFiltered) { return true; }
    if (!this.filter || this.filter === '') { return false; }
    const filterString = item.name + '|' + item.soldTo + '|' + item.tags.join('|');
    return filterString.toLowerCase().indexOf(this.filter.toLowerCase()) === -1;
  }

  gotoAdminView() {
    this.router.navigate([PATHS.adminUrl])
  }
  
  toggleComments(item: Item) {
    let dialogRef: MatDialogRef<ItemCommentsComponent> = this.dialog.open(ItemCommentsComponent, {
      height: '90%',
      width: '90%',
      data: { item: item },
    })
  }
  sortItems(items: Item[] = []): Item[] {
    if (!this.fs) { return []; }
    return this.fs.sort(items);
  }

}
