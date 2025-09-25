import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerlogindialogComponent } from './customerlogindialog.component';

describe('CustomerlogindialogComponent', () => {
  let component: CustomerlogindialogComponent;
  let fixture: ComponentFixture<CustomerlogindialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerlogindialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerlogindialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
