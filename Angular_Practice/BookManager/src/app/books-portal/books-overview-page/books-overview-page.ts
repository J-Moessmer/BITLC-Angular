import { Component, signal } from '@angular/core';
import { Book } from '../../shared/book';

@Component({
  imports: [],
  selector: 'app-books-overview-page',
  styleUrl: './books-overview-page.css',
  templateUrl: './books-overview-page.html',
})
export class BooksOverviewPage {
    protected books = signal<Book[]>([]);


constructor() {
    this.books.set([
      {
        isbn: '12345',
        title: 'Tierisch gut kochen',
        authors: ['mrs Chimp', 'Mr Gorilla'],
        subtitle: 'Rezepte von Affe bis Zebra',
        imageUrl: 'https://cdn.ng-buch.de/kochen.jpg',
        description: 'Immer lecker und gut',
        createdAt: new Date().toISOString(),
      },
      {
        isbn: '67890',
        title: 'Backen mit Affen',
        authors: ['Orang Utan'],
        imageUrl: 'https://cdn.ng-buch.de/backen.jpg',
        description: 'Tolle Backtipps Für Mensch und Tier',
        createdAt: new Date().toISOString(),
      },
    ]);
  }
}  
