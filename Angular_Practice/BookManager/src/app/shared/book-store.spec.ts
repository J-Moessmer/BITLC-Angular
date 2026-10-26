import { TestBed } from '@angular/core/testing';

import { BookStore } from './book-store';

describe('BookStore', () => {
  let service: BookStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of books', () => {
    const books = service.getAll();
    expect(books.length).toBeGreaterThan(0);
  });
});