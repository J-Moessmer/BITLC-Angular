import { Component, input } from '@angular/core';

import { Book } from '../../shared/book';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  readonly book = input.required<Book>();
}