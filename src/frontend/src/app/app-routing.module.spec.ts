import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app-routing.module';

describe('AppRoutingModule', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    router = TestBed.inject(Router);
  });

  it('should navigate to the default path to TaggerComponent', async () => {
    await router.navigate(['']);
    expect(router.url).toBe('/tagger');
  });

  it('should navigate to TaggerComponent', async () => {
    await router.navigate(['tagger']);
    expect(router.url).toBe('/tagger');
  });

  it('should navigate to AboutComponent', async () => {
    await router.navigate(['about']);
    expect(router.url).toBe('/about');
  });

  it('should navigate to HistoryComponent', async () => {
    await router.navigate(['history']);
    expect(router.url).toBe('/history');
  });

  it('should navigate to TaggerComponent when an unknown route is provided', async () => {
    await router.navigate(['unknownRoute']);
    expect(router.url).toBe('/tagger');
  });
});
