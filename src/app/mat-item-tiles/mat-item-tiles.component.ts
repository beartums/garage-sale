import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { Item } from '../item';
import { DataService } from '../data.service';

@Component({
  selector: 'app-mat-item-tiles',
  templateUrl: './mat-item-tiles.component.html',
  styleUrls: ['./mat-item-tiles.component.css']
})
export class MatItemTilesComponent {

  cardCols = 1;
  cardRows = 1;
  gridListCols = 1;

  items$: Observable<Item[]>;
  subscriptions: Subscription[] = [];

  /** Based on the screen size, switch from standard to one column per row */

  constructor(private breakpointObserver: BreakpointObserver, private ds: DataService) {
    this.items$ = this.ds.getItemList$();
    let sub = this.breakpointObserver.observe(Breakpoints.Small).subscribe((state) => {
      if (state.matches) {
        this.cardCols = 1;
        this.cardRows = 2;
        this.gridListCols = 1;
      } 
    });
    this.subscriptions.push(sub);
    sub = this.breakpointObserver.observe([Breakpoints.Medium])
      .subscribe((state) => {
      if (state.matches) {
        this.cardCols = 2;
        this.cardRows = 1;
        this.gridListCols = 2;
      }
    });
    this.subscriptions.push(sub)
    sub = this.breakpointObserver.observe([Breakpoints.Large])
      .subscribe((state) => {
      if (state.matches) {
        this.cardCols = 2;
        this.cardRows = 1;
        this.gridListCols = 4;
      }
    });
    this.subscriptions.push(sub)
    this.breakpointObserver.observe(Breakpoints.XLarge).subscribe((state) => {
      if (state.matches) {
        this.cardCols = 2;
        this.cardRows = 1;
        this.gridListCols = 6;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
