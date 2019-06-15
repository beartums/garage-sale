import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EmailComponent } from './email/email.component';
import { Item } from './item';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dialog: MatDialog, private as: AuthService) { }

  mail(item: Item) {
    this.dialog.open(EmailComponent, {
      height: '90%',
      width: '90%',
      data: {
        toEmail: 'garage-sale@griffithnet.com',
        fromEmail: this.as.isLoggedIn ? this.as.user.email : '',
        subject: 'RE: ' + item.name,
        message: ''
      }
    })
  }
}
