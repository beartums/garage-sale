import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../item';
import { DataService } from '../data.service';
import { FilterService } from '../filter.service';
import { faLinkedin, faFacebook, 
  faTwitter, faPinterest, faInstagram} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { formatPercent } from '@angular/common';
@Component({
  selector: 'app-mat-item-tiles',
  templateUrl: './mat-item-tiles.component.html',
  styleUrls: ['./mat-item-tiles.component.css']
})
export class MatItemTilesComponent {

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

  isFiltered(item: Item): boolean {
    return this.fs.isFiltered(item);
  }

  toggleFavorite(item: Item) {
    this.is.toggleFavorite(item, this.as.userId);
  }
  isFavorited(item: Item): boolean {
    return this.is.isFavoritedBy(item, this.as.userId);
  }

  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate(['/mat-item-edit', item.key]);
  }

  formatPrice(price: number = 0): string {
    let priceString = '';
    
    if (price < 10000) {
      priceString = price.toString();
    } else if (price < 1000000) {
      priceString = (price / 1000).toString() + 'K';
    } else {
      priceString = (price / 1000000).toString() + 'M';
    }
    priceString += ' ugx';
    return priceString;
  }

  formatDateAvailable(date: string): string {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let da = new Date(date);
    let now = new Date();
    if (now > da) { return "Now" }
    else { return da.getDate() + ' ' + months[da.getMonth()]  }
  }

  formatItemDetails(item: Item, headers: boolean): string {
    let output = '';

    if (item.price) {
      output += output.length > 0 ? ' &nbsp; | &nbsp; ' : '';
      output += headers ? 'price' : this.formatPrice(item.price);
    }

    if (item.condition) {
      output += output.length > 0 ? ' &nbsp; | &nbsp; ' : '';
      output += headers ? 'condition' : item.condition;
    }

    if (item.dateAvailable) {
      output += output.length > 0 ? ' &nbsp; | &nbsp; ' : '';
      output += headers ? 'available' : this.formatDateAvailable(item.dateAvailable);
    }

    return output;

  }
}
