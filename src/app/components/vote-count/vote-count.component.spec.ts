import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCountComponent } from './vote-count.component';

describe('VoteCountComponent', () => {
  let component: VoteCountComponent;
  let fixture: ComponentFixture<VoteCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
