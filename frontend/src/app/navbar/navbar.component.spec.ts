import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have links for "Tagger", "History", and "About"', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(3);

    const linkTexts = links.map((link) => link.nativeElement.textContent);
    expect(linkTexts).toContain('Tagger');
    expect(linkTexts).toContain('History');
    expect(linkTexts).toContain('About');
  });
});
