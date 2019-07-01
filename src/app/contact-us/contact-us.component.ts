import { Component, Input, Inject, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { AuthService } from '../shared/auth.service';
import { Item } from '../model/item';
import { User } from '../model/user';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { Message } from '../model/message';

@Component({
  selector: 'gs-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  contactForm = this.fb.group({
    email: null,
    name: null,
    reason: null,
    details: null,
    offer: null,
  });

  itemId: string;
  @Input() item: Item;
  @Input() user: User;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  reasons = [
    { value: 'ask', text: 'Ask a Question' },
    { value: 'offer', text: 'Make an offer' },
    { value: 'complain', text: 'Complain about something' },
    { value: 'other', text: 'Other' }
  ];

  constructor(private fb: FormBuilder,
            private ds: DataService,
            private as: AuthService,
            private dialogRef: MatDialogRef<ContactUsComponent>,
            @Inject(MAT_DIALOG_DATA) public data,
            private _ngZone: NgZone) {

    this.user = data.user;
    this.item = data.item;

    this.contactForm.get('email').setValue(this.user.email);
    this.contactForm.get('name').setValue(this.user.username);

    this._ngZone.onStable.pipe( take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  send() {
    let message = new Message();
    message.fromEmail = this.contactForm.controls['email'].value;
    message.fromName = this.contactForm.controls['name'].value;
    message.fromUserId = this.user.uid;
    message.reason = this.contactForm.controls['reason'].value;
    message.message = this.contactForm.controls['details'].value;
    message.entryDateTime = new Date().toISOString();
    message.toUserId = '<admin>';
    message.user = this.user || null;
    message.item = this.item || null;
    this.ds.addMessage(message);
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
