import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Book } from '../../shared/book';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  readonly book = input.required<Book>();
  readonly like = output<Book>();

  likeBook() {
    this.like.emit(this.book());
  }
}