import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../item';
import { User } from '../user';

@Component({
  selector: 'gs-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  contactForm = this.fb.group({
    email: null,
    name: null,
    reason: null,
    details: null,
    offer: null,
  });

  itemId: string;
  @Input() item: Item;
  @Input() user: User;

  reasons = [
    { value: 'ask', text: 'Ask a Question' },
    { value: 'offer', text: 'Make an offer' },
    { value: 'complain', text: 'Complain about something' },
    { value: 'other', text: 'Other' }
  ];

  constructor(private fb: FormBuilder,
            private ds: DataService,
            private as: AuthService,
            private router: Router,
            private route: ActivatedRoute) {

    this.route.paramMap.subscribe( params => {
      this.itemId = params.get('itemId');

      this.contactForm.get('email').setValue(this.user.email);
      this.contactForm.get('name').setValue(this.user.username);
    })
  }

}
