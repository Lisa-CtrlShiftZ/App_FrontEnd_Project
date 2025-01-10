import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieetComponent } from './dieet.component';

describe('DieetComponent', () => {
  let component: DieetComponent;
  let fixture: ComponentFixture<DieetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
