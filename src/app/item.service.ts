import { Injectable } from '@angular/core';
import { Item } from './item';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // magical object to overcome the loss of the "showComments" boolean
  // when the item commentsCount is updated on the server
  itemsShowingComments: string[] = []

  constructor(private ds: DataService) { }

  getFavoriteCount(item: Item): number {
    if (!item.favoritedBy) item.favoritedBy = [];
    return item.favoritedBy.length;
  }

  formatPrice(price: number): string {
    let priceString = '';
    
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
    return item.tags.indexOf("sold") > -1;
  }
  isFeatured(item: Item): boolean {
    return item.tags.indexOf("featured") > -1;
  }

}
