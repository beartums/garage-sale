import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {faEnvelope, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import * as moment from 'moment';
import { DataService } from 'src/app/data.service';
import { Observable, of } from 'rxjs';
// import { DataService } from 'src/app/data.service';

@Component({
  selector: 'gs-message-sidebar',
  templateUrl: './message-sidebar.component.html',
  styleUrls: ['./message-sidebar.component.css']
})
export class MessageSidebarComponent implements OnInit {

  @Input() messages$: Observable<Message[]>;
  @Input() adminMessages$: Observable<Message[]>;
  @Input() user: User;

  @Output() message: EventEmitter<Message> = new EventEmitter();

  faEnvelope = faEnvelope;
  faEnvelopeOpen = faEnvelopeOpen;

  userMessageBundles: any[];

  messages: Message[];
  adminMessages: Message[];

  constructor(private ds: DataService) { 
  }

  ngOnInit() {
    this.userMessageBundles = [
      { user: this.user, userName: this.user.displayName, messages$: this.messages$ || of([])},
      { user: this.user, userName: 'Admin', messages$: this.adminMessages$},
      this.adminMessages$.subscribe( msgs => {
        this.adminMessages = msgs;
      })
    ];

  }

  ngOnChange(changes: SimpleChanges) {
    // if (changes.messages$) {
    //   this.userMessageBundles[0].messages = changes.messages$.currentValue;
    // }
    // if (changes.adminMessages$) {
    //   this.userMessageBundles[1].messages = changes.adminMessages$.currentValue;
    // }
  }

  showMessage(message: Message) {
    this.message.emit(message);
   if (!message.isRead) this.toggleRead(message);
  }

  readMessages(messages: Message[]): Message[] {
    return messages.filter( msg => msg.isRead) || [];
  }

  unreadMessages(messages: Message[]): Message[] {
    return messages.filter( msg => !msg.isRead) || [];
  }
  formatDate(message: Message): string {
    const date = new Date(message.entryDateTime);
    return moment(date).format('DD MMM | hh:mm');
  }
  getTooltip(message: Message): string {
    let rtn = '';
    let date = new Date(message.entryDateTime);
    rtn += moment(date).format('DD MMM YYYY | HH:mm:ss');
    rtn += ' | ' + message.fromName;
    rtn += ' | ' + message.reason;
    return rtn;
  }
  // deleteMessage(msg: Message) {
  //   return;
  // }
  toggleRead(msg: Message) {
    const readState = { isRead: !msg.isRead };
    this.ds.updateMessage(msg.key, readState);
  }
  

}
