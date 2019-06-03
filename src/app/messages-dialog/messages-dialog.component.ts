import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../user';
import { Observable } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export class MessagesDialogData {
  user: User;
  messages: Message[];
  adminMessages: Message[]
}

@Component({
  selector: 'app-messages-dialog',
  templateUrl: './messages-dialog.component.html',
  styleUrls: ['./messages-dialog.component.css']
})
export class MessagesDialogComponent implements OnInit {

  messages: Message[];
  adminMessages: Message[];
  user: User;
  message: Message;

  constructor(@Inject(MAT_DIALOG_DATA) public data: MessagesDialogData,
          private dialogRef: MatDialogRef<MessagesDialogComponent>) {
    this.messages = data.messages;
    this.adminMessages = data.adminMessages;
    this.user = data.user;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
