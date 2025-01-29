import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyAdjusterComponent } from './supply-adjuster.component';

describe('SupplyAdjusterComponent', () => {
  let component: SupplyAdjusterComponent;
  let fixture: ComponentFixture<SupplyAdjusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyAdjusterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyAdjusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
