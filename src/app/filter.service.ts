import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { DataService } from './data.service';
import * as _ from 'lodash';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  chosenTags: string[] = [];

  constructor(private ts: TagService, private ds: DataService) {

  }

  addTagToFilter(tag: string) {
    const idx = this.chosenTags.indexOf(tag);
    if (idx === -1) {
      this.chosenTags.push(tag);
    }
  }

  removeTagFromFilter(tag: string) {
    const idx = this.chosenTags.indexOf(tag);
    if (idx > -1) {
      this.chosenTags.splice(idx, 1);
    }
  }

  getAvailableTags(chosenTags: string[] = []): string[] {
    const tags = Object.keys(this.ts.tags);
    return _.difference(tags, chosenTags).sort();
  }

  isFiltered(item: Item): boolean {
    // if no filterTags are chosen, then this item is not filtered
    if (this.chosenTags.length === 0) { return false; }
    const isect = _.intersection(this.chosenTags, item.tags || []);
    // if all the chosen tags are in the item, then it is not filtered
    if (isect.length == this.chosenTags.length) { return false; }
    return true;
  }

}
