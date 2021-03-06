import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { DataService } from './data.service';
import * as _ from 'lodash';
import { Item } from '../model/item';
import { ItemService } from './item.service';
import { User } from '../model/user';

export enum FilterOptions {
  'include', 'exclude', 'ignore'
}
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  chosenTags: string[] = [];   // tags that are filtereid in the positive (only items that DO have this tag)
  negativeTags: string[] = []; // tags that are filtered in the negative (only items that DON'T have this tag)

  soldItems: FilterOptions = FilterOptions.exclude;
  featuredItems: FilterOptions = FilterOptions.ignore;
  favoritedItems: FilterOptions = FilterOptions.ignore;
  availableItems: FilterOptions = FilterOptions.ignore;

  isPaused = false;

  get isCurrentlyFiltering(): boolean {
    if (this.isPaused) { return false; }
    if (this.chosenTags.length > 0) { return true; }
    if (this.negativeTags.length > 0) { return true; }
    if (this.soldItems !== FilterOptions.ignore) { return true; }
    if (this.featuredItems !== FilterOptions.ignore) { return true; }
    if (this.favoritedItems !== FilterOptions.ignore) { return true; }
    if (this.availableItems !== FilterOptions.ignore) { return true; }
  }


  constructor(private ts: TagService, private is: ItemService) {

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
  isFiltered(item: Item, user: User = null, chosen: string[] = null, negative: string[] = null): boolean {

    // if filtering is paused, do not filter anything
    if (this.isPaused) { return false; }

    // if the item is null, go ahead and filter it
    if (!item) { return true; }

    if (item.isHidden) { return true; }

    chosen = chosen || this.chosenTags;
    negative = negative || this.negativeTags;

    if (this.favoritedItems === FilterOptions.include || this.favoritedItems === FilterOptions.exclude) {
      const isFavorited = this.is.isFavoritedBy(item, user.uid);
      if (user && isFavorited && this.favoritedItems === FilterOptions.exclude) { return true; }
      if (user && !isFavorited && this.favoritedItems === FilterOptions.include) { return true; }
    }

    if (this.soldItems === FilterOptions.include || this.soldItems === FilterOptions.exclude) {
      const isSold = this.is.isSold(item);
      if (isSold && this.soldItems === FilterOptions.exclude) { return true; }
      if (!isSold && this.soldItems === FilterOptions.include) { return true; }
    }

    if (this.featuredItems === FilterOptions.exclude || this.featuredItems === FilterOptions.include) {
      const isFeatured = this.is.isFeatured(item);
      if (isFeatured && this.featuredItems === FilterOptions.exclude) { return true; }
      if (!isFeatured && this.featuredItems === FilterOptions.include) { return true; }
    }

    if (this.availableItems === FilterOptions.exclude || this.availableItems === FilterOptions.include) {
      const isAvailable = this.is.isAvailable(item);
      if (isAvailable && this.availableItems === FilterOptions.exclude) { return true; }
      if (!isAvailable && this.availableItems === FilterOptions.include) { return true; }
    }

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
  toggleFilterState() {
    this.isPaused = ! this.isPaused;
  }

  compareForSort(item1: Item, item2: Item): number {
    if (this.is.isSold(item1)) { return 1 };
    if (this.is.isSold(item2)) { return -1 };
    if (this.is.isFeatured(item1) && !this.is.isFeatured(item2)) { return -1 };
    if (this.is.isFeatured(item2) && !this.is.isFeatured(item1)) { return 1 };
    const date1 = new Date(item1.datePosted || item1.lastUpdated);
    const date2 = new Date(item2.datePosted || item2.lastUpdated);
    if (date1 > date2) { return -1 };
    if (date2 > date1) { return 1 };
    return 0;
  }

  sort(items: Item[] = []): Item[] {
    if (!items) return [];
    return items.sort( (a, b) => this.compareForSort(a, b));
  }

}
