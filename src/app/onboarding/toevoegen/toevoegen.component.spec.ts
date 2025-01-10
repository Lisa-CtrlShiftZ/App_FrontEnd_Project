import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToevoegenComponent } from './toevoegen.component';

describe('ToevoegenComponent', () => {
  let component: ToevoegenComponent;
  let fixture: ComponentFixture<ToevoegenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToevoegenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToevoegenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
