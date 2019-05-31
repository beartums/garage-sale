import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../item';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-item',
  templateUrl: './show-item.component.html',
  styleUrls: ['./show-item.component.css']
})
export class ShowItemComponent implements OnInit {

  item$: Observable<Item>;
  itemId: string ;

  constructor(private ds: DataService, private router: Router,
    private route: ActivatedRoute) {
      route.paramMap.subscribe( params => {
        this.itemId = params.get('itemId');
        this.item$ = this.ds.getItemRef(this.itemId).valueChanges();
      })
   }

  ngOnInit() {
  }

}
