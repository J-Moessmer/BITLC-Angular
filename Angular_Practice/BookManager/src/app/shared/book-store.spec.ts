import { HttpErrorResponse, HttpResourceRef } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BookStore } from './book-store';
import { Book } from './book';

describe('BookStore', () => {
  let service: BookStore;
  let httpTesting: HttpTestingController;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    });
    service = TestBed.inject(BookStore);
    httpTesting = TestBed.inject(HttpTestingController);
    injector = TestBed.inject(Injector);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all books from API', async () => {
    const mockBooks: Partial<Book>[] = [
      { isbn: '123', title: 'Book 1' },
      { isbn: '456', title: 'Book 2' }
    ];

    let booksResource!: HttpResourceRef<Book[]>;
    runInInjectionContext(injector, () => {
      booksResource = service.getAll();
    });

    TestBed.tick();

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);

    await TestBed.inject(ApplicationRef).whenStable();
    expect(booksResource.value()).toEqual(mockBooks);
  });

  it('should fetch a single book by ISBN', async () => {
    const mockBook: Partial<Book> = { isbn: '123', title: 'Test Book' };

    let bookResource!: HttpResourceRef<Book | undefined>;
    runInInjectionContext(injector, () => {
      bookResource = service.getSingle(() => '123');
    });

    TestBed.tick();

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockBook);

    await TestBed.inject(ApplicationRef).whenStable();
    expect(bookResource.value()).toEqual(mockBook);
  });

  it('should delete a book', () => {
    let success = false;
    service.remove('123').subscribe(() => success = true);

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books/123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(success).toBe(true);
  });

  it('should handle server errors', async () => {
    let booksResource!: HttpResourceRef<Book[]>;
    runInInjectionContext(injector, () => {
      booksResource = service.getAll();
    });

    TestBed.tick();

    const req = httpTesting.expectOne('https://api1.angular-buch.com/books');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    await TestBed.inject(ApplicationRef).whenStable();
    expect(booksResource.error()).toBeInstanceOf(HttpErrorResponse);
    expect((booksResource.error() as HttpErrorResponse).status).toBe(500);
  });
});