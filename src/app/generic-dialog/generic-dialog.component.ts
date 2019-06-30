import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

class GenericDialogData {
  title: string;
  message: string;
  buttons: GenericDialogButton[];
  data: any;
}

class GenericDialogButton {
  text: string;
  returnValue: string;
  closeOnClick: boolean = true;
  type: string
}

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.css']
})
export class GenericDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: GenericDialogData,
            public dialogRef: MatDialogRef<GenericDialogComponent>) {

  }

  closeDialog(value: string) {
    this.dialogRef.close(value);
  }

  getButtonColor(type: string) {
    if (type === 'default') { return 'primary'; }
    if (type === 'warning') { return 'warn'; }
    if (type === 'hilight') { return 'accent'; }
    return '';
  }

  ngOnInit() {
  }

}
