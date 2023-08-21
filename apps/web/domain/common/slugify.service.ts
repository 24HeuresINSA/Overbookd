export class SlugifyService {
  private static readonly convert = new Map<string, string>([
    ["à", "a"],
    ["â", "a"],
    ["ä", "a"],
    ["é", "e"],
    ["è", "e"],
    ["ê", "e"],
    ["ë", "e"],
    ["î", "i"],
    ["ï", "i"],
    ["ô", "o"],
    ["ö", "o"],
    ["ò", "o"],
    ["û", "u"],
    ["ü", "u"],
    ["ù", "u"],
    ["ç", "c"],
  ]);

  slugify(name?: string): string | undefined {
    if (!name) return undefined;
    return SlugifyService.apply(name);
  }

  static apply(name: string): string {
    const SLUG_SEPARATOR = "-";
    const spaces = new RegExp("[ ]+", "gm");
    const nonStandardChar = new RegExp("[^A-Za-z0-9]", "gm");
    return name
      .toLowerCase()
      .replace(nonStandardChar, (char) => this.convert.get(char) ?? char)
      .replace(spaces, SLUG_SEPARATOR);
  }
}
