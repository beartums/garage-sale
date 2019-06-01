import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Item } from '../item';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';

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
              private is: ItemService, private as: AuthService) {
    const itemList = this.ds.getItemList$();
    itemList.subscribe( list => { this.dataSource = new MatTableDataSource(list); } );
  }

  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate(['/mat-item-edit', item.key]);
  }

  addItem() {
    this.ds.itemBeingEdited = null;
    this.router.navigate(['/mat-item-edit', 'new']);
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
    this.router.navigate(['/show-item',item.key])
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

  ngAfterViewInit() {
    //this.dataSource = new MatItemListDataSource(this.paginator, this.sort);
  }
}
