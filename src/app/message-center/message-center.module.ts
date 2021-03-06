import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageComponent } from './message/message.component';
import { MessageNavDialogComponent } from './message-center-dialog/message-center-dialog.component';
import { MessageSidebarComponent } from './message-sidebar/message-sidebar.component';
import { MaterialModule } from '../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [ MessageComponent, MessageNavDialogComponent, MessageSidebarComponent],
  imports: [
    CommonModule, FormsModule, MaterialModule, FontAwesomeModule
  ],
  exports: [
    MessageNavDialogComponent
  ]
})
export class MessageCenterModule { }
