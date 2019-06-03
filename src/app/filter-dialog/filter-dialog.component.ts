import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../data.service';
import { TagService } from '../tag.service';
import { FilterService, FilterOptions } from '../filter.service';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import * as _ from 'lodash';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {

  faHandHoldingUsd = faHandHoldingUsd;
  FilterOptions = FilterOptions;

  readonly filterOptions = [
    { value: FilterOptions.include, text: 'Include', tooltip: 'ONLY items that are of this type will be included' },
    { value: FilterOptions.exclude, text: 'Exclude', tooltip: 'only items NOT of this type will be included' },
    { value: FilterOptions.ignore, text: 'N/A', tooltip: 'this type will not be used for including OR excluding items' },
  ]

  get soldItemFilter() {
    return !FilterOptions[this.fs.soldItems] ? FilterOptions.ignore : this.fs.soldItems;
  }
  set soldItemFilter(value: FilterOptions) {
    value = FilterOptions[value] ? value : 0;
    this.fs.soldItems = value;
  }

  get featuredItemFilter() {
    return !FilterOptions[this.fs.featuredItems] ? FilterOptions.ignore : this.fs.featuredItems;
  }
  set featuredItemFilter(value: FilterOptions) {
    value = FilterOptions[value] ? value : 0;
    this.fs.featuredItems = value;
  }

  get favoritedItemFilter() {
    return !FilterOptions[this.fs.favoritedItems] ? FilterOptions.ignore : this.fs.favoritedItems;
  }
  set favoritedItemFilter(value: FilterOptions) {
    value = FilterOptions[value] ? value : 0;
    this.fs.favoritedItems = value;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data, private ds: DataService,
          private ts: TagService, private fs: FilterService,
          private dialogRef: MatDialogRef<FilterDialogComponent>,
          private as: AuthService ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    let filters = {
      settings: {
        filters: {
          tagFilters: {
            included: this.fs.chosenTags,
            excluded: this.fs.negativeTags
          },
          soldItemFilter: this.soldItemFilter,
          featuredItemFilter: this.featuredItemFilter,
          favoritedItemFilter: this.favoritedItemFilter
        }
      }
    }
    this.ds.updateUser(this.as.user.uid, filters)
  }

  close() {
    this.dialogRef.close();
  }

  selectTag(tag: string) {
    this.fs.addTagToFilter(tag);
  }
  removeTag(tag: string) {
    this.fs.removeTagFromFilter(tag);
  }
  getHintLabel(itemType: string, filterType: FilterOptions): string {
    if (filterType === FilterOptions.ignore) return 'Items will show whether or not they are ' +itemType.toUpperCase();
    let hint = 'Items will only show if they are';
    hint += filterType == FilterOptions.exclude ? ' NOT' : '';
    hint += ' ' + itemType.toLocaleUpperCase();
    return hint
  }
  getTags(): string[] {
    let tags = this.fs.getAvailableTags(this.fs.chosenTags);
    return this.ts.removeSpecialTags(tags);
  }
  getChosenTags(): string[] {
    return this.ts.removeSpecialTags(this.fs.chosenTags);
  }
  getTagBadgeCount(tag: string = null, chosenTags: string[] = null, negativeTags: string[] = null): number {
    chosenTags = chosenTags || this.fs.chosenTags;
    negativeTags = negativeTags || this.fs.negativeTags;

    const allTags = tag ? _.concat(chosenTags, tag) : chosenTags;
    const count = this.ts.getItemsInTagsCount(allTags, negativeTags);
    return count;
  }
  isTagNegative(tag: string): boolean {
    return this.fs.isTagNegative(tag);
  }
  toggleTagPolarity(tag) {
    this.fs.toggleTagPolarity(tag);
  }


}
