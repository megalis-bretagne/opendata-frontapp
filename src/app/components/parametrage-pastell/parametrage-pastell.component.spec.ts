import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametragePastellComponent } from './parametrage-pastell.component';

describe('ParametragePastellComponent', () => {
  let component: ParametragePastellComponent;
  let fixture: ComponentFixture<ParametragePastellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametragePastellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametragePastellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
