import { Component, inject, signal } from '@angular/core';

import { Book } from '../../shared/book';
import { BookCard } from '../book-card/book-card';
import { BookStore } from '../../shared/book-store';

@Component({
  selector: 'app-books-overview-page',
  imports: [BookCard],
  templateUrl: './books-overview-page.html',
  styleUrl: './books-overview-page.css',
})
export class BooksOverviewPage {
  #bookStore = inject(BookStore);

  protected books = signal<Book[]>([]);
  protected likedBooks = signal<Book[]>([]);

  constructor() {
    this.books.set(this.#bookStore.getAll());
  }

  addLikedBook(newLikedBook: Book) {
    const foundBook = this.likedBooks().find(
      (b) => b.isbn === newLikedBook.isbn
    );

    if (!foundBook) {
      this.likedBooks.update((likedBooks) => [
        ...likedBooks,
        newLikedBook
      ]);
    }
  }

  clearLikedBooks() {
    this.likedBooks.set([]);
  }
}