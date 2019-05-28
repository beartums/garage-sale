import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { DataService } from './data.service';
import * as _ from 'lodash';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  chosenTags: string[] = [];   // tags that are filtereid in the positive (only items that DO have this tag)
  negativeTags: string[] = []; // tags that are filtered in the negative (only items that DON'T have this tag)

  constructor(private ts: TagService, private ds: DataService) {

  }

  addTagToFilter(tag: string, addAsNegative?: boolean) {
    let tagSets = [this.chosenTags]
    if (addAsNegative === true) { tagSets.push(this.negativeTags); }

    tagSets.forEach( tagSet => {
      const idx = tagSet.indexOf(tag);
      if (idx === -1) {
        tagSet.push(tag);
      }
    });
  }

  removeTagFromFilter(tag: string) {
    // remove tag from any tag set it might be in
    [this.chosenTags, this.negativeTags].forEach(tagSet => {
      const idx = tagSet.indexOf(tag);
      if (idx > -1) {
        tagSet.splice(idx, 1);
      }
    })
  }

  getAvailableTags(chosenTags: string[] = []): string[] {
    const tags = Object.keys(this.ts.tags);
    return _.difference(tags, chosenTags).sort();
  }

  /**
   * Check whether the passed item is filtered out
   * @param item item to check against filters
   */
  isFiltered(item: Item, chosen: string[] = null, negative: string[] = null): boolean {
    chosen = chosen || this.chosenTags;
    negative = negative || this.negativeTags;
    
    // if no filterTags are chosen, then this item is not filtered
    if (chosen.length === 0) { return false; }
    const positive = _.difference(chosen, this.negativeTags);

    // check the positive tags
    const diff = _.difference(positive, item.tags || []);
    // if if there is any difference in the tags, then this item is filtered out
    if (diff.length > 0) { return true; }

    // check the negative tags
    const isect = _.intersection(negative, item.tags || []);
    if (isect.length > 0) { return true; } 
    return false;
  }

  isTagNegative(tag: string): boolean {
    return this.negativeTags.indexOf(tag) > -1;
  }

  toggleTagPolarity(tag: string) {
    const idx = this.negativeTags.indexOf(tag);

    if (idx < 0) {
      this.negativeTags.push(tag);
    } else {
      this.negativeTags.splice(idx, 1);
    }
  }

}
