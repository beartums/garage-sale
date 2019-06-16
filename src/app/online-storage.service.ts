import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { map, finalize, tap } from 'rxjs/operators';
import { Asset } from './asset';
import { Item } from './item';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class OnlineStorageService {
  assets$: Observable<Asset[]>;

  uploadingCount = 0;

  readonly ASSET_ROOT = 'Assets';
  readonly ITEM_FOLDER = 'Items';

  constructor(private fs: AngularFireStorage, private db: AngularFireDatabase,
    private snackbar: MatSnackBar) {
    this.assets$ = this.getAssets$();
  }

  private _getAssetsRef(): AngularFireList<Asset> {
    return this.db.list(this.ASSET_ROOT);
  }

  private _getAssetRef(id?: string): AngularFireObject<Asset> {
     return this.db.object(this.ASSET_ROOT + '/' + id);
   }

  getAssets$(): Observable<Asset[]> {
     return this._getAssetsRef().snapshotChanges().pipe(
      map( list => list.map( c => ({ key: c.payload.key, ...c.payload.val() })))
    );
   }

  getAsset$(id: string): Observable<Asset> {
     return this._getAssetRef(id).snapshotChanges().pipe(
       map( c => ({ key: c.payload.key, ...c.payload.val() }))
     )
   }

  unuseAsset(asset: Asset, item: Item) {
    let idx = asset.usedBy.indexOf(item.key);
    if (idx > -1) { 
      asset.usedBy.splice(idx, 1);
    }
    this._updateAsset(asset.key, {usedBy: asset.usedBy});
  }

  useAsset(asset: Asset, item: Item) {
    let idx = asset.usedBy.indexOf(item.key);
    if (idx === -1) { 
      asset.usedBy.push(item.key);
    }
    this._updateAsset(asset.key, {usedBy: asset.usedBy});
  }

  _updateAsset(id: string, asset: Partial<Asset>) {
    this._getAssetRef(asset.key).update(asset);
  }

  uploadFile(uFile: any) {
    const name = uFile.name;
    const file = uFile;
    const filePath = this.ITEM_FOLDER + '/' + name;
    const ref = this.fs.ref(filePath);
    const task = ref.put(file);

    this.snackbar.open(`Uploading ${++this.uploadingCount} file(s)`, 'Dismiss');

    let obs = task.snapshotChanges().pipe(
      finalize(() => {
        if (--this.uploadingCount == 0) {
          this.snackbar.open('Uploads Complete!', 'Dismiss', { duration: 2000 })
        } else {
          this.snackbar.open(`Uploading ${this.uploadingCount} file(s)`, 'Dismiss');
        }
        return ref.getDownloadURL().subscribe(url => this._addAsset(url, name));
      })
    ).subscribe();
   
  }

  private _addAsset(url: string, name?: string) {
    const asset = new Asset(url, name);
    this._putAsset(asset)
  }

  private _putAsset(asset: Asset) {
    this._getAssetsRef().push(asset);
  }


}
