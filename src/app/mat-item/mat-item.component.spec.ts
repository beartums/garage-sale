import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatItemComponent } from './mat-item.component';

describe('MatItemComponent', () => {
  let component: MatItemComponent;
  let fixture: ComponentFixture<MatItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
