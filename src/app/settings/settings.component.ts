import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { DataService } from '../data.service';
import { User } from '../user';
import * as _ from 'lodash';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { FilterService } from '../filter.service';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  readonly separatorKeyCodes = [ ENTER, SPACE ];
  readonly ALL_CATEGORIES = 'ALL';
  user: User;
  originalUser: User;

  removable = true;
  selectable = true;
  addOnBlur = true;
  filteredTags: Observable<string[]>;
  chipControl = new FormControl();

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SettingsComponent>,
              private ds: DataService, private fs: FilterService, private ts: TagService) {

        this.user = _.cloneDeep(data.user);
        this.originalUser = data.user;
        if (!this.user.settings.newItemEmailTags) { this.user.settings.newItemEmailTags = [] }

        // Filter will show all tags matching the input that are NOT already selected
        this.filteredTags = this.chipControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => {
            const availableTags = this.getAvailableTags(this.user.settings.newItemEmailTags, this.ts.getAllTags());
            if (tag) {
              return this._filter(tag, availableTags);
            } else {
              return availableTags;
            }
          })
        );
      }

  ngOnInit() {
  }

  _filter(value: string, tags: string[]): string[] {
    const filterValue = value.toLowerCase();
    // return all tags that have the typed characters anywhere in the name
    return tags.filter(tag => tag.toLowerCase().indexOf(filterValue) > -1);
  }

  getAvailableTags(selectedTags: string[], allTags: string[]): string[] {
    if (selectedTags.indexOf(this.ALL_CATEGORIES) > -1) { return [] }

    const availableTags: string[] = _.without(allTags, ...selectedTags);
    // ADD THE ALL Option
    availableTags.unshift(this.ALL_CATEGORIES);
    return availableTags;
  }

  addTagEvent(event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = (event.value || '').trim();
      if (value !== '') {this.addTag(value); }
      this.chipControl.setValue(null);
      if (input) {
        input.value = '';
      }
    }
  }

  addTag(input: string) {
    const tag = input !== this.ALL_CATEGORIES ? this.ts.formatTag(input) : input;
    const availableTags = this.getAvailableTags(this.user.settings.newItemEmailTags, this.ts.getAllTags())

    // don't let users choose tags that don't exist or are not available
    const idx =  availableTags.indexOf(tag);
    if (idx < 0) { return; }

    const isEmpty = tag.trim() === '';
    const isAll = tag === this.ALL_CATEGORIES;
    if (isAll) {
      this.user.settings.newItemEmailTags = [ this.ALL_CATEGORIES ];
    } else if (!isEmpty) {
      this.user.settings.newItemEmailTags.push(tag);
    }

  }

  addSelected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.chipInput.nativeElement.value = '';
    this.chipControl.setValue(null);
  }

  cancel() {
    this.dialogRef.close();
  }

  removeTag(tag: string) {
    const idx = this.user.settings.newItemEmailTags.indexOf(tag);
    if (idx > -1) { this.user.settings.newItemEmailTags.splice(idx, 1) }
  }

  saveSettings() {
    this.ds.updateUser(this.user.uid, { settings: this.user.settings});
    this.dialogRef.close();
  }

}
