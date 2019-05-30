import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { map } from 'rxjs/operators';

import { Item } from './item';
import { TagService } from './tag.service';
import { Observable, Subscribable } from 'rxjs';
import { FirebaseAuth } from '@angular/fire';
import { User } from './user';
import { Comment } from './comment';

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
  photoURLsUsed = {};
  
  readonly ITEM_ROOT: string = 'Items';
  readonly TAG_ROOT: string = 'Tags';
  readonly USER_ROOT: string = 'Users';
  readonly COMMENT_ROOT: string = 'Comments';

  constructor(private db: AngularFireDatabase, private ts: TagService) { 
    //this.itemsRef = this.getItemsRef();
  }

  addComment(comment: Comment, item: Item, user?: User) {
    this.db.list(this.COMMENT_ROOT).push(comment);
    const updateObj = { commentCount: (item.commentCount || 0) + 1 }
    this.updateItem(item.key, <Item>updateObj, item)
  }

  addItem(item: Item) {
    this.getItemsRef().push(item);
    this.ts.addItemTags(item);
  }

  deleteItem(id: string) {
    this.getItemRef(id).remove();
  }

  getCommentsRef(): AngularFireList<Comment[]> {
    return this.db.list(this.COMMENT_ROOT);
  }

  getItemComments$(id: string): Observable<Comment[]> {
    const comments$: Observable<Comment[]> = this.getItemCommentsRef(id).snapshotChanges().pipe(
      map( changes => {
        return <Comment[]>changes.map(
          c => ( <unknown>{ key: c.payload.key, ...c.payload.val() } )
        )

      })
    )
    return comments$;
  }


  getItemCommentsRef(itemId: string): AngularFireList<Comment[]> {
    return this.db.list(this.COMMENT_ROOT, ref => ref.orderByChild('itemId').equalTo(itemId));
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
        this.photoURLsUsed = <Item[]>items.reduce((URLObj, item) => {
          if (item.pictureUrl && item.pictureUrl > '') { URLObj[item.pictureUrl] = true; }
          return URLObj;
        }, {});
        return <Item[]>items;
      })
    );
    return items$;
  }

  getItemsRef(): AngularFireList<Item> {
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
