import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../item.service';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { Direct } from 'protractor/built/driverProviders';
import { directiveDef } from '@angular/core/src/view';
import { sortAscendingPriority } from '@angular/flex-layout';
import * as _ from 'lodash';
import { DataService } from '../data.service';
import { Input } from '@angular/compiler/src/core';

enum Direction {
  descending, ascending
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {

  items$: Observable<Item[]>
  sortProp: string;
  sortOrder: Direction;

  editItem: Partial<Item>;

  constructor(private is: ItemService, private ds: DataService) {
    this.items$ = this.is.items$;
  }

  ngOnInit() {
  }

  cleanPrice(price: string): string {
    return ('' + price).replace(/[^0-9]/gi, '');
  }

  isBeingEdited(item: Item) {
    if (!item || !this.editItem) return false;
    return this.editItem.key === item.key;
  }

  gotoEditPage(item: Item) {
    this.is.editItem(item);
  }

  editInPlace(item: Item, deprecated: string) {
    //event.target.setFocus()
    this.editItem = _.pick(item, ['soldPriceUgx', 'price', 'soldTo', 'soldToEmail', 'isSold', 'soldDate', 'key']);
  }
  cancelChanges() {
    this.editItem = null;
  }

  saveChanges(item) {
    this.ds.updateItem(item.key, this.editItem);
    this.editItem = null;
  }
  toggleIsSold(item: Partial<Item>) {
    item.isSold = !item.isSold;
  }

  formatPrice(price: string): string {
    return this.is.formatPrice(price);
  }

  getVal(item: Item, prop: string): any {
    if (prop === 'price' || prop === 'soldPriceUgx') { return +this.cleanPrice(<string>item[prop] || '0'); }
    if (prop === 'soldDate' || prop === 'dateAvailable') { return new Date(item[prop] || null); }
    if (prop === 'isSold' || prop === 'isFeatured' || prop === 'isHidden') {
      if (item[prop] !== true && item[prop]!==false) { return -1; }
      return item[prop] === true ? 1 : 0;
    }
    return item[prop] || '';
  }

  sortAndFilter(items: Item[] = []): Item[] {
    let reverse = this.sortOrder === Direction.ascending ? 1 : -1
    items.sort( (a, b) => {
      
      const aVal: any = this.getVal(a, this.sortProp);
      const bVal: any = this.getVal(b, this.sortProp);
      return reverse * (aVal > bVal ? -1 : 1);
    });
    return items;
  }

  soldAndCollected(items: Item[]): number {
    return items.reduce( (total, item) => {
      const price = +this.cleanPrice(item.soldPriceUgx);
      if (!item.isSold || +price === 0) { return total; }
      return total + price;
    }, 0);
  }

  soldAndUncollected(items: Item[]): number {
    return items.reduce( (total, item) => {
      const price = +this.cleanPrice(item.soldPriceUgx) || 0;
      const expectedPrice = +this.cleanPrice('' + item.price);
      if (!item.isSold || +price > 0) { return total; }
      return total + expectedPrice;
    }, 0);
  }

  unsold(items: Item[]): number {
    return items.reduce( (total, item) => {
      const expectedPrice = +this.cleanPrice('' + item.price);
      if (item.isSold) { return total; }
      return total + expectedPrice;
    }, 0);
  }

  updateSort(prop: string) {
    if (this.sortProp === prop) {
      this.sortOrder = this.sortOrder === Direction.ascending ? Direction.descending : Direction.ascending;
    } else {
      this.sortProp = prop;
      this.sortOrder = Direction.ascending;
    }
  }

}
