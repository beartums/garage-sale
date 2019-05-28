import { Injectable } from '@angular/core';
import { Item } from './item';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private ds: DataService) { }

  isFavoritedBy(item: Item, userId: string): boolean {
    if (!item.favoritedBy) { return false; }
    return item.favoritedBy.indexOf(userId) > -1;
  }

  toggleFavorite(item: Item, userId: string) {
    if (!item.favoritedBy) {item.favoritedBy = []; }
    const idx = item.favoritedBy.indexOf(userId);
    const oItem = Object.assign({}, item);
    if (idx > -1) {
      item.favoritedBy.splice(idx,1);
    } else {
      item.favoritedBy.push(userId);
    }
    this.ds.updateItem(item.key, item, oItem)
  }
}
