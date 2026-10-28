import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookStore } from '../../shared/book-store';

@Component({
  selector: 'app-book-details-page',
  imports: [RouterLink],
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.css'
})
export class BookDetailsPage {
  #bookStore = inject(BookStore);

  readonly isbn = input.required<string>();
  protected book = computed(() => this.#bookStore.getSingle(this.isbn()));
}