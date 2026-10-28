import { Routes } from '@angular/router';

import { HomePage } from './home-page/home-page';
import { booksPortalRoutes } from './books-portal/books-portal.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomePage,
    title: 'BookManager'
  },
  ...booksPortalRoutes
];