import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../model/item';

@Component({
  selector: 'app-item-pics',
  templateUrl: './item-pics.component.html',
  styleUrls: ['./item-pics.component.css']
})
export class ItemPicsComponent implements OnInit {

  @Input() item: Item;

  selectedPic: string;

  get allPics(): string[] {
    if (!this.item) { return []; }
    const pUrl = !this.item.pictureUrl || this.item.pictureUrl=='' ? [] : [ this.item.pictureUrl ];
    const aUrls = this.item.additionalPics || [];
    return pUrl.concat(aUrls);

  }

  constructor(private dialogRef: MatDialogRef<ItemPicsComponent>,
          @Inject(MAT_DIALOG_DATA) public data) {

    this.item = data.item;
    this.selectedPic = this.item.pictureUrl;
}

  ngOnInit() {
  }

  selectPic(pic: string) {
    this.selectedPic = pic;
  }

  close() {
    this.dialogRef.close();
  }

}
