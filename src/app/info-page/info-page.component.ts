import { Component, OnInit } from '@angular/core';
import { FAQS } from '../shared/constants';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  faqs$ = of(FAQS);

  constructor(private dialogRef: MatDialogRef<InfoPageComponent>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close()
  }

  toggleFaq(faq) {
    faq.show = !faq.show;
  }

}
