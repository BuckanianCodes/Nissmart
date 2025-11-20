import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFunds } from './transfer-funds';

describe('TransferFunds', () => {
  let component: TransferFunds;
  let fixture: ComponentFixture<TransferFunds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferFunds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferFunds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
