import { Component, signal } from '@angular/core';

import { Book } from '../../shared/book';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-books-overview-page',
  imports: [BookCard],
  templateUrl: './books-overview-page.html',
  styleUrl: './books-overview-page.css',
})
export class BooksOverviewPage {
  protected books = signal<Book[]>([]);

  constructor() {
    this.books.set([
      {
        isbn: '12345',
        title: 'Tierisch gut kochen',
        authors: ['Mrs Chimp', 'Mr Gorilla'],
        subtitle: 'Rezepte von Affe bis Zebra',
        imageUrl: 'https://cdn.ng-buch.de/kochen.jpg',
        description: 'Immer lecker und gut',
        createdAt: new Date().toISOString(),
      },
      {
        isbn: '67890',
        title: 'Backen mit Affen',
        subtitle: 'Bananenbrot und mehr',
        authors: ['Orang Utan'],
        imageUrl: 'https://cdn.ng-buch.de/backen.jpg',
        description: 'Tolle Backtipps für Mensch und Tier',
        createdAt: new Date().toISOString(),
      },
    ]);
  }
}