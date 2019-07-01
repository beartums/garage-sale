import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ItemService } from '../shared/item.service';
import { Observable, fromEvent, Subscription, iif, of } from 'rxjs';
import { Item } from '../model/item';
import * as _ from 'lodash';
import { DataService } from '../shared/data.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, take, startWith, defaultIfEmpty } from 'rxjs/operators';

enum Direction {
  descending, ascending
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit, AfterViewInit {

  //@ViewChild('searchBox') searchBox: ElementRef;
  @ViewChildren('searchBox') searchBoxes: QueryList<ElementRef>;

  items$: Observable<Item[]>
  sortProp: string;
  sortOrder: Direction;

  editItem: Partial<Item>;
  search$: Observable<{}>;
  searchSubscription: Subscription;
  filterString: string;
  searchBox: any;
  sbSub: Subscription;
  searchBoxSubscription: Subscription;

  constructor(private is: ItemService, private ds: DataService) {
    this.items$ = this.is.items$;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const mockEvent = { target: { value: '' } };
    this.searchBoxSubscription = this.searchBoxes.changes.subscribe( searchBoxes => {
      if (this.searchBox) { return null; }
        this.searchBox = searchBoxes.reduce(( acc, box) => box, null);
        if (!this.searchBox) {return null;}
        this.search$ = fromEvent(this.searchBox.nativeElement, 'keyup').pipe(
          map((event: any) => event.target.value.trim()),
          startWith(''),
          debounceTime(400),
          distinctUntilChanged()
        )
        this.searchSubscription = this.search$.subscribe( filter => {
            this.filterString = <string>filter;
          })
      }
    )

  }

  ngOnDestroy() {
    this.searchBoxSubscription.unsubscribe();
    this.searchSubscription.unsubscribe()
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
    this.editItem = _.pick(item, ['soldPriceUgx', 'price', 'soldTo', 'soldToEmail', 'isSold', 'soldDate', 'key', 'dateAvailable']);
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

  sort(items: Item[] = []): Item[] {
    let reverse = this.sortOrder === Direction.ascending ? 1 : -1
    items.sort( (a, b) => {
      const aVal: any = this.getVal(a, this.sortProp);
      const bVal: any = this.getVal(b, this.sortProp);
      return reverse * (aVal > bVal ? -1 : 1);
    });
    return items;
  }

  filterItems(items: Item[]): Item[] {
    if (this.filterString) {
      const filter = this.filterString.toLowerCase();
      return items.filter( (item: Item) => {
        let testString = item.name + item.soldTo + item.tags.join('|');
        testString = testString.toLowerCase();
        return testString.indexOf(filter) > -1;
      });
    } else {
      return items;
    }
  }

  soldAndCollected(items: Item[]): number {
    if (!items) return 0;
    return items.reduce( (total, item) => {
      const price = +this.cleanPrice(item.soldPriceUgx);
      if (!item.isSold || +price === 0) { return total; }
      return total + price;
    }, 0);
  }

  soldAndUncollected(items: Item[]): number {
    if (!items) return 0;
    return items.reduce( (total, item) => {
      const price = +this.cleanPrice(item.soldPriceUgx) || 0;
      const expectedPrice = +this.cleanPrice('' + item.price);
      if (!item.isSold || +price > 0) { return total; }
      return total + expectedPrice;
    }, 0);
  }

  unsold(items: Item[]): number {
    if (!items) return 0;
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
