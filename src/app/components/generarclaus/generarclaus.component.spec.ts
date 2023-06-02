import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarclausComponent } from './generarclaus.component';

describe('GenerarclausComponent', () => {
  let component: GenerarclausComponent;
  let fixture: ComponentFixture<GenerarclausComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarclausComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarclausComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
