import { Component } from '@angular/core';
import { BooksOverviewPage } from './books-portal/books-overview-page/books-overview-page';


@Component({
    selector: 'app-root',
    imports: [BooksOverviewPage],
    templateUrl: './app.html',
    styleUrl: './app.css'
    })
export class App{}
