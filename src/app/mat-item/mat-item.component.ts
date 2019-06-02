import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { FilterService } from '../filter.service';
import { TagService } from '../tag.service';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ItemCommentsComponent } from '../item-comments/item-comments.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../user';
import { ContactUsComponent } from '../contact-us/contact-us.component';


@Component({
  selector: 'gs-item-card',
  templateUrl: './mat-item.component.html',
  styleUrls: ['./mat-item.component.css']
})
export class MatItemComponent implements OnInit {

  @Input() item: Item = new Item();
  showComments = false;

  constructor(private ts: TagService, private fs: FilterService,
            private as: AuthService, private is: ItemService,
            private ds: DataService, private router: Router,
            public dialog: MatDialog) { }

  ngOnInit() {
  }

  countFaves(item: Item) {
    return this.is.getFavoriteCount(item);
  }

  isAdmin(): boolean {
    return this.as.isAdmin;
  }
  isLoggedIn(): boolean {
    return this.as.isLoggedIn;
  }
  login() {
    this.as.loginWithGoogle();
  }

  isSold(item: Item): boolean {
    if (!item) return false; // in case this item is null because it's being refreshed async
    const tags = item.tags || [];
    return tags.some( tag => tag.trim().toLowerCase() == 'sold')
  }

  isFiltered(item: Item, user: User = null): boolean {
    user = user || this.as.user;
    return this.fs.isFiltered(item, user);
  }

  toggleFavorite(item: Item) {
    this.is.toggleFavorite(item, this.as.userId);
  }

  toggleComments(item: Item) {
    let dialogRef: MatDialogRef<ItemCommentsComponent> = this.dialog.open(ItemCommentsComponent, {
      height: '90%',
      width: '90%',
      data: { item: item },
    })
  }

  getEmailForItem(item: Item): string {
    let email = '';
    email += 'MailTo: someone@somewhere.com';
    email += '?subject=Check it out: ' + item.name;
    email += '&body=Thought you might be interested in this:%0D%0A%0D%0A';
    email += item.name + ' -- ';
    email += item.description;
    email += '%0D%0A%0D%0Ahttps://garage-sale.griffithnet.com/show-item/' + item.key;
    
    return email;
  }

  isShowingComments(item: Item): boolean {
    return this.is.isShowingComments(item);
  }

  isFavorited(item: Item): boolean {
    return this.is.isFavoritedBy(item, this.as.userId);
  }

  editItem(item: Item) {
    this.ds.itemBeingEdited = item;
    this.router.navigate(['/mat-item-edit', item.key]);
  }

  favoriteTooltip(tooltipType: 'add' | 'remove', isLoggedIn: boolean ): string {
    if (!isLoggedIn) { return 'Login to manage your favorites' };
    if (tooltipType === 'add') { return 'Click/tap to add to favorites' };
    return 'Click/tap to remove from favorites';
  }

  formatPrice(price: number = 0): string {
    return this.is.formatPrice(price);
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

  contactUs(item: ItemService) {
    const dialogRef: MatDialogRef<ContactUsComponent> = this.dialog.open(ContactUsComponent, {
      height: '90%',
      width: '90%',
      data: {
        item: item,
        user: this.as.user
      }
    });
  }


}
