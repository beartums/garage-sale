import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { map } from 'rxjs/operators';

import { Item } from './item';
import { TagService } from './tag.service';
import { Observable, Subscribable } from 'rxjs';
import { FirebaseAuth } from '@angular/fire';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  // itemsRef: AngularFireList<any>;
  // itemRef: AngularFireObject<Item>;
  // userRef: AngularFireObject<FirebaseAuth>;

  // magical object.  if assigned, then an item is being edited.  If null, then not;
  // used for communicating to the item-edit page
  itemBeingEdited: Item;
  
  readonly ITEM_ROOT: string = 'Items';
  readonly TAG_ROOT: string = 'Tags';
  readonly USER_ROOT: string = 'Users';

  constructor(private db: AngularFireDatabase, private ts: TagService) { 
    //this.itemsRef = this.getItemsRef();
  }

  addItem(item: Item) {
    this.getItemsRef().push(item);
    this.ts.addItemTags(item);
  }

  deleteItem(id: string) {
    this.getItemRef(id).remove();
  }

  getItemRef(id: string): AngularFireObject<Item> {
    return this.db.object(this.ITEM_ROOT + '/' + id);
  }

  // getItem$(id: string) {
  //   return this.getItemRef(id).valueChanges();
  // }

  getItemList$(): Observable<Item[]> {
    const items$: Observable<Item[]> = this.getItemsRef().snapshotChanges().pipe(
      map( changes => {
        let items  = changes.map(
          c => ( <Item>{ key: c.payload.key, ...c.payload.val() } )
        );
        this.ts.indexAllItems(<Item[]>items);
        return <Item[]>items;
      })
    );
    return items$;
  }

  getItemsRef() {
    return this.db.list(this.ITEM_ROOT);
  }

  updateItem(id: string, item: Item, oldItem?: Item) {
    this.getItemRef(id).update(item);
    const tagChanges = this.ts.getTagChanges(item.tags, oldItem.tags);
    if (tagChanges === 'both' || tagChanges === 'remove') {this.ts.removeItemTags(oldItem)};
    if (tagChanges === 'both' || tagChanges === 'add') {this.ts.addItemTags(item)};
  }

  setUserData(user: User) {
    this.db.object(this.USER_ROOT + '/' + user.uid).set(user);
  }


}
