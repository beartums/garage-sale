import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { MatItemListComponent } from './mat-item-list.component';

describe('MatItemListComponent', () => {
  let component: MatItemListComponent;
  let fixture: ComponentFixture<MatItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatItemListComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
