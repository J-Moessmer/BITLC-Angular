import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mock } from 'vitest';

import { routes } from '../../app.routes';
import { BookStore } from '../../shared/book-store';
import { BookCreatePage } from './book-create-page';

describe('BookCreatePage', () => {
  let component: BookCreatePage;
  let fixture: ComponentFixture<BookCreatePage>;
  let createFn: Mock;

  const validBook = {
    isbn: '1234567890123',
    title: 'Test Book',
    subtitle: '',
    authors: ['Test Author'],
    description: 'Test description',
    imageUrl: 'https://example.org/img.jpg',
    createdAt: '',
  };

  beforeEach(async () => {
    createFn = vi.fn().mockResolvedValue(validBook);

    await TestBed.configureTestingModule({
      imports: [BookCreatePage],
      providers: [
        {
          provide: BookStore,
          useValue: { create: createFn }
        },
        provideLocationMocks(),
        provideRouter(routes),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new author field', async () => {
    fixture.nativeElement.querySelector('fieldset button').click();
    await fixture.whenStable();

    const authorInputs = fixture.nativeElement.querySelectorAll('fieldset input[type="text"]');
    expect(authorInputs).toHaveLength(2);
  });

  it('should submit form data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15'));

    component['bookForm']().value.set(validBook);
    const formEl = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    expect(createFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        ...validBook,
        createdAt: '2026-01-15T00:00:00.000Z'
      })
    );

    vi.useRealTimers();
  });

  it('should filter out empty author data', () => {
    component['bookForm'].authors().value.set(
      ['', 'Test Author', '']
    );

    const formEl = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    expect(createFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ authors: ['Test Author'] })
    );
  });

  it('should navigate to created book', async () => {
    const location = TestBed.inject(Location);

    const formEl = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(location.path()).toBe('/books/details/1234567890123');
  });
});