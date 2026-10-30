import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbnFormat'
})
export class IsbnFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length !== 13) {
      return value;
    }

    // Beispiel: 978-1-2345-6789-0
    const parts = [
      value.slice(0, 3),   // Präfix (978 oder 979)
      value.slice(3, 4),   // Gruppe (Sprache/Region)
      value.slice(4, 8),   // Herausgeber
      value.slice(8, 12),  // Titel
      value.slice(12)      // Prüfziffer
    ];

    return parts.join('-');
  }
}