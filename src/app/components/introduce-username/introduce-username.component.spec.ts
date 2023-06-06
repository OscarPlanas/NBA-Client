import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroduceUsernameComponent } from './introduce-username.component';

describe('IntroduceUsernameComponent', () => {
  let component: IntroduceUsernameComponent;
  let fixture: ComponentFixture<IntroduceUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroduceUsernameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroduceUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
