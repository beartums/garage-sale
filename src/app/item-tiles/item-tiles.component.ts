import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../model/item';
import { DataService } from '../shared/data.service';
import { FilterService } from '../shared/filter.service';
import { faLinkedin, faFacebook, 
  faTwitter, faPinterest, faInstagram} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { ItemService } from '../shared/item.service';
import { User } from '../model/user';

@Component({
  selector: 'app-mat-item-tiles',
  templateUrl: './item-tiles.component.html',
  styleUrls: ['./item-tiles.component.css']
})
export class ItemTilesComponent {
  faLinkedin = faLinkedin;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faPinterest = faPinterest;
  faEnvelope = faEnvelope;


  cardCols = 1;
  cardRows = 1;
  gridListCols = 1;

  items$: Observable<Item[]>;
  subscriptions: Subscription[] = [];

  auth: AuthService

  /** Based on the screen size, switch from standard to one column per row */

  constructor(private as: AuthService, private ds: DataService, 
      private fs: FilterService, private router: Router,
      private is: ItemService) {
    this.items$ = this.ds.getItemList$();
    this.auth = as;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isSold(item: Item): boolean {
    const tags = item.tags || [];
    return tags.some( tag => tag.trim().toLowerCase() == 'sold')
  }

  isFiltered(item: Item, user: User = null): boolean {
    user = user || this.as.user;
    return this.fs.isFiltered(item, user);
  }

  sortItems(items: Item[]): Item[] {
    if (!this.fs || !items) { return []; }
    return this.fs.sort(items);
  }

}
