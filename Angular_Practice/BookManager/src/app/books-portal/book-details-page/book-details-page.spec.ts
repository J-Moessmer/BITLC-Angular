import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { inputBinding, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { Mock } from 'vitest';

import { BookStore } from '../../shared/book-store';
import { booksPortalRoutes } from '../books-portal.routes';
import { BookDetailsPage } from './book-details-page';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let getSingleFn: Mock;

  let isbn: WritableSignal<string>;
  const testBook = { isbn: '12345', title: 'Test Book 1', authors: [] };

  beforeEach(async () => {
    isbn = signal('12345');
    getSingleFn = vi.fn().mockReturnValue(of(testBook));

    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter(booksPortalRoutes),
        provideLocationMocks(),
        {
          provide: BookStore,
          useValue: { getSingle: getSingleFn }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [inputBinding('isbn', isbn)]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct book by ISBN', async () => {
    expect(getSingleFn).toHaveBeenCalledExactlyOnceWith('12345');
    expect(component['book']()).toEqual(testBook);
  });

  it('should navigate to the details page', async () => {
    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    await router.navigate(['/books/details/12345']);

    expect(location.path()).toBe('/books/details/12345');
  });

  it('should update the book when ISBN changes', async () => {
    const anotherBook = { isbn: '67890', title: 'Test Book 2', authors: [] };
    getSingleFn.mockReturnValue(of(anotherBook));

    isbn.set('67890');
    await fixture.whenStable();

    expect(getSingleFn).toHaveBeenCalledWith('67890');
    expect(component['book']()).toEqual(anotherBook);
  });
});