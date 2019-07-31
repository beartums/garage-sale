import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { map, finalize, tap, take, combineLatest, mapTo } from 'rxjs/operators';
import { Asset } from '../model/asset';
import { Item } from '../model/item';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Injectable({
  providedIn: 'root'
})
export class OnlineStorageService {
  assets$: Observable<Asset[]>;
  storageRef: any;

  uploadingCount = 0;

  readonly ASSET_ROOT = 'Assets';
  readonly ITEM_FOLDER = 'Items';

  constructor(private fs: AngularFireStorage, private db: AngularFireDatabase,
    private snackbar: MatSnackBar) {
    this.assets$ = this.getAssets$();
    firebase.initializeApp(environment.firebaseConfig);
    this.storageRef = firebase.app().storage().ref();
  }

  private _getAssetsRef(): AngularFireList<Asset> {
    return this.db.list(this.ASSET_ROOT);
  }

  private _getAssetRef(id?: string): AngularFireObject<Asset> {
    return this.db.object(this.ASSET_ROOT + '/' + id);
  }
  private _getAssetByName$(name?: string): Observable<Asset[]> {
    return this.db.list(this.ASSET_ROOT, ref => ref.orderByChild('reference').equalTo(name))
        .snapshotChanges().pipe(
          map( changes => <Asset[]>changes.map( c => <unknown>({ key: c.payload.key, ...c.payload.val() }) ))
        );
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

  _fetchAndWriteAssets() {
     // build an array of assets from the actual stored items
    const storage = firebase.app().storage();
    storage.ref(this.ITEM_FOLDER).listAll().then(result => {
      const assetPromises = result.items.map( item => {
        //console.log(item);
        return this.getAsset(item);
      } )
      Promise.all(assetPromises).then(assets => assets.forEach(asset => this._putAsset(asset)));
    }, err => {
      console.log(err);
      return err;
    });
  }
  _deleteAllAssetReferences() {
    let assetsRef = this._getAssetsRef();
    assetsRef.remove();
  }

  resetAssets() {
    // Get the list of all assets currently in the storage bucket
    this._deleteAllAssetReferences();
    this._fetchAndWriteAssets()
    // Promise.all(assetPromises).then( assets => {
    //   console.log(assets);
    //   const assetsRef = this._getAssetsRef();
    //   assets.forEach(asset => {
    //     assetsRef.push(<Asset>asset);
    //   });
    // });
  }

  getAsset(ref: any) {
    return ref.getDownloadURL().then(url => new Asset(url, ref.name));
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

    let url$: Observable<string>;

    task.snapshotChanges().pipe(
      finalize(() => {
        this._decrementSnackbar();
        this.assets$.pipe(
          map((assets: Asset[]) => assets.find((asset) => asset.reference === name)),
          combineLatest(ref.getDownloadURL()),
          tap( ([asset, url]) => this._persistAsset(url, name, asset) ),
          take(1)
        ).subscribe();
      })
    ).subscribe();

  }

  private _decrementSnackbar() {
    if (--this.uploadingCount === 0) {
      this.snackbar.open('Uploads Complete!', 'Dismiss', { duration: 5000 })
    } else {
      this.snackbar.open(`Uploading ${this.uploadingCount} file(s)`, 'Dismiss');
    }
  }
  private _persistAsset(url: string, name?: string, asset?: any) {
    if (asset) {
      asset.url = url;
      this._setAsset(asset)
    } else {
      const newAsset = new Asset(url, name);
      this._putAsset(newAsset);
    }

  }

  private _putAsset(asset: Asset) {
    this._getAssetsRef().push(asset);
  }
  private _setAsset(asset: Asset) {
    this._getAssetsRef().set(asset.key, asset);
  }


}
