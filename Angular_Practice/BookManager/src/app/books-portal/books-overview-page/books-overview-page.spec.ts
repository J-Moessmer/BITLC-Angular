import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksOverviewPage } from './books-overview-page';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 books with correct titles', () => {
    const books = component['books']();

    expect(books).toHaveLength(2);
    expect(books[0].title).toBe('Tierisch gut kochen');
    expect(books[1].title).toBe('Backen mit Affen');
  });

  it('should render the correct book titles', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const articleEls = hostEl.querySelectorAll('article');

    expect(articleEls).toHaveLength(2);
    expect(articleEls[0].textContent).toContain('Tierisch gut kochen');
    expect(articleEls[1].textContent).toContain('Backen mit Affen');
  });
});