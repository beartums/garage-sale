import { Injectable } from '@angular/core';
import { Item } from './item';
import { DataService } from './data.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PATHS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // magical object to overcome the loss of the "showComments" boolean
  // when the item commentsCount is updated on the server
  itemsShowingComments: string[] = []

  items$: Observable<Item[]>;
  favoritedByUsers = {};

  constructor(private ds: DataService,
    private router: Router) { 
    // we have the ids of users favriting items, but this populates a reference
    // object with the current users favoriting
    this.items$ = this.ds.getItemList$();
    combineLatest(this.items$, this.ds.getUsers$()).pipe(
      map(results => {
      this.favoritedByUsers = {};
      const items = results[0], users = results[1];
      items.forEach( item => {
        if (item.favoritedBy) {
          item.favoritedBy.forEach( userId => {
            if (!this.favoritedByUsers[item.key]) { this.favoritedByUsers[item.key] = []; }
            const fbUser = users.find( user => user.key === userId );
            if (fbUser) { this.favoritedByUsers[item.key].push(fbUser); }
          })
        }
      })
    })
    ).subscribe() // subscribe to start the flow
    
  }
  
  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate([PATHS.editUrl, item.key]);
  }

  getFavoriteCount(item: Item): number {
    if (!item.favoritedBy) item.favoritedBy = [];
    return item.favoritedBy.length;
  }

  formatPrice(sPrice: string): string {
    let priceString = '';
    sPrice = ('' + sPrice).replace(/[^0-9]/gi, '');
    const price = +sPrice;
    
    if (price !== 0 && !price) return priceString;
    if (price < 10000) {
      priceString = price.toString();
    } else if (price < 1000000) {
      priceString = (price / 1000).toString() + 'K';
    } else {
      priceString = (price / 1000000).toString() + 'M';
    }
    priceString += ' ugx';
    return priceString;
  }

  isFavoritedBy(item: Item, userId: string): boolean {
    if (!item) { return false; }
    if (!item.favoritedBy) { return false; }
    return item.favoritedBy.indexOf(userId) > -1;
  }
  
  isAvailable(item: Item): boolean {
    const itemDate = new Date(item.dateAvailable);
    const today = new Date();
    return today >= itemDate;
  }

  toggleFavorite(item: Item, userId: string) {
    if (!item.favoritedBy) { item.favoritedBy = []; }
    const idx = item.favoritedBy.indexOf(userId);
    const oItem = Object.assign({}, item);
    if (idx > -1) {
      item.favoritedBy.splice(idx,1);
    } else {
      item.favoritedBy.push(userId);
    }
    this.ds.updateItem(item.key, item, oItem)
  }

  toggleShowingComments(item: Item) {
    const idx = this.itemsShowingComments.indexOf(item.key);
    if (idx < 0) { this.itemsShowingComments.push(item.key) }
    else { this.itemsShowingComments.splice(idx, 1) }
  }

  isShowingComments(item: Item): boolean {
    return this.itemsShowingComments.indexOf(item.key) > -1;
  }

  isSold(item: Item): boolean {
    if (item.isSold === false) { return false; };
    if (item.isSold === true) { return true; }
    if (!item.tags) return false;
    return item.tags.indexOf("sold") > -1;
  }
  isFeatured(item: Item): boolean {
    if (item.isFeatured === false) { return false };
    if (item.isFeatured === true) { return true; }
    if (!item.tags) return false;
    return item.tags.indexOf("featured") > -1;
  }

}
