import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SEND_EMAIL_URL } from '../constants';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  toEmail: string = 'eric.griffith@oneacrefund.com';
  fromEmail: string;
  subject: string;
  message: string;


  constructor(private dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) data, private http: HttpClient) { 

      //this.toEmail = data.toEmail;
      this.fromEmail = data.fromEmail;
      this.subject = data.subject;
      this.message = data.message
    }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  send() {
    const params: URLSearchParams = new URLSearchParams();
    const headers = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    
    params.set('to', this.toEmail);
    params.set('from', this.fromEmail);
    params.set('subject', this.subject);
    params.set('message', this.message);
    this.http.post(SEND_EMAIL_URL, params, headers).subscribe(
      result => console.log(result),
      error => console.log(error));
    this.dialogRef.close()
  }

}
