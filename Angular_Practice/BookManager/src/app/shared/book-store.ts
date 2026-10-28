import { Service } from '@angular/core';

import { Book } from './book';

@Service()
export class BookStore {

  #books: Book[] = [
    {
      isbn: '12345',
      title: 'Tierisch gut kochen',
      authors: ['Mrs Chimp', 'Mr Gorilla'],
      subtitle: 'Rezepte von Affe bis Zebra',
      imageUrl: 'https://cdn.ng-buch.de/kochen.jpg',
      description: 'Immer lecker und gut',
      createdAt: new Date().toISOString()
    },
    {
      isbn: '67890',
      title: 'Backen mit Affen',
      subtitle: 'Bananenbrot und mehr',
      authors: ['Orang Utan'],
      imageUrl: 'https://cdn.ng-buch.de/backen.jpg',
      description: 'Tolle Backtipps für Mensch und Tier',
      createdAt: new Date().toISOString()
    }
  ];

  getAll(): Book[] {
    return this.#books;
  }

  getSingle(isbn: string): Book | undefined {
    return this.#books.find(book => book.isbn === isbn);
  }
}