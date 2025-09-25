import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductspreadsheetComponent } from './productspreadsheet.component';

describe('ProductspreadsheetComponent', () => {
  let component: ProductspreadsheetComponent;
  let fixture: ComponentFixture<ProductspreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductspreadsheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductspreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
