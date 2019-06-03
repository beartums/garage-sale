import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';

import { Item } from '../item';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';
import { PATHS } from '../constants';
import { ItemCommentsComponent } from '../item-comments/item-comments/item-comments.component';
import { ItemCommentsDialogComponent } from '../item-comments/item-comments-dialog/item-comments-dialog.component';

@Component({
  selector: 'app-mat-item-list',
  templateUrl: './mat-item-list.component.html',
  styleUrls: ['./mat-item-list.component.css']
})
export class MatItemListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['pictureUrl', 'name', 'price', 'tags', 'edit'];

  constructor(private ds: DataService, private router: Router,
              private is: ItemService, private as: AuthService,
              private dialog: MatDialog) {
    const itemList = this.ds.getItemList$();
    itemList.subscribe( list => { this.dataSource = new MatTableDataSource(list); } );
  }

  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate([PATHS.editUrl, item.key]);
  }

  addItem() {
    this.ds.itemBeingEdited = null;
    this.router.navigate([PATHS.editUrl, 'new']);
  }

  isAdmin() {
    return this.as.isAdmin;
  }

  isFavorited(item: Item): boolean {
    return this.is.isFavoritedBy(item, this.as.userId)
  }

  joinTags(tags: string[] = [], delim: string = ', '): string {
    return tags.join(delim);
  }

  showItem(item) {
    this.router.navigate([PATHS.itemUrl,item.key])
  }

  sortTags(tags: string[] = []): string[] {
    return tags.sort();
  }

  toggleFavorited(item: Item) {
    this.is.toggleFavorite(item, this.as.userId);
  }

  formatPrice(price: number = 0): string {
    return this.is.formatPrice(price);
  }
  
  getEmailForItem(item: Item): string {
    let email = '';
    email += 'MailTo: someone@somewhere.com';
    email += '?subject=Check it out: ' + item.name;
    email += '&body=Thought you might be interested in this:%0D%0A%0D%0A';
    email += item.name + ' -- ';
    email += item.description;
    email += '%0D%0A%0D%0Ahttps://garage-sale.griffithnet.com' + PATHS.itemUrl + '/' + item.key;
    
    return email;
  }

  getAdminEmailForItem(item: Item): string {
    let email = '';
    email += 'MailTo: garage-sale@griffithnet.com';
    email += '?subject=RE: ' + item.name;
    email += '&body=RE: ';
    email += 'https://garage-sale.griffithnet.com' + PATHS.itemUrl + '/' + item.key;
    
    return email;
  }
  
  toggleComments(item: Item) {
    let dialogRef: MatDialogRef<ItemCommentsComponent> = this.dialog.open(ItemCommentsComponent, {
      height: '90%',
      width: '90%',
      data: { item: item },
    })
  }

  ngAfterViewInit() {
    //this.dataSource = new MatItemListDataSource(this.paginator, this.sort);
  }
}
