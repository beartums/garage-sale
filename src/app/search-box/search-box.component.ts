import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'mat-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Output() searchFilter$Change: EventEmitter<Observable<string>> = new EventEmitter<Observable<string>>();
  @Output() filterChange: EventEmitter<string|null> = new EventEmitter<string>();

  @Input() debounce: number = null;
  @Input() showCancel: boolean = true;
  @Input() cancelIcon: string = "cancel";
  @Input() searchIcon: string = "search"
  @Input() width = null;
  @Input() allowCollapse = false;
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  filter$: Subject<string> = new Subject<string>();
  pipedFilter$: Observable<string|null>;
  filterSubscription: Subscription;
  filter: string;

  filterText: string; // used by view

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let filter$ = this.filter$.pipe(distinctUntilChanged());
    if (this.debounce) { filter$ = filter$.pipe(debounceTime(this.debounce)); }
    this.searchFilter$Change.emit(filter$);
    this.pipedFilter$ = filter$;
    this.filterSubscription = this.pipedFilter$.subscribe( filter => this.filterChange.emit(filter.trim()) )
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
  }

  updateFilter(filter: string) {
    this.filter$.next(filter);
  }

  cancel() {
    this.updateFilter('');
    this.filterText = '';
    
  }

}
