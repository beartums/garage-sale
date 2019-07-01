import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../model/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        this.item$ = this.ds.getItemRef(this.itemId).snapshotChanges().pipe(
          map( c => <Item>{ key: c.payload.key, ...c.payload.val()})
        )
      });
    
   }

  ngOnInit() {
  }

}
