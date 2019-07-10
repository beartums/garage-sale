import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { EmailService } from '../shared/email.service';
import { Email } from '../model/email';

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
  private es: EmailService;
  badEmail: boolean;
  isAdmin: boolean;

  get fromEmailValid() {
    return this.validateEmail(this.fromEmail);
  }


  constructor(private dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 

      this.toEmail = data.toEmail;
      this.fromEmail = data.fromEmail;
      this.subject = data.subject;
      this.message = data.message;
      this.es = data.emailService;
      this.isAdmin = this.es.isAdmin();
    }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  validateEmail(email: string): boolean {
    return this.es.validateEmail(email);
  }

  send() {
    const params: Email = {
      to: this.toEmail,
      from: this.fromEmail,
      subject: this.subject,
      message: this.message
    };

    this.dialogRef.close(params);
  }Ks

}
