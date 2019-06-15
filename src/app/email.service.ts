import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EmailComponent } from './email/email.component';
import { Item } from './item';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SEND_EMAIL_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dialog: MatDialog, private as: AuthService,
    private http: HttpClient) { }

  mail(item: Item) {
    const dialogRef = this.dialog.open(EmailComponent, {
      height: '90%',
      width: '90%',
      data: {
        toEmail: 'garage-sale@griffithnet.com',
        fromEmail: this.as.isLoggedIn ? this.as.user.email : '',
        subject: 'RE: ' + item.name,
        message: ''
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        //this.sendObject(result)
      }
    })
  }

  sendObject(emailDeets: any) {
    this.send(
      emailDeets.toEmail,
      emailDeets.fromEmail,
      emailDeets.subject,
      emailDeets.message
    )
  }
  send(toEmail: string, fromEmail: string, subject: string, message: string) {
    const params = {
      to: toEmail,
      from: fromEmail,
      subject: subject,
      message: message
    };
    const headers = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    this.http.post(SEND_EMAIL_URL, params, headers).subscribe(
      result => console.log(result),
      error => console.log(error));
  }
}
