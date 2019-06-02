import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {faEnvelope, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import { Message } from '../message';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { User } from '../user';
import * as moment from 'moment';

@Component({
  selector: 'gs-message-sidebar',
  templateUrl: './message-sidebar.component.html',
  styleUrls: ['./message-sidebar.component.css']
})
export class MessageSidebarComponent implements OnInit {

  @Input() messages: Message[];
  @Input() adminMessages: Message[]
  @Input() user: User;

  @Output() message: EventEmitter<Message> = new EventEmitter();

  faEnvelope = faEnvelope;
  faEnvelopeOpen = faEnvelopeOpen;
  
  userMessageBundles: any[];

  constructor() { }

  ngOnInit() {
    this.userMessageBundles = [
      { user: this.user, userName: this.user.displayName, messages: this.messages || []},
      { user: this.user, userName: 'Admin', messages: this.adminMessages || []},
    ]
  }

  showMessage(message: Message) {
    this.message.emit(message)
  }

  readMessages(messages: Message[]): Message[] {
    return messages.filter( msg => msg.isRead) || [];
  }

  unreadMessages(messages: Message[]): Message[] {
    return messages.filter( msg => !msg.isRead) || [];
  }
  formatDate(message: Message): string {
    const date = new Date(message.entryDateTime);
    return moment(date).format('DD MMM YYYY | hh:mm:ss');
  }

}
