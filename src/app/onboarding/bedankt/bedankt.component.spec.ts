import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedanktComponent } from './bedankt.component';

describe('BedanktComponent', () => {
  let component: BedanktComponent;
  let fixture: ComponentFixture<BedanktComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedanktComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedanktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
