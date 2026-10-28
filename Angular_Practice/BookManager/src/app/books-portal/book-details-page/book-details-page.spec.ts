import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { inputBinding, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { BookStore } from '../../shared/book-store';
import { booksPortalRoutes } from '../books-portal.routes';
import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let bookStore: BookStore;

  let isbn: WritableSignal<string>;

  beforeEach(async () => {
    isbn = signal('12345');

    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter(booksPortalRoutes),
        provideLocationMocks(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [inputBinding('isbn', isbn)]
    });
    component = fixture.componentInstance;
    bookStore = TestBed.inject(BookStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct book by ISBN', async () => {
    const expectedBook = bookStore.getSingle('12345');
    expect(component['book']()).toEqual(expectedBook);
  });

  it('should navigate to the details page', async () => {
    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    await router.navigate(['/books/details/12345']);

    expect(location.path()).toBe('/books/details/12345');
  });

  it('should update the book when ISBN changes', async () => {
    isbn.set('67890');
    await fixture.whenStable();

    const expectedBook = bookStore.getSingle('67890');
    expect(component['book']()).toEqual(expectedBook);
  });
});