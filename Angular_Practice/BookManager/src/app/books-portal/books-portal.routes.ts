import { Routes } from '@angular/router';

import { BooksOverviewPage } from './books-overview-page/books-overview-page';

import { BookDetailsPage } from './book-details-page/book-details-page';

export const booksPortalRoutes: Routes = [
    {path: 'books',
        component: BooksOverviewPage,
        title: 'Books'
    },
    {
        path: 'books/details/:isbn',
        component: BookDetailsPage,
        title: 'Book Details'   
    },
];