import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersignupdialogComponent } from './customersignupdialog.component';

describe('CustomersignupdialogComponent', () => {
  let component: CustomersignupdialogComponent;
  let fixture: ComponentFixture<CustomersignupdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersignupdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersignupdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
