import { Component, OnInit, ViewChild, NgZone, Input, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { Message } from '../../message';
import { User } from '../../user';

@Component({
  selector: 'gs-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() user: User;

  reply: string;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private _ngZone: NgZone) {
    this._ngZone.onStable.pipe( take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.message) {
      //console.log(changes);
    }
  }

  end() {}

}
