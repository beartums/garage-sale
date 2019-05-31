import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCommentsDialogComponent } from './item-comments-dialog.component';

describe('ItemCommentsDialogComponent', () => {
  let component: ItemCommentsDialogComponent;
  let fixture: ComponentFixture<ItemCommentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCommentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCommentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
