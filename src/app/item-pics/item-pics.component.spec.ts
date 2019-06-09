import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPicsComponent } from './item-pics.component';

describe('ItemPicsComponent', () => {
  let component: ItemPicsComponent;
  let fixture: ComponentFixture<ItemPicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
