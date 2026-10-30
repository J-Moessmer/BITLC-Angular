import { inject, Service } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

import { Book } from './book';

@Service()
export class BookStore {
  #http = inject(HttpClient);
  #apiUrl = 'https://api1.angular-buch.com';

  getAll(): HttpResourceRef<Book[]> {
    return httpResource<Book[]>(
      () => `${this.#apiUrl}/books`,
      { defaultValue: [] }
    );
  }

  getSingle(isbn: () => string): HttpResourceRef<Book | undefined> {
    return httpResource<Book>(
      () => `${this.#apiUrl}/books/${isbn()}`
    );
  }

  remove(isbn: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/books/${isbn}`);
  }

  create(book: Book): Promise<Book> {
    return firstValueFrom(
      this.#http.post<Book>(`${this.#apiUrl}/books`, book)
    );
  }
}