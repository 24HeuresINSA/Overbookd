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
    ["œ", "oe"],
    ["æ", "ae"],
    ["ø", "o"],
  ]);

  private constructor() {}

  static apply(sentence: string): string {
    const SLUG_SEPARATOR = "-";
    const newWordDelimiter = new RegExp("[ '/?]+", "gm");
    const nonStandardChar = new RegExp("[^A-Za-z0-9]", "gm");
    const startOrEndWithSeparator = new RegExp(
      `^[${SLUG_SEPARATOR}]+|[${SLUG_SEPARATOR}]+$`,
      "gm",
    );
    return sentence
      .toLowerCase()
      .replace(nonStandardChar, (char) => this.convert.get(char) ?? char)
      .replace(newWordDelimiter, SLUG_SEPARATOR)
      .replace(startOrEndWithSeparator, "");
  }

  static applyOnOptional(sentence?: string): string | undefined {
    return sentence ? this.apply(sentence) : undefined;
  }
}
