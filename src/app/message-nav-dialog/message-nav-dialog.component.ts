import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Message } from '../message';
import { User } from '../user';

export class MessagesDialogData {
  user: User;
  messages: Message[];
  adminMessages: Message[]
}

@Component({
  selector: 'app-message-nav-dialog',
  templateUrl: './message-nav-dialog.component.html',
  styleUrls: ['./message-nav-dialog.component.css']
})
export class MessageNavDialogComponent {

  messages: Message[] = [];
  adminMessages: Message[]  = [];
  user: User;
  message: Message;

  isHandset: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
         @Inject(MAT_DIALOG_DATA) public data: MessagesDialogData,
          private dialogRef: MatDialogRef<MessageNavDialogComponent>) {
    this.messages = data.messages;
    this.adminMessages = data.adminMessages;
    this.user = data.user;
    this.isHandset$.subscribe(result => this.isHandset = result);
}
  
  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  setMessage(event) {
    this.message = event;
  }

}
