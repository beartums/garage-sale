import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataService } from '../data.service';
import { User } from '../user';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: User;
  originalUser: User;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SettingsComponent>,
              private ds: DataService) { 
                this.user = _.cloneDeep(data.user);
                this.originalUser = data.user;
      }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  saveSettings() {
    this.ds.updateUser(this.user.uid,{ settings: this.user.settings});
    this.dialogRef.close();
  }

}
