import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, Inject, NgZone } from '@angular/core';

import { DataService } from '../data.service';
import { ItemService } from '../item.service';
import { Comment } from '../comment';
import { Item } from '../item';
import { AuthService } from '../auth.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'gs-item-comments',
  templateUrl: './item-comments.component.html',
  styleUrls: ['./item-comments.component.css']
})
export class ItemCommentsComponent implements OnInit {

  @Input() item: Item;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  newComment: string;

  comments$;
  comments: Comment[] = [];


  constructor(private ds: DataService, private is: ItemService, private as: AuthService,
        public dialogRef: MatDialogRef<ItemCommentsComponent>, 
        @Inject(MAT_DIALOG_DATA)public data: any,
        private _ngZone: NgZone) {

        this._ngZone.onStable.pipe( take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
   }

  ngOnInit() {
    this.item = this.data.item;
    this.comments$=this.ds.getItemComments$(this.item.key)
    // .subscribe(comments => {
    //   // replace each comment individually so that the screen doesn't flash and move
    //     let newComments = _.differenceBy(comments, this.comments, 'key');
    //     newComments.forEach( ( comment, idx) => {
    //       this.comments.push(comment);
    //     })
    // })
  }

  ngOnDestroy() {
  }

  ngAfterViewChecked() {
  }

  addComment(comment: string) {
    if ( !comment || comment.trim() === '' ) return;
    const commentObj = new Comment(comment, this.item.key, this.as.user.uid, this.as.user.username);
    this.ds.addComment(commentObj, this.item);
    this.newComment = '';
  }

  cancel() {
    this.dialogRef.close();
  }

  getCommentName(comment: Comment): string {
    const name = comment.userName || 'anonymous';
    return name === '' ? 'anonymous' : name;
  }
  getCommentTime(comment: Comment): string {
    const date = new Date(comment.dateTime);
    return moment(date).format('DD MMM YYYY | hh:mm:ss');
  }

  isLoggedIn(): boolean {
    return this.as.isLoggedIn;
  }

  login() {
    this.as.loginWithGoogle();
  }

  scrollToBottom(container: ElementRef) {
    try {
      container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }
}
