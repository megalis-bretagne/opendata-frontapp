import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueBlancheComponent } from './marque-blanche.component';

describe('MarqueBlancheComponent', () => {
  let component: MarqueBlancheComponent;
  let fixture: ComponentFixture<MarqueBlancheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarqueBlancheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarqueBlancheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
