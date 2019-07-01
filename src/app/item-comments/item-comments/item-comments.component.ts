import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, Inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { Comment } from '../../model/comment';
import { DataService } from '../../data.service';
import { Item } from '../../model/item';
import { ItemService } from '../../item.service';


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
    this.comments$ = this.ds.getItemComments$(this.item.key);
  }


  addComment(comment: string) {
    if ( !comment || comment.trim() === '' ) { return; }
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
