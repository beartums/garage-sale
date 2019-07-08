import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Location } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { DataService } from '../shared/data.service';
import { FilterService } from '../shared/filter.service';
import { Item } from '../model/item';
import { OnlineStorageService } from '../shared/online-storage.service';
import { Asset } from '../model/asset';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';


@Component({
  selector: 'app-mat-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit{
  itemEditForm = this.fb.group({
    itemName: null,
    itemDescription: [null, Validators.required],
    itemPrice: [null, Validators.required],
    itemCondition: [null, Validators.required],
    itemDateAvailable: [null, Validators.required],
    itemPrimaryAsset: [null],
    itemSoldTo: [null],
    itemSoldToEmail: [null],
    itemSoldPriceUgx: [null],
    itemSoldDate: [null],
    itemIsSold: [null],
    itemIsHidden: [null],
    itemIsFeatured: [null],
    //itemPriority: [null],
    itemUseDefaultTooltip: [null],
    itemAdditionalAssets: [null],
  });

  itemTags: string[] = [];
  itemKey = '';
  tagsBeingEdited = false;
  isSold: boolean;

  selectable = true;
  addOnBlur = true;
  removable = true;

  assets$: Observable<Asset[]>

  priority: number;
  selectedAsset: Asset;
  primaryPic: Asset;
  additionalPics: Asset[] = [];

  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];
//  readonly itemPics = ITEM_PICS;
  chipControl = new FormControl();
  filteredTags: Observable<string[]>;

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  get allAssets() {
    if (!this.primaryPic) { return this.additionalPics || []; };
    return [ this.primaryPic ].concat(this.additionalPics || []);
  }

  constructor(private fb: FormBuilder, private ds: DataService,
    private router: Router,  private route: ActivatedRoute,
    private _location: Location, private fs: FilterService,
    private _ngZone: NgZone, private oss: OnlineStorageService,
    private dialog: MatDialog) {

      this._ngZone.onStable.pipe( take(1)).subscribe(() => this.autosize.resizeToFitContent(true));

      this.assets$ = oss.getAssets$().pipe(
        map( assets => this.photoUrlsSort(assets))
      );

      this.filteredTags = this.chipControl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => tag ? this._filter(tag) : this.fs.getAvailableTags(this.itemTags).slice()));
   }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.itemKey = params.get('key');
    });

    const item = Object.assign(new Item(), this.ds.itemBeingEdited);

    this.itemEditForm.controls['itemName'].setValue(item.name || '');
    this.itemEditForm.controls['itemPrice'].setValue(item.price || '');
    this.itemEditForm.controls['itemCondition'].setValue(item.condition || '');
    this.itemEditForm.controls['itemDescription'].setValue(item.description || '');
    this.itemEditForm.controls['itemDateAvailable'].setValue(item.dateAvailable || new Date().toISOString().split('T')[0]);
    this.itemEditForm.controls['itemIsHidden'].setValue(item.isHidden || false);
    this.itemEditForm.controls['itemIsFeatured'].setValue(item.isFeatured || false);
    this.itemEditForm.controls['itemIsSold'].setValue(item.isSold || false);
    this.isSold = item.isSold || false;
    this.itemEditForm.controls['itemSoldDate'].setValue(item.soldDate || '');
    this.itemEditForm.controls['itemSoldPriceUgx'].setValue(item.soldPriceUgx || '');
    this.itemEditForm.controls['itemSoldToEmail'].setValue(item.soldToEmail || '');
    this.itemEditForm.controls['itemSoldTo'].setValue(item.soldTo || '');
    //this.itemEditForm.controls['itemPriority'].setValue(item.priority || 0);
    this.itemEditForm.controls['itemUseDefaultTooltip'].setValue(item.priority || true);
    this.itemTags = item.tags || [];
    this.itemEditForm.controls['itemPrimaryAsset'].setValue(item.primaryAsset);
    this.primaryPic = item.primaryAsset;
    this.itemEditForm.controls['itemAdditionalAssets'].setValue(item.additionalAssets || []);
    this.additionalPics = item.additionalAssets || [];
    this.selectedAsset = this.primaryPic;
  }

  ngOnDestroy() {
    this.ds.itemBeingEdited = null;
  }

  save() {
    const item = new Item();
    item.name = this.itemEditForm.controls['itemName'].value || null;
    item.price = this.itemEditForm.controls['itemPrice'].value || null;
    item.description = this.itemEditForm.controls['itemDescription'].value || null;
    item.condition = this.itemEditForm.controls['itemCondition'].value || '';
    item.dateAvailable = this.itemEditForm.controls['itemDateAvailable'].value || new Date().toISOString();
    item.isHidden = this.itemEditForm.controls['itemIsHidden'].value || false;
    item.isFeatured = this.itemEditForm.controls['itemIsFeatured'].value || false;
    item.isSold = this.itemEditForm.controls['itemIsSold'].value || false;
    item.soldDate = this.itemEditForm.controls['itemSoldDate'].value || '';
    item.soldPriceUgx = this.itemEditForm.controls['itemSoldPriceUgx'].value || '';
    item.soldToEmail= this.itemEditForm.controls['itemSoldToEmail'].value || '';
    item.soldTo = this.itemEditForm.controls['itemSoldTo'].value || '';
    item.useDefaultTooltip = this.itemEditForm.controls['itemUseDefaultTooltip'].value || false;
    item.primaryAsset = this.itemEditForm.controls['itemPrimaryAsset'].value || null;
    item.additionalAssets = this.itemEditForm.controls['itemAdditionalAssets'].value || [];
    item.tags = this.itemTags || [];

    if ((!item.name || !item.price || !item.description) && !item.isHidden ) return;

    if (!this.ds.itemBeingEdited) {
      this.ds.addItem(item);
    } else {
      this.ds.updateItem(this.ds.itemBeingEdited.key, item, this.ds.itemBeingEdited);
    }
    this._location.back();
  }

  cancel() {
    this._location.back();
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
    const tag = input.trim().toLowerCase();

    const isTag = this.itemTags.indexOf(tag) > -1;
    const isEmpty = tag.trim() === '';
    if (!isTag && !isEmpty) {
      this.itemTags.push(tag);
    }

  }

  addSelected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.chipInput.nativeElement.value = '';
    this.chipControl.setValue(null);
  }

  isPhotoUsed(asset: Asset): boolean {
    return this.ds.photoURLsUsed[asset.url] === true;
  }
  isAssetUsed(asset: Asset): boolean {
    return this.ds.photoAssetsUsed[asset.key] === true;

  }
  isMatchingAsset(a1: Asset, a2: Asset): boolean {
    if (!a1 || !a2) {return false; }
    return a1.key === a2.key;
  }

  onFileSelected(event) {
    const files: File[] = Array.from(event.target.files);
    const oversizedFiles = files.filter( file => file.size > (30*1024) );
    const oversizeAmount = oversizedFiles.reduce((amt, file: File) => file.size - (30*1024) + amt, 0);
    const oversizeMb = Math.floor(oversizeAmount/1024);
    if (oversizedFiles.length > 0) {
      const dialogData = {
        title: 'Oversized File Warning',
        message: `${oversizedFiles.length} of the file(s) you are uploading seem to be bigger than the maximum 30KB suggested 
              size.  Total oversize amount is about ${oversizeMb}KB. Are you sure you want to continue?`,
        buttons: [
          {text: 'Yes, Damnit!', returnValue: 'YES', type: 'warning'},
          {text: 'OMG! No!', returnValue: 'NO', type: 'default'}
        ]
      }
      const dialogRef = this.dialog.open(GenericDialogComponent, {
        width: '60%',
        height: '40%',
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response === 'YES') {
          this.uploadFiles(files)
        }
      })
    } else {
      this.uploadFiles(files);
    }
    event.target.value = null;
  }

  uploadFiles(files: File[]) {
    for (let i = 0; i < files.length; i++) {
      this.oss.uploadFile(files[i]);
    }
  }

  photoUrlsSort(assets: Asset[] = []): Asset[] {
    return assets.sort((a, b) => {
      if (this.isAssetUsed(a) && !this.isAssetUsed(b)) { return 1; }
      if (!this.isAssetUsed(a) && this.isAssetUsed(b)) { return -1; }
      if (a.reference < b.reference) { return -1; }
      if (a.reference > b.reference) { return 1; }
      return 0;
    })
  }

  removeTag(tag: string) {
    const idx = this.itemTags.indexOf(tag);
    if (idx >= 0) {
      this.itemTags.splice(idx, 1);
    }
  }

  selectPic(asset: Asset) {
    this.selectedAsset = asset;
  }

  delete() {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '300px',
      height: '300px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to permanently delete the item: ${this.ds.itemBeingEdited.name}?`,
        buttons: [
          {text: 'Yes, Damnit!', returnValue: 'YES', type: 'warning'},
          {text: 'OMG! No!', returnValue: 'NO', type: 'default'}
        ]
      }
    });

    dialogRef.afterClosed().subscribe(response => {
        if (response === 'YES') {
          this.ds.deleteItem(this.itemKey);
          this._location.back();
        }
      });
  }

  canBeDeleted(): boolean {
    return this.itemKey !== 'new' ? true : false;
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    // return all tags that have the typed characters anywhere in the name
    return this.fs.getAvailableTags(this.itemTags).filter(tag => tag.toLowerCase().indexOf(filterValue) > -1);
  }

}
