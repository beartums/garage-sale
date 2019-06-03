import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ItemCommentsComponent } from './item-comments/item-comments.component';
import { ItemCommentsDialogComponent } from './item-comments-dialog/item-comments-dialog.component';

@NgModule({
  declarations: [
    ItemCommentsComponent,
    ItemCommentsDialogComponent
  ],
  imports: [
    CommonModule, FormsModule, MaterialModule
  ]
})
export class ItemCommentsModule { }
