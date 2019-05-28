import { Injectable } from '@angular/core';
import { Item } from './item';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  tags: any = {};

  constructor() { }

  indexAllItems( items: Item[] ) {
    this.tags = {};
    items.forEach( (item) => {
        this.addItemTags(item);
      }
    )
  }

  addItemTags(item: Item, tags?: string[]) {
    tags = tags || item.tags || [];
    tags.forEach( tag => {
      tag = this.formatTag(tag);
      if (!this.tags[tag]) this.tags[tag] = [];
      let foundItem = this.findItemInList(item,this.tags[tag]);
      if (!foundItem) this.tags[tag].push(item);
    });
  }
  removeItemTags(item: Item, tags?: string[]) {
    tags = tags || item.tags || [];
    tags.forEach( tag => {
      tag = this.formatTag(tag);
      if (!this.tags[tag]) this.tags[tag] = [];
      let foundItem = this.findItemInList(item, this.tags[tag]);
      // if the item is in the tag array, remove it
      if (foundItem) this.tags[tag].splice(this.tags[tag].indexOf(foundItem), 1);
      // if there are o more items with this tag, remove it
      if (this.tags[tag].legth == 0) delete this.tags[tag];
    });
  }
  findItemInList(item: Item, items: Item[]= []): Item {
    return items.find( i => {
      return i.key == item.key;
    })
  }
  formatTag(tag: string): string {
    return tag.trim().toLowerCase();
  }

  getItemsInTagsCount(positive: string[], negative: string[] = []): number {
    let items: Item[] = [];
    positive = _.without(positive, ...negative);
    positive.forEach( (tag, idx) => {
      // If this is the first tag, take all of them, otherwise the intersection of previous results with this one
      items = idx === 0 ? this.tags[tag] : _.intersection(items, this.tags[tag]);
    });

    negative.forEach( (tag, idx) => {
      items = _.without(items, ...this.tags[tag]);
    })
    return items.length;
  }

  getTagChanges(tags: string[] = [], oldTags: string[] = []): 'remove' | 'add' | 'both' | null {
    const oTags = oldTags.map( tag => this.formatTag(tag));
    const nTags = tags.map( tag => this.formatTag(tag));
    const xTags = _.difference(oTags, nTags);
    if (xTags.length == 0) { return null; } // no difference in tags
    const isAdded = xTags.some( tag => oTags.indexOf(tag) == -1);
    const isRemoved = xTags.some( tag => nTags.indexOf(tag) == -1);
    if (isAdded && isRemoved) { return 'both'; };
    if (isAdded) { return 'add'; };
    if (isRemoved) { return 'remove'; };
    return null;
  }
  
}
