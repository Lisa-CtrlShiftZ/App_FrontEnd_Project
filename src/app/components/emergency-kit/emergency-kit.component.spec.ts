import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyKitComponent } from './emergency-kit.component';

describe('EmergencyKitComponent', () => {
  let component: EmergencyKitComponent;
  let fixture: ComponentFixture<EmergencyKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyKitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
