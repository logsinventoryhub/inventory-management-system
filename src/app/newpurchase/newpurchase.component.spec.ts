import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpurchaseComponent } from './newpurchase.component';

describe('NewpurchaseComponent', () => {
  let component: NewpurchaseComponent;
  let fixture: ComponentFixture<NewpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewpurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
