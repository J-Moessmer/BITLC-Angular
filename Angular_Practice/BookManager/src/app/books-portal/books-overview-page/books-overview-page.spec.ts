import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { resource } from '@angular/core';

import { BooksOverviewPage } from './books-overview-page';
import { booksPortalRoutes } from '../books-portal.routes';
import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

describe('BooksOverviewPage', () => {
  let component: BooksOverviewPage;
  let fixture: ComponentFixture<BooksOverviewPage>;

  const mockBooks: Partial<Book>[] = [
    { isbn: '1234', title: 'Tierisch gut kochen' },
    { isbn: '5678', title: 'Backen mit Affen' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOverviewPage],
      providers: [
        provideRouter(booksPortalRoutes),
        {
          provide: BookStore,
          useFactory: () => ({
            getAll: () => resource({
              loader: () => Promise.resolve(mockBooks),
            })
          })
        }
      ]
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
    const books = component['books'].value();

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

  it('should render a BookCard component for each book', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const cardEls = hostEl.querySelectorAll('app-book-card');
    expect(cardEls).toHaveLength(2);
  });

  it('should correctly pass book data to BookCards', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const cardEls = hostEl.querySelectorAll('app-book-card');

    expect(cardEls[0].textContent).toContain('Tierisch gut kochen');
    expect(cardEls[1].textContent).toContain('Backen mit Affen');
  });

  it('should display all books for empty search term', () => {
    component['searchTerm'].set('');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(2);
  });

  it('should filter books based on the search term', () => {
    component['searchTerm'].set('Affe');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should filter books ignoring case sensitivity', () => {
    component['searchTerm'].set('AFFEN');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Backen mit Affen');
  });

  it('should return an empty array if no book matches', () => {
    component['searchTerm'].set('unbekannter Titel');

    const books = component['filteredBooks']();
    expect(books).toHaveLength(0);
  });

  it('should load BooksOverviewPage for /books', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/books', BooksOverviewPage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('Books');
  });
});