import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindSignaturesComponent } from './blind-signatures.component';

describe('BlindSignaturesComponent', () => {
  let component: BlindSignaturesComponent;
  let fixture: ComponentFixture<BlindSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlindSignaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
