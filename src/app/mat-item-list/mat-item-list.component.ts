import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Item } from '../item';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

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
  displayedColumns = ['name','description'];

  constructor(private ds: DataService, private router: Router) {
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
  ngAfterViewInit() {
    //this.dataSource = new MatItemListDataSource(this.paginator, this.sort);
  }
}
