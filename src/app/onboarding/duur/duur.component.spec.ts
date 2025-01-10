import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuurComponent } from './duur.component';

describe('DuurComponent', () => {
  let component: DuurComponent;
  let fixture: ComponentFixture<DuurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
