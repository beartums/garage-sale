import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { map, tap, mapTo, switchMap } from 'rxjs/operators';

import { Item } from '../model/item';
import { TagService } from './tag.service';
import { Observable, Subscribable, of, combineLatest, forkJoin } from 'rxjs';
import { User } from '../model/user';
import { Comment } from '../model/comment';
import { FilterService } from './filter.service';
import { Message } from '../model/message';
import { OnlineStorageService } from './online-storage.service';
import { Asset } from '../model/asset';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // magical object.  if assigned, then an item is being edited.  If null, then not;
  // used for communicating to the item-edit page
  itemBeingEdited: Item;
  
  // Object keeping track of used images for the item-editing page just to simplify data entry.
  photoURLsUsed = {};
  photoAssetsUsed = {};

  readonly ITEM_ROOT: string = 'Items';
  readonly TAG_ROOT: string = 'Tags';
  readonly USER_ROOT: string = 'Users';
  readonly COMMENT_ROOT: string = 'Comments';
  readonly MESSAGE_ROOT: string = 'Messages';

  constructor(private db: AngularFireDatabase, private ts: TagService,
            private oss: OnlineStorageService) { 

    // let assets$ = this.oss.assets$;
    // let assetsRef = this.db.list('Assets');
    // assets$.subscribe( assets => {
    //   let goodAssets = assets.filter( asset => asset.reference.indexOf("TEST_DONOTUSE") === -1 );
    //   let badAssets = assets.filter( asset => asset.reference.indexOf("TEST_DONOTUSE") !== -1 );
    //   assetsRef.remove();
    //   goodAssets.forEach( asset => {
    //     assetsRef.set(asset.key, asset)
    //   })
    // })
    //this.itemsRef = this.getItemsRef();
    // ONE TIME THING TO UPDATE THE ASSETS
    // let items$ = this.getItemsRef().snapshotChanges().pipe(
    //   map(items=><Item[]>items.map(c=> (<unknown>{key:c.payload.key, ...c.payload.val()}) ))
    // );
    // let assets$ = this.oss.assets$;
    // combineLatest(items$, assets$).subscribe((results) => {
    //   const items = results[0], assets=results[1];
    //   items.forEach( item => {
    //     if (item.pictureUrl && item.pictureUrl > '') {
    //       for (let i = 0; i < assets.length; i++) {
    //         if (assets[i].reference == item.pictureUrl) {
    //           item.primaryAsset = assets[i];
    //           this.updateItem(item.key, { primaryAsset: assets[i], dateAvailable: item.dateAvailable });
    //           break;
    //         }
    //       }
    //     }
    //   })
    // });
  }

  addComment(comment: Comment, item: Item, user?: User) {
    this.db.list(this.COMMENT_ROOT).push(comment);

  }

  addItem(item: Item) {
    item.lastUpdated = new Date().toISOString();
    item.datePosted = new Date().toISOString();
    this.getItemsRef().push(item);
    this.ts.addItemTags(item);
  }

  addMessage(message: Message) {
    message.entryDateTime = new Date().toISOString();
    this.getMessagesRef().push(message);
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
        let items  = <Item[]>changes.map(
          c => ( { key: c.payload.key, ...c.payload.val() } )
        );
        this.ts.indexAllItems(<Item[]>items);
        this.photoURLsUsed = <Item[]>items.reduce((URLObj, item) => {
          if (item.pictureUrl && item.pictureUrl > '') { URLObj[item.pictureUrl] = true; }
          return URLObj;
        }, {});
        this.photoAssetsUsed =<Item[]>items.reduce((assetObj, item) => {
          if (item.primaryAsset) { assetObj[item.primaryAsset.key] = true; }
          return assetObj;
        }, {});
        return <Item[]>items;
      })
    );
    return items$;
  }

  getItemsRef(): AngularFireList<Item> {
    return this.db.list(this.ITEM_ROOT);
  }

  getMessageRef(id: string): AngularFireObject<Message> {
    return this.db.object(this.MESSAGE_ROOT + '/' + id);
  }
  getMessagesRef(toUserId: string = null): AngularFireList<Message> {
    if (!toUserId) {
      return this.db.list(this.MESSAGE_ROOT);
    } else {
      return this.db.list(this.MESSAGE_ROOT, ref => ref.orderByChild('toUserId').equalTo(toUserId));
    }
  }
  getMessages$(toUserId: string = null): Observable<Message[]> {
    if (toUserId) {
      return this.getMessagesRef(toUserId).snapshotChanges().pipe (
        map( changes => <Message[]>changes.map( c => <unknown>{ key: c.payload.key, ...c.payload.val() } )  )
      );
    } else {
      return of([])
    }
  }

  getUser$(id: string): Observable<User> {
    return this.getUserRef(id).valueChanges()
  }
  getUserRef(id: string): AngularFireObject<User> {
    return this.db.object(this.USER_ROOT + '/' + id);
  }
  getUsers$(): Observable<User[]> {
    return this.getUsersRef().snapshotChanges().pipe(
      map( users => <User[]>users.map( c => (<unknown>{ key: c.payload.key, ...c.payload.val()})))
    )
  }
  getUsersRef(): AngularFireList<User[]> {
    return this.db.list(this.USER_ROOT);
  }
  

  updateItem(id: string, item: Partial<Item>, oldItem?: Item) {
    item.dateAvailable = item.dateAvailable || item.lastUpdated || new Date().toISOString();
    item.lastUpdated = new Date().toISOString();
    this.getItemRef(id).update(item);
    if (!oldItem) return;
    const tagChanges = this.ts.getTagChanges(item.tags, oldItem.tags);
    if (tagChanges === 'both' || tagChanges === 'remove') {this.ts.removeItemTags(oldItem)}
    if (tagChanges === 'both' || tagChanges === 'add') {this.ts.addItemTags(<Item>item)}
  }

  updateUser(id: string, user: any) {
    user.lastLogin = new Date().toUTCString();
    this.getUserRef(id).update(user);
  }

  setUserData(user: User) {
    user.firstLogin = new Date().toUTCString();
    user.lastLogin = user.firstLogin;
    this.db.object(this.USER_ROOT + '/' + user.uid).set(user);
  }

  updateMessage(id: string, msg: any) {
    this.getMessageRef(id).update(msg);
  }

  deleteMessage(id: string) {
    // TODO: do we want to do something if there are messages that refer to this one?
    this.getMessageRef(id).remove()
  }


}
