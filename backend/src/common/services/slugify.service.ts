import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugifyService {
  private convert = {
    à: 'a',
    â: 'a',
    ä: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    î: 'i',
    ï: 'i',
    ô: 'o',
    ö: 'o',
    ò: 'o',
    û: 'u',
    ü: 'u',
    ù: 'u',
    ç: 'c',
  };

  slugify(name?: string): string | undefined {
    if (!name) return undefined;
    const SLUG_SEPARATOR = '-';
    const spaces = new RegExp(/[ ]+/gm);
    const nonStandardChar = new RegExp(/[^A-Za-z0-9]/gm);
    return name
      .toLowerCase()
      .replace(nonStandardChar, (char) => this.convert[char] ?? char)
      .replace(spaces, SLUG_SEPARATOR);
  }
}
