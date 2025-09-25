import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptiontiersComponent } from './subscriptiontiers.component';

describe('SubscriptiontiersComponent', () => {
  let component: SubscriptiontiersComponent;
  let fixture: ComponentFixture<SubscriptiontiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptiontiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptiontiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
