export class SlugifyService {
  slugify(name: string): string {
    const SLUG_SEPARATOR = '-';
    const spaces = new RegExp(/[ ]+/gm);
    return name.replace(spaces, SLUG_SEPARATOR).toLowerCase();
  }
}
