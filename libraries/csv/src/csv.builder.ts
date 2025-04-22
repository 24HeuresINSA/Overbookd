const DEFAULT_DELIMITER = ",";
const SPECIAL_CHARACTERS = /["\n\r,\\]/;
const ALL_QUOTES = /"/g;

type CsvData = string | number | boolean | null | undefined;
type CsvObject = Record<string, CsvData>;

export class CSVBuilder<
  Item extends CsvObject,
  Header extends keyof Item = keyof Item,
> {
  private constructor(
    private readonly items: Item[],
    private readonly headers: Header[],
    private readonly delimiter: string = DEFAULT_DELIMITER,
    private readonly translations: Map<Header, string> = new Map(),
  ) {}

  static from<T extends CsvObject>(items: T[]): CSVBuilder<T, keyof T> {
    const headers = Object.keys(items.at(0) ?? {});
    return new CSVBuilder(items, headers);
  }

  select(headers: Header[]): CSVBuilder<Item, Header> {
    return new CSVBuilder(
      this.items,
      headers,
      this.delimiter,
      this.translations,
    );
  }

  delimitWith(delimiter: string): CSVBuilder<Item, Header> {
    return new CSVBuilder(
      this.items,
      this.headers,
      delimiter,
      this.translations,
    );
  }

  translate(translations: [Header, string][]) {
    return new CSVBuilder(
      this.items,
      this.headers,
      this.delimiter,
      new Map(translations),
    );
  }

  build(): string {
    const headers = this.headers
      .map((header) => this.translations.get(header) ?? header)
      .join(this.delimiter);

    const lines = this.items.map((item) =>
      this.headers
        .map((key) => this.escapeWhenNeeded(item[key.toString()]))
        .join(this.delimiter),
    );

    return [headers, ...lines].join("\n");
  }

  private escapeWhenNeeded(value: CsvData) {
    if (typeof value !== "string") return value;
    const hasSpecialCharacters = SPECIAL_CHARACTERS.test(value);
    const hasDelimiter = value.includes(this.delimiter);
    const shouldEscape = hasSpecialCharacters || hasDelimiter;
    return shouldEscape ? escape(value) : value;
  }
}

function escape(value: string): string {
  return `"${value.replace(ALL_QUOTES, '""')}"`;
}
