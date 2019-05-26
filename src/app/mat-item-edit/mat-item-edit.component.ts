import { Component } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Location } from '@angular/common';

import { Item } from '../item';
import { ITEM_PICS } from '../itemPics';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-mat-item-edit',
  templateUrl: './mat-item-edit.component.html',
  styleUrls: ['./mat-item-edit.component.css']
})
export class MatItemEditComponent {
  itemEditForm = this.fb.group({
    itemName: null,
    itemDescription: [null, Validators.required],
    itemPrice: [null, Validators.required],
    itemCondition: [null, Validators.required],
    itemDateAvailable: [null, Validators.required],
    itemPictureUrl: [null]
  });

  itemTags: string[] = [];
  itemKey = '';
  tagsBeingEdited = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  selected: string;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE]
  readonly itemPics = ITEM_PICS;


  constructor(private fb: FormBuilder, private ds: DataService, 
    private router: Router,  private route: ActivatedRoute,
    private _location: Location) {
    
   }

  ngOnInit() {

    this.route.paramMap.subscribe( params => {
      this.itemKey = params.get('key');
    })

    const item = Object.assign(new Item(),this.ds.itemBeingEdited);

    this.itemEditForm.controls['itemName'].setValue(item.name || '');
    this.itemEditForm.controls['itemPrice'].setValue(item.price || '');
    this.itemEditForm.controls['itemCondition'].setValue(item.condition || '');
    this.itemEditForm.controls['itemDescription'].setValue(item.description || '');
    this.itemEditForm.controls['itemDateAvailable'].setValue(item.dateAvailable || '');
    this.itemTags = item.tags || [];
    this.itemEditForm.controls['itemPictureUrl'].setValue(item.pictureUrl || '');
    this.selected = item.pictureUrl || '';

  }

  ngOnDestroy() {
    this.ds.itemBeingEdited = null;
  }

  save() {
    let item = new Item();
    item.name = this.itemEditForm.controls['itemName'].value || '';
    item.price = this.itemEditForm.controls['itemPrice'].value || '';
    item.description = this.itemEditForm.controls['itemDescription'].value || '';
    item.condition = this.itemEditForm.controls['itemCondition'].value || '';
    item.dateAvailable = this.itemEditForm.controls['itemDateAvailable'].value || '';
    item.tags = this.itemTags || [];
    item.pictureUrl = this.itemEditForm.controls['itemPictureUrl'].value || '';

    if (!this.ds.itemBeingEdited) {
      this.ds.addItem(item);
    } else {
      this.ds.updateItem(this.ds.itemBeingEdited.key, item, this.ds.itemBeingEdited);
    }
    // this.router.navigate(['/mat-item-list/']);
    this._location.back()
  }

  cancel() {
    // this.router.navigate(['/mat-item-list/']);
    this._location.back()
  }

  addTag(event: MatChipInputEvent) {
    const input = event.input;
    const value = (event.value || '').trim();

    const isTag = this.itemTags.indexOf(value) > -1;
    const isEmpty = value.trim() == '';
    if (!isTag && !isEmpty) {
      this.itemTags.push(value);
    }
    if (input) {
      input.value = '';
    }

  }
  removeTag(tag: string) {
    const idx = this.itemTags.indexOf(tag);
    if (idx >= 0) {
      this.itemTags.splice(idx, 1);
    }
  }

}
