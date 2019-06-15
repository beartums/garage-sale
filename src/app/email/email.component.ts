import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { SEND_EMAIL_URL } from '../constants';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  toEmail: string;
  fromEmail: string;
  subject: string;
  message: string;
  badEmail: boolean;

  get fromEmailValid() {
    return this.validateEmail(this.fromEmail);
  }


  constructor(private dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) data, private http: HttpClient) { 

      this.toEmail = data.toEmail;
      this.fromEmail = data.fromEmail;
      this.subject = data.subject;
      this.message = data.message;
    }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  send() {
    let params = {
      to: this.toEmail,
      from: this.fromEmail,
      subject: this.subject,
      message: this.message
    };
    const headers = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    
    // params.set('to', this.toEmail);
    // params.set('from', this.fromEmail);
    // params.set('subject', this.subject);
    // params.set('message', this.message);
    this.http.post(SEND_EMAIL_URL, params, headers).subscribe(
      result => console.log(result),
      error => console.log(error));
    this.dialogRef.close(params)
  }

}
