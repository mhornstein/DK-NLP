import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTaggerComponent } from './pos-tagger.component';

describe('PosTaggerComponent', () => {
  let component: PosTaggerComponent;
  let fixture: ComponentFixture<PosTaggerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosTaggerComponent]
    });
    fixture = TestBed.createComponent(PosTaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
