import { Routes } from '@angular/router';

import { BookCreatePage } from './book-create-page/book-create-page';

export const booksAdminRoutes: Routes = [
  { path: 'admin', redirectTo: 'admin/create' },
  {
    path: 'admin/create',
    component: BookCreatePage,
    title: 'Create Book'
  },
];