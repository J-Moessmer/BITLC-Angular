import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookStore } from '../../shared/book-store';

@Component({
  selector: 'app-book-create-page',
  imports: [FormField, FormRoot],
  templateUrl: './book-create-page.html',
  styleUrl: './book-create-page.css'
})
export class BookCreatePage {
  #bookStore = inject(BookStore);
  #router = inject(Router);

  readonly #bookFormData = signal({
    isbn: '',
    title: '',
    subtitle: '',
    authors: [''],
    description: '',
    imageUrl: '',
  });

  protected readonly bookForm = form(
    this.#bookFormData,
    (path) => { /* TODO Schema */ },
    {
      submission: {
        action: async (bookForm) => {
          const value = bookForm().value();
          const authors = value.authors.filter(author => !!author);

          const newBook: Book = {
            ...value,
            authors,
            createdAt: new Date().toISOString()
          };

          const createdBook = await this.#bookStore.create(newBook);
          await this.#router.navigate(['/books', 'details', createdBook.isbn]);
        }
      }
    }
  );

  addAuthorField() {
    this.bookForm.authors().value.update((authors) => [...authors, '']);
  }

}