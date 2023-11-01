import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerComponent } from './tagger.component';

describe('PosTaggerComponent', () => {
  let component: TaggerComponent;
  let fixture: ComponentFixture<TaggerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaggerComponent],
    });
    fixture = TestBed.createComponent(TaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
