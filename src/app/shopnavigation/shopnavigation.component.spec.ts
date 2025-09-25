import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopnavigationComponent } from './shopnavigation.component';

describe('ShopnavigationComponent', () => {
  let component: ShopnavigationComponent;
  let fixture: ComponentFixture<ShopnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopnavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
