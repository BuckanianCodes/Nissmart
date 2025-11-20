import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSummary } from './system-summary';

describe('SystemSummary', () => {
  let component: SystemSummary;
  let fixture: ComponentFixture<SystemSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
