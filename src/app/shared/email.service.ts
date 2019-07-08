import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBarRef, MatSnackBar, SimpleSnackBar } from '@angular/material';
import { EmailComponent } from '../email/email.component';
import { Item } from '../model/item';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SEND_EMAIL_URL } from './constants';
import { Email } from '../model/email';
import { Subscribable, Observable, throwError, empty } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dialog: MatDialog, private as: AuthService,
    private http: HttpClient, private snackBar: MatSnackBar) { }

  isAdmin(): boolean {
    return this.as.isAdmin;
  }

  mail(item?: Item, emailObject?: Email) {
    const dialogRef = this.dialog.open(EmailComponent, {
      height: '90%',
      width: '90%',
      data: {
        toEmail: 'garage-sale@griffithnet.com',
        fromEmail: this.as.isLoggedIn ? this.as.user.email : '',
        subject: 'RE: ' + item.name,
        message: '',
        emailService: this,
      }
    });
    let snackBarRef;

    dialogRef.afterClosed().pipe(
      switchMap( emailObj => {
        if (emailObj) {
          snackBarRef = this.snackBar.open('Sending Email...', 'Dismiss');
          return this.sendObject(emailObj).pipe(
            tap( result => {
              this.snackBar.open('Success!!!', 'Dismiss', { duration: 2000 });
              return empty();
            }),
            catchError( err => {
              snackBarRef = this.snackBar.open('Email Failed!!  Sorry.', 'Dismiss');
              return empty();
            })
          );
        } else {
          return empty()
        }
      })
    ).subscribe()
  }

  sendObject(emailDeets: Email): Observable<any> {
    return this.send(
      emailDeets.to,
      emailDeets.from,
      emailDeets.subject,
      emailDeets.message
    );
  }

  send(toEmail: string, fromEmail: string, subject: string, message: string): Observable<any> {
    const params = {
      to: toEmail,
      from: fromEmail,
      subject: subject + ` (FROM: ${fromEmail})`,
      message: message
    };
    const headers = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) 
    };
    const emailObservable = this.http.post(SEND_EMAIL_URL, params, headers);
    // emailObservable.subscribe(
    //   result => console.log(result),
    //   error => console.log(error)
    // );
    this.snackBar.open('Sending Email...', 'Dismiss');
    return emailObservable;
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
