import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtransferComponent } from './newtransfer.component';

describe('NewtransferComponent', () => {
  let component: NewtransferComponent;
  let fixture: ComponentFixture<NewtransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewtransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewtransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
